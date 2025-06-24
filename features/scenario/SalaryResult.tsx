import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface SalaryStats {
  averageSalary: number;
  totalCount: number;
  myRank: number;
  percentile: number;
}

interface PerQuestionSalary {
  questionId: string;
  question: string;
  myChoice: string;
  averageSalary: number | null;
  count: number;
}

const SalaryResult = () => {
  const { marketerType, answers, salaryInfo, reset, questions } = useScenarioStore();
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perQuestionSalaries, setPerQuestionSalaries] = useState<PerQuestionSalary[]>([]);
  const router = useRouter();

  // 연차 구간 계산 함수 추가
  const getExperienceGroup = (years: number | null): string => {
    if (years === null || years === undefined) return 'unknown';
    if (years <= 2) return 'junior'; // 0-2년
    if (years <= 5) return 'mid'; // 3-5년
    if (years <= 10) return 'senior'; // 6-10년
    return 'lead'; // 11년+
  };

  useEffect(() => {
    if (!salaryInfo?.salary) {
      setLoading(false);
      return;
    }

    const fetchSalaryStats = async () => {
      try {
        const db = getFirestore(app);
        const resultsRef = collection(db, 'results');
        
        // 같은 마케터 타입과 답변을 가진 사용자들 중 연봉을 입력한 사람들만 필터링
        const q = query(
          resultsRef,
          where('marketerType', '==', marketerType),
          where('hasSalary', '==', true)
        );

        const querySnapshot = await getDocs(q);
        const salaries: number[] = [];
        const myExperienceGroup = getExperienceGroup(salaryInfo.yearsOfExperience);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // 한 문제라도 같은 답변을 한 사용자라면 포함
          if (data.answers && Array.isArray(data.answers) && data.salary) {
            // 연차 구간이 같은 사용자만 포함
            const otherExperienceGroup = getExperienceGroup(data.yearsOfExperience);
            if (otherExperienceGroup !== myExperienceGroup) return;
            
            let hasMatch = false;
            for (let i = 0; i < answers.length; i++) {
              const myTags = answers[i].tags.join(',');
              const otherTags = data.answers[i]?.tags?.join(',') || '';
              if (myTags === otherTags) {
                hasMatch = true;
                break;
              }
            }
            
            if (hasMatch) {
              salaries.push(data.salary);
            }
          }
        });

        if (salaries.length === 0) {
          setError('아직 같은 패턴의 답변을 한 사용자가 없습니다.');
          setLoading(false);
          return;
        }

        // 상위/하위 5% 제외한 평균 계산
        const sortedSalaries = salaries.sort((a, b) => a - b);
        const totalCount = sortedSalaries.length;
        const excludeCount = Math.ceil(totalCount * 0.05); // 5%
        const filteredSalaries = sortedSalaries.slice(excludeCount, totalCount - excludeCount);
        
        // 필터링 후 배열이 비어있으면 에러 처리
        if (filteredSalaries.length === 0) {
          setError('충분한 데이터가 없어 통계를 계산할 수 없습니다.');
          setLoading(false);
          return;
        }
        
        const averageSalary = filteredSalaries.reduce((sum, salary) => sum + salary, 0) / filteredSalaries.length;
        
        // 내 순위 계산
        const mySalary = salaryInfo.salary!;
        const myRank = sortedSalaries.filter(salary => salary > mySalary).length + 1;
        const percentile = ((totalCount - myRank + 1) / totalCount) * 100;

        setStats({
          averageSalary: Math.round(averageSalary),
          totalCount,
          myRank,
          percentile: Math.round(percentile * 10) / 10,
        });

      } catch (err) {
        console.error('Error fetching salary stats:', err);
        setError('통계를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryStats();
  }, [marketerType, answers, salaryInfo]);

  // 문항별 같은 선택의 평균 연봉 계산
  useEffect(() => {
    if (!salaryInfo?.salary || !answers || answers.length === 0) return;
    const fetchPerQuestionSalaries = async () => {
      try {
        const db = getFirestore(app);
        const resultsRef = collection(db, 'results');
        const q = query(
          resultsRef,
          where('marketerType', '==', marketerType),
          where('hasSalary', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const myExperienceGroup = getExperienceGroup(salaryInfo.yearsOfExperience);
        const perQuestion: PerQuestionSalary[] = await Promise.all(
          answers.map(async (answer, idx) => {
            const salaries: number[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.answers && Array.isArray(data.answers) && data.salary) {
                // 연차 구간이 같은 사용자만 포함
                const otherExperienceGroup = getExperienceGroup(data.yearsOfExperience);
                if (otherExperienceGroup !== myExperienceGroup) return;
                
                const otherAnswer = data.answers[idx];
                if (otherAnswer && otherAnswer.tags.join(',') === answer.tags.join(',')) {
                  salaries.push(data.salary);
                }
              }
            });
            if (salaries.length === 0) {
              return {
                questionId: answer.questionId,
                question: questions.find(q => q.id === answer.questionId)?.question || '',
                myChoice: answer.tags.join(', '),
                averageSalary: null,
                count: 0,
              };
            }
            const sorted = salaries.sort((a, b) => a - b);
            const total = sorted.length;
            const exclude = Math.ceil(total * 0.05);
            const filtered = sorted.slice(exclude, total - exclude);
            
            // 필터링 후 배열이 비어있으면 null 반환
            if (filtered.length === 0) {
              return {
                questionId: answer.questionId,
                question: questions.find(q => q.id === answer.questionId)?.question || '',
                myChoice: answer.tags.join(', '),
                averageSalary: null,
                count: total,
              };
            }
            
            const avg = filtered.reduce((sum, s) => sum + s, 0) / filtered.length;
            return {
              questionId: answer.questionId,
              question: questions.find(q => q.id === answer.questionId)?.question || '',
              myChoice: answer.tags.join(', '),
              averageSalary: Math.round(avg),
              count: total,
            };
          })
        );
        setPerQuestionSalaries(perQuestion);
      } catch (e) {
        // 무시 (에러시 빈 배열)
        setPerQuestionSalaries([]);
      }
    };
    fetchPerQuestionSalaries();
  }, [marketerType, answers, salaryInfo, questions]);

  const getMarketerTypeName = (type: string) => {
    const typeNames = {
      'B2C': 'B2C 마케터',
      'B2B': 'B2B 마케터',
      '이커머스': '이커머스 마케터',
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  const getExperienceGroupName = (years: number | null): string => {
    if (years === null || years === undefined) return '연차 미입력';
    if (years <= 2) return '신입 (0-2년)';
    if (years <= 5) return '주니어 (3-5년)';
    if (years <= 10) return '시니어 (6-10년)';
    return '리드 (11년+)';
  };

  const getPercentileText = (percentile: number) => {
    if (percentile >= 90) return '상위 10%';
    if (percentile >= 80) return '상위 20%';
    if (percentile >= 70) return '상위 30%';
    if (percentile >= 60) return '상위 40%';
    if (percentile >= 50) return '상위 50%';
    if (percentile >= 40) return '하위 40%';
    if (percentile >= 30) return '하위 30%';
    if (percentile >= 20) return '하위 20%';
    return '하위 10%';
  };

  const handleReset = () => {
    reset();
    router.push('/scenarios');
  };

  // 카카오톡 공유 함수 (간단 버전)
  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.Share) {
      alert('카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('f265d81144e358dad13c422075f42c62');
    }
    const shareUrl = window.location.href;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '마케터 연봉 비교 통계',
        description: '더 많은 사람들이 참여할수록 연봉 통계가 더 정확해져요!\n나와 비슷한 마케터들의 연봉을 확인해보세요.',
        imageUrl: `${window.location.origin}/og-images/main.png`,
        link: {
          webUrl: shareUrl,
          mobileWebUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '연봉 통계 보러가기',
          link: {
            webUrl: shareUrl,
            mobileWebUrl: shareUrl,
          },
        },
      ],
    });
  };

  if (!salaryInfo?.salary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">💼 연봉 통계 결과</h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 mb-6 hover:shadow-2xl transition-all duration-300">
            <p className="text-slate-600 mb-4">
              연봉 정보를 입력하지 않으셨기 때문에 비교 통계를 확인할 수 없습니다.
            </p>
            <p className="text-sm text-slate-500">
              연봉 비교를 원하시면 처음부터 다시 진단하시고 연봉을 입력해주세요.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
          >
            다시 진단하기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">⏳ 연봉 통계 결과</h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">📊 연봉 통계 결과</h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 mb-6 hover:shadow-2xl transition-all duration-300">
            <p className="text-red-600 mb-4">아직 데이터가 부족해요! 🐣</p>
            <p className="text-sm text-slate-500 mb-4">
              더 많은 사람들이 참여하면, 연봉별 통계를 볼 수 있을 거에요!
            </p>
            <button
              onClick={handleKakaoShare}
              className="w-full py-3 rounded-xl text-lg font-bold flex items-center justify-center gap-2 mb-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgb(255, 244, 19)' }}
            >
              <img src="/og-images/KakaoTalk_logo.png" alt="카카오톡" style={{ width: 24, height: 24 }} />
              카카오톡으로 공유하기
            </button>
          </div>
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
          >
            다시 진단하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">📈 연봉 통계 결과</h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 mb-6 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {getMarketerTypeName(marketerType!)} 연봉 통계
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            연차 구간: <span className="font-semibold text-blue-600">
              {getExperienceGroupName(salaryInfo.yearsOfExperience)}
            </span>
          </p>
          
          <div className="space-y-4">
            {/* 평균 연봉 */}
            <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-sm text-blue-700 mb-1 flex items-center gap-1">
                📊 나와 비슷한 선택을 한 사용자의 평균 연봉
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {stats?.averageSalary.toLocaleString()}만원
              </p>
              <p className="text-xs text-blue-600 mt-1">
                (총 {stats?.totalCount}명 중, 상위/하위 5% 제외)
              </p>
            </div>

            {/* 내 연봉과 순위 */}
            <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-sm text-green-700 mb-1 flex items-center gap-1">
                💰 내 연봉
              </p>
              <p className="text-xl font-bold text-green-800">
                {salaryInfo.salary?.toLocaleString()}만원
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                🏆 {getPercentileText(stats?.percentile || 0)} ({stats?.percentile}%)
              </p>
            </div>

            {/* 통계 설명 */}
            <div className="text-xs text-slate-500 space-y-1">
              <p>• 같은 마케터 유형, 연차, 답변 패턴을 가진 사용자 기준</p>
              <p>• 연봉을 입력한 사용자 {stats?.totalCount}명 중</p>
              <p>• 극단값(상위/하위 5%)을 제외한 평균</p>
            </div>
          </div>
        </div>

        {/* 문항별 평균 연봉 카드 */}
        {perQuestionSalaries.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center justify-center gap-2">
              📋 문항별 나와 비슷한 사용자의 평균 연봉
            </h3>
            <div className="space-y-4">
              {perQuestionSalaries.map((item, idx) => {
                // 내 선택 텍스트 찾기
                const questionObj = questions.find(q => q.id === item.questionId);
                let myChoiceText = '';
                if (questionObj) {
                  const answerTags = answers[idx]?.tags.join(',');
                  const found = questionObj.choices.find(c => c.tags.join(',') === answerTags);
                  if (found) myChoiceText = found.text;
                }
                return (
                  <div key={item.questionId} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-left shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/30">
                    <div className="text-base font-semibold text-slate-700 mb-2">
                      Q{idx + 1}. {item.question}
                    </div>
                    <div className="flex items-start gap-x-1 mb-2">
                      <span className="text-sm text-slate-500 shrink-0">내 선택:</span>
                      <span className="text-sm font-semibold text-blue-700">{myChoiceText || item.myChoice}</span>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="text-sm text-slate-500">같은 선택을 한 사용자의 평균 연봉:</span>
                      {item.averageSalary !== null && !isNaN(item.averageSalary) ? (
                        <span className="text-base font-bold text-green-700">{item.averageSalary.toLocaleString()}만원</span>
                      ) : (
                        <span className="text-sm text-slate-400">데이터 없음</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
          >
            다시 진단하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryResult; 