import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import { analyzeAnswers } from './scenario.analysis';
import ScenarioRadarChart from './ScenarioRadarChart';
import { getClientId, calculatePercentage, encodeIdx, decodeIdx, encodeShareCode, decodeShareCode } from '@/lib/utils';
import { Metadata } from 'next';
import questionsData from './scenario.questions.json';
import { Question } from './scenario.types';

declare global {
  interface Window {
    Kakao: any;
  }
}

export async function generateMetadata({ searchParams }: { searchParams: Record<string, string> }): Promise<Metadata> {
  const type = searchParams.type || "마케터 유형";
  const url = `https://도메인/result?type=${encodeURIComponent(type)}`;
  return {
    title: `${type}`,
    description: `${type} 유형의 마케터 결과를 확인하세요.`,
    openGraph: {
      title: `${type}`,
      description: `${type} 유형의 마케터 결과를 확인하세요.`,
      type: "website",
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

interface Statistics {
  personaCount: Record<string, number>;
  questionChoiceStats: Record<string, Record<string, number>>;
  total: number;
}

interface ScenarioResultProps {
  sharedResult?: any;
}

const ScenarioResult = ({ sharedResult }: ScenarioResultProps) => {
  const { answers, questions, reset, salaryInfo, marketerType } = useScenarioStore(state => ({
    answers: state.answers,
    questions: state.questions,
    reset: state.reset,
    salaryInfo: state.salaryInfo,
    marketerType: state.marketerType,
  }));
  const router = useRouter();
  const searchParams = useSearchParams();

  // code 파라미터 사용 (idx+id 시퀀스 동시 encode)
  const codeParam = searchParams ? searchParams.get('code') : null;
  let sharedIdxArr: number[] | null = null;
  let sharedIdArr: string[] | null = null;
  let decodeError = false;
  if (codeParam) {
    try {
      const decoded = decodeShareCode(codeParam);
      if (!decoded) throw new Error('decode failed');
      sharedIdxArr = decoded.idxArr;
      sharedIdArr = decoded.idArr;
      if (!sharedIdxArr || !sharedIdArr) throw new Error('decode failed');
    } catch {
      sharedIdxArr = null;
      sharedIdArr = null;
      decodeError = true;
    }
  }

  // code 파라미터로 진입 시 questions를 idArr로 재구성
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    if (codeParam && sharedIdArr && sharedIdArr.length > 0) {
      // idArr 순서대로 questionsData에서 매칭
      const allQuestions = questionsData as Question[];
      const matched = sharedIdArr.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[];
      setLoadedQuestions(matched);
    } else {
      setLoadedQuestions(questions);
    }
  }, [codeParam, JSON.stringify(sharedIdArr), questions]);

  // code 파라미터로 진입 시 idx 배열을 answers 객체로 복원
  const restoredAnswers = useMemo(() => {
    if (codeParam && sharedIdxArr && loadedQuestions.length === sharedIdxArr.length) {
      return sharedIdxArr.map((idx, i) => {
        const q = loadedQuestions[i];
        const choice = q.choices[idx];
        return {
          questionId: q.id,
          tags: choice.tags,
          difficulty: q.difficulty,
        };
      });
    }
    return answers;
  }, [codeParam, sharedIdxArr, loadedQuestions, answers]);

  // sharedResult가 있으면 해당 데이터로 대체
  const resultAnswers = sharedResult ? sharedResult.answers : restoredAnswers;
  const resultPersona = sharedResult ? sharedResult.persona : undefined;
  const resultSalaryInfo = sharedResult ? sharedResult.salaryInfo : salaryInfo;

  const { persona, tagScores } = useMemo(() => {
    if (sharedResult && resultPersona) {
      // 공유 결과 데이터 사용
      const scores: { [tag: string]: number } = {};
      resultAnswers.forEach((answer: any) => {
        answer.tags.forEach((tag: string) => {
          scores[tag] = (scores[tag] || 0) + 1;
        });
      });
      return { persona: resultPersona, tagScores: scores };
    } else {
      // 기존 로직
      const scores: { [tag: string]: number } = {};
      restoredAnswers.forEach(answer => {
        answer.tags.forEach(tag => {
          scores[tag] = (scores[tag] || 0) + 1;
        });
      });
      const personaResult = analyzeAnswers(restoredAnswers);
      return { persona: personaResult, tagScores: scores };
    }
  }, [sharedResult, resultPersona, resultAnswers, restoredAnswers]);

  // 통계 상태
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then((data: Statistics) => {
        setStatistics(data);
        // 내 유형의 순위 계산
        if (data.personaCount && persona.title) {
          const sorted = Object.entries(data.personaCount).sort((a, b) => b[1] - a[1]);
          const rank = sorted.findIndex(([title]) => title === persona.title);
          setMyRank(rank === -1 ? null : rank + 1);
        }
      });
  }, [persona.title]);

  // 결과페이지 진입 시 view_result 이벤트 트리거
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_result',
        title: persona.title
      });
    }
  }, [persona.title]);

  // 결과 저장 (최초 1회만)
  useEffect(() => {
    if (restoredAnswers.length > 0) {
      const clientId = getClientId();
      fetch('/api/submitResult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          persona, 
          answers: restoredAnswers, 
          clientId, 
          salaryInfo 
        }),
      });
    }
    // eslint-disable-next-line
  }, []);

  // 내 답변과 전체 평균 비교 계산
  const getAnswerComparison = (questionId: string, myTags: string[]) => {
    if (!statistics?.questionChoiceStats[questionId]) return null;
    
    const myChoiceKey = myTags.sort().join(',');
    const myChoiceCount = statistics.questionChoiceStats[questionId][myChoiceKey] || 0;
    const totalAnswers = Object.values(statistics.questionChoiceStats[questionId]).reduce((a, b) => a + b, 0);
    const percentage = calculatePercentage(myChoiceCount, totalAnswers);
    
    return { percentage, totalAnswers, myChoiceCount };
  };

  // 이모지 매핑 함수 추가
  const getTitleEmoji = (title: string) => {
    if (!title) return '';
    if (title.includes('성과')) return '🏆';
    if (title.includes('데이터')) return '📊';
    if (title.includes('고객 경험')) return '🤝';
    if (title.includes('트렌드')) return '🔥';
    if (title.includes('브랜드')) return '💎';
    if (title.includes('혁신') || title.includes('실험')) return '🧪';
    if (title.includes('단기')) return '⚡';
    if (title.includes('공감')) return '😊';
    return '✨';
  };

  // 공유 버튼 클릭 시 code 파라미터 복사 (idArr도 포함)
  const handleShare = () => {
    if (!restoredAnswers || restoredAnswers.length === 0) {
      alert('공유할 데이터가 없습니다.');
      return;
    }
    const idxArr = restoredAnswers.map((ans, i) => {
      const q = loadedQuestions[i];
      if (!q) return -1;
      // 선택한 choice의 인덱스 찾기
      const idx = q.choices.findIndex((c) => JSON.stringify(c.tags) === JSON.stringify(ans.tags));
      return idx;
    });
    const idArr = loadedQuestions.map(q => q.id);
    if (idxArr.some((v) => v < 0)) {
      alert('공유할 수 없는 답변이 있습니다.');
      return;
    }
    const codeStr = encodeShareCode(idxArr, idArr); // idx+id 시퀀스 encode
    const shareUrl = `${window.location.origin}/scenarios/result?code=${codeStr}`;
    navigator.clipboard.writeText(shareUrl);
    alert('공유 링크가 복사되었습니다!');
  };

  // 카카오 SDK 동적 로드 (최초 1회)
  const kakaoLoaded = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Kakao && !document.getElementById('kakao-sdk')) {
      const script = document.createElement('script');
      script.id = 'kakao-sdk';
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.async = true;
      script.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init('f265d81144e358dad13c422075f42c62');
        }
        kakaoLoaded.current = true;
      };
      document.body.appendChild(script);
    } else if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('f265d81144e358dad13c422075f42c62');
      kakaoLoaded.current = true;
    }
  }, []);

  // 카카오톡 공유 함수
  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.Share) {
      alert('카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('f265d81144e358dad13c422075f42c62');
    }
    // 공유 링크 복사와 동일하게 code 파라미터가 붙은 결과페이지 링크 생성
    const idxArr = restoredAnswers.map((ans, i) => {
      const q = loadedQuestions[i];
      if (!q) return -1;
      const idx = q.choices.findIndex((c) => JSON.stringify(c.tags) === JSON.stringify(ans.tags));
      return idx;
    });
    const idArr = loadedQuestions.map(q => q.id);
    if (idxArr.some((v) => v < 0)) {
      alert('공유할 수 없는 답변이 있습니다.');
      return;
    }
    const codeStr = encodeShareCode(idxArr, idArr);
    const shareUrl = `${window.location.origin}/scenarios/result?code=${codeStr}`;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${getTitleEmoji(persona.title)} ${persona.title}`,
        description: `10문항으로 알아보는 나의 마케터 유형과 강점!\n강점: ${(persona.strengths || []).join(', ')}`,
        imageUrl: `${window.location.origin}/og-images/result.png`,
        link: {
          webUrl: shareUrl,
          mobileWebUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '결과 보러가기',
          link: {
            webUrl: shareUrl,
            mobileWebUrl: shareUrl,
          },
        },
      ],
    });
  };

  // code 복원 실패 시 에러 안내
  if (decodeError) {
    return <div className="p-8 text-center text-red-500">공유 데이터 해석에 실패했습니다.<br />링크가 잘못되었거나 손상되었습니다.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center">
        <p className="text-base sm:text-lg font-medium text-blue-600">
          당신의 마케터 유형 분석 결과
        </p>
        {marketerType && (
          <div className="text-lg font-semibold text-slate-700 mb-1">{marketerType} 마케터</div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 text-slate-800 flex items-center justify-center gap-2">
          <span>{getTitleEmoji(persona.title)}</span> {persona.title}
        </h1>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center text-left">
          <div className="order-2 md:order-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-700">
              세부 성향 분석
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-words">
              {persona.description}
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">당신의 강점</h3>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-slate-500">
                {(persona.strengths as any[]).map((s: any) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">성장을 위한 제언</h3>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-slate-500">
                {(persona.weaknesses as any[]).map((w: any) => <li key={w}>{w}</li>)}
              </ul>
            </div>
          </div>
          <div className="order-1 md:order-2 flex flex-col items-center">
            <ScenarioRadarChart data={tagScores} />
            {/* 통계 영역을 차트 아래에 배치 */}
            {statistics && (
              <div className="mt-8 w-full text-center">
                <div className="text-sm sm:text-base text-slate-500 mb-1">
                  지금까지 <b>{statistics.total}</b>명이 테스트를 완료했습니다.
                </div>
                <div className="text-base sm:text-lg font-bold text-blue-700">
                  가장 많은 유형: {Object.entries(statistics.personaCount).sort((a, b) => b[1] - a[1])[0][0]}
                </div>
                <div className="text-sm sm:text-base text-slate-600 mt-1">
                  {myRank !== null ? (
                    <>내 유형은 전체 중 <b>{myRank}</b>번째로 많아요.</>
                  ) : (
                    <span>
                      내 유형과 같은 사람은 아직 없어요.<br />
                      <span className="text-lg font-bold text-pink-500">당신이 처음입니다! 🥳🎉</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 내 답변과 전체 평균 비교 섹션 */}
        {statistics && (
          <div className="mt-12 text-left">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-700 text-center">
              내 답변과 다른 사람들의 비교
            </h2>
            <div className="space-y-4">
              {restoredAnswers.map((answer, index) => {
                const question = loadedQuestions.find(q => q.id === answer.questionId);
                const comparison = getAnswerComparison(answer.questionId, answer.tags);
                
                if (!question || !comparison) return null;
                
                const isPopular = comparison.percentage >= 50;
                const isUnique = comparison.percentage <= 20;
                
                return (
                  <div key={answer.questionId} className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm sm:text-base font-semibold text-slate-700 mb-2">
                      Q{index + 1}. {question.question}
                    </div>
                    <div className="flex items-center justify-between flex-wrap">
                      <div className="text-sm sm:text-base text-slate-600">
                        내 선택: <span className="font-medium">
                          {(() => {
                            const tagsKey = answer.tags.join(',');
                            const found = question.choices.find(c => c.tags.join(',') === tagsKey);
                            return found ? found.text : answer.tags.join(', ');
                          })()}
                        </span>
                      </div>
                      <div className="flex flex-col items-start sm:items-end min-w-[60px]">
                        <span className={`text-base font-bold ${
                          isPopular ? 'text-green-600' : 
                          isUnique ? 'text-purple-600' : 'text-blue-600'
                        }`}>
                          {comparison.percentage}%
                        </span>
                        <span className="text-xs text-slate-500">100명 중 {Math.round(comparison.percentage)}명이 같은 대답</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs sm:text-sm text-slate-500">
                      {isPopular && "🎯 대부분의 마케터와 비슷한 생각을 가지고 있어요!"}
                      {isUnique && "💎 독특한 관점을 가지고 있어요!"}
                      {!isPopular && !isUnique && "🤔 중간 정도의 선택이에요."}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center mt-12 space-y-4">
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            다시 진단하기
          </button>
          {/* 공유 버튼: code 파라미터 없고 answers가 1개 이상일 때만 노출 */}
          {(!codeParam && restoredAnswers && restoredAnswers.length > 0) && (
            <>
              <button
                onClick={handleShare}
                className="w-full bg-gray-100 hover:bg-gray-200 text-blue-700 font-bold py-3 rounded-lg text-lg border border-gray-300"
              >
                결과 공유 링크 복사
              </button>
              <button
                onClick={handleKakaoShare}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-lg border border-yellow-300 flex items-center justify-center gap-2"
              >
                <img src="/og-images/KakaoTalk_logo.png" alt="카카오톡" style={{ width: 24, height: 24 }} />
                결과 보러가기
              </button>
            </>
          )}
          {salaryInfo?.salary && (
            <div>
              <button
                onClick={() => router.push('/scenarios/salary-result')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
              >
                연봉결과 페이지 보기
              </button>
              <p className="text-[11px] sm:text-sm text-slate-500 mt-2">
                나와 같은 선택을 한 사용자들의 평균 연봉을 확인해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioResult; 