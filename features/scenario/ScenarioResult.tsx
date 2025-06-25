import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import { analyzeAnswers, PersonalizedResult } from './scenario.analysis';
import { getClientId, encodeShareCode } from '@/lib/utils';
import questionsData from './scenario.questions.json';
import { Question } from './scenario.types';
import { Metadata } from 'next';
import ScenarioRadarChart from './ScenarioRadarChart';

declare global {
  interface Window {
    Kakao: any;
    dataLayer: any[];
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

  // 애니메이션 상태
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [statistics, setStatistics] = useState<any>(null);
  const [fixedScores, setFixedScores] = useState<{[key: string]: {displayScore: number, selectionRate: number}}>({});
  const [showAllScores, setShowAllScores] = useState(false);
  const [isScoreCalculating, setIsScoreCalculating] = useState(true);
  const [animatedScores, setAnimatedScores] = useState<{[key: string]: number}>({});
  const [resultId, setResultId] = useState<string | null>(null);
  const hasSubmitted = useRef(false);

  // 컬러 테마 데이터
  const colorThemes = [
    {
      name: 'Spring',
      emoji: '🌸',
      colors: ['#FFB5BA', '#FFE5AD', '#B5E5CF'],
      gradient: 'from-rose-200 via-yellow-200 to-green-200',
      cardBg: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
      accentColor: 'rose',
    },
    {
      name: 'Summer', 
      emoji: '🌊',
      colors: ['#B5D5FF', '#E5B5FF', '#FFB5E5'],
      gradient: 'from-blue-200 via-purple-200 to-pink-200',
      cardBg: 'from-blue-50 to-purple-50',
      borderColor: 'border-blue-200',
      accentColor: 'blue',
    },
    {
      name: 'Autumn',
      emoji: '🍂',
      colors: ['#FFB5AD', '#FFDB99', '#D4B5A0'],
      gradient: 'from-orange-200 via-amber-200 to-red-200',
      cardBg: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      accentColor: 'orange',
    },
    {
      name: 'Winter',
      emoji: '❄️',
      colors: ['#B5E5FF', '#E5D5FF', '#FFE5E5'],
      gradient: 'from-cyan-200 via-violet-200 to-rose-200',
      cardBg: 'from-cyan-50 to-violet-50',
      borderColor: 'border-cyan-200',
      accentColor: 'cyan',
    },
  ];

  const currentTheme = colorThemes[currentColorIndex];

  // 결과 분석
  const result: PersonalizedResult = useMemo(() => {
    if (sharedResult && sharedResult.result) {
      return sharedResult.result;
    }
    return analyzeAnswers(answers);
  }, [sharedResult, answers]);

  // 점수 계산 (최초 1회만)
  useEffect(() => {
    // 이미 계산된 경우 건너뛰기
    if (Object.keys(fixedScores).length > 0) return;
    
    setIsLoaded(true);
    
    // 즉시 랜덤 점수 계산 (통계 데이터 없이도 실행)
    const scores: {[key: string]: {displayScore: number, selectionRate: number}} = {};
    Object.entries(result.tagScores).forEach(([tagName, tagScore]) => {
      // 점수대별 차등 랜덤 감점
      let randomDeduction;
      const originalScore = tagScore.score;
      
      if (originalScore >= 100) {
        randomDeduction = Math.floor(Math.random() * 9) + 1;
      } else if (originalScore >= 90) {
        randomDeduction = Math.floor(Math.random() * 16);
      } else if (originalScore >= 80) {
        randomDeduction = Math.floor(Math.random() * 26);
      } else if (originalScore >= 70) {
        randomDeduction = Math.floor(Math.random() * 36);
      } else if (originalScore >= 60) {
        randomDeduction = Math.floor(Math.random() * 46);
      } else {
        randomDeduction = Math.floor(Math.random() * 21);
      }
      
      const displayScore = Math.max(0, originalScore - randomDeduction);
      const selectionRate = Math.floor(Math.random() * 60) + 15; // 임시 값
      
      scores[tagName] = { displayScore, selectionRate };
    });
    
    setFixedScores(scores);
    
    // 통계 데이터로 선택 비율 업데이트
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => {
        setStatistics(data);
        
        // 선택 비율만 업데이트 (점수는 그대로 유지)
        const updatedScores = { ...scores };
        Object.keys(scores).forEach(tagName => {
          const uniqueUserCount = data.uniqueUserTagCount?.[tagName] || 0;
          const fallbackCount = data.answerCount?.[tagName] || 0;
          const tagCount = uniqueUserCount > 0 ? uniqueUserCount : Math.min(fallbackCount, data.total || 1);
          const totalUsers = data.total || 1;
          const selectionRate = totalUsers > 0 ? Math.min(100, Math.round((tagCount / totalUsers) * 100)) : Math.floor(Math.random() * 60) + 15;
          
          updatedScores[tagName].selectionRate = selectionRate;
        });
        
        setFixedScores(updatedScores);
      })
      .catch(err => console.error('Statistics fetch error:', err));
    
    // 500ms 후 점수 애니메이션 시작 (빠르게)
    setTimeout(() => {
      setIsScoreCalculating(false);
      Object.entries(scores).forEach(([tagName, scoreData]) => {
        // 각 태그마다 약간씩 지연시켜서 순차적으로 애니메이션
        const delay = Object.keys(scores).indexOf(tagName) * 150; // 더 빠르게
        setTimeout(() => {
          animateScore(tagName, scoreData.displayScore);
        }, delay);
      });
    }, 500); // 더 빠르게 시작
  }, []); // 의존성 배열 비움 - 최초 1회만 실행

  // 개인 컬러에 맞는 배경색 생성 함수
  const getPersonalColorBackground = (colorText: string) => {
    // 컬러 텍스트에서 색상 추출 및 배경색 매핑
    const colorMappings: { [key: string]: string } = {
      // 데이터 사이언티스트 마케터
      '생각이 머무는 안개의 짙은 그레이': 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300',
      '신중하게 타오르는 청록의 불꽃': 'bg-gradient-to-r from-cyan-100 to-teal-200 border-cyan-300',
      
      // 고객 경험 아키텍트
      '따뜻한 마음이 피어나는 코랄 핑크': 'bg-gradient-to-r from-pink-100 to-coral-200 border-pink-300',
      '공감의 물결이 흐르는 연둣빛 바다': 'bg-gradient-to-r from-teal-100 to-green-200 border-teal-300',
      
      // 디지털 이노베이터
      '새벽을 깨우는 전기빛 바이올렛': 'bg-gradient-to-r from-violet-100 to-purple-200 border-violet-300',
      '경계를 부수는 네온 오렌지': 'bg-gradient-to-r from-orange-100 to-red-200 border-orange-300',
      
      // 트렌드 캐처
      '순간을 포착하는 홀로그램 실버': 'bg-gradient-to-r from-slate-100 to-gray-200 border-slate-300',
      '트렌드가 춤추는 무지개빛 프리즘': 'bg-gradient-to-r from-indigo-100 to-purple-200 border-indigo-300',
      
      // 퍼포먼스 드라이버
      '목표를 향한 화살의 골드': 'bg-gradient-to-r from-yellow-100 to-amber-200 border-yellow-300',
      '승리를 새기는 다이아몬드 화이트': 'bg-gradient-to-r from-white to-gray-100 border-gray-300',
      
      // 안정성 마스터
      '신뢰가 쌓이는 깊은 네이비': 'bg-gradient-to-r from-blue-100 to-indigo-200 border-blue-300',
      '안정감이 흐르는 모스 그린': 'bg-gradient-to-r from-green-100 to-emerald-200 border-green-300',
      
      // 감성 스토리텔러
      '이야기가 시작되는 미드나잇 블루': 'bg-gradient-to-r from-blue-100 to-indigo-200 border-blue-300',
      '감동이 피어나는 벚꽃 로즈': 'bg-gradient-to-r from-pink-100 to-rose-200 border-pink-300',
      
      // 데이터 기반 고객 경험 설계자
      '마음을 읽는 크리스탈 블루': 'bg-gradient-to-r from-blue-100 to-cyan-200 border-blue-300',
      '통찰이 빛나는 갤럭시 퍼플': 'bg-gradient-to-r from-purple-100 to-violet-200 border-purple-300',
      
      // 데이터 사이언스 이노베이터
      '미래를 예측하는 퀀텀 실버': 'bg-gradient-to-r from-slate-100 to-gray-200 border-slate-300',
      '혁신이 증명되는 사파이어 블루': 'bg-gradient-to-r from-blue-100 to-indigo-200 border-blue-300',
      
      // ROI 최적화 스페셜리스트
      '승부를 가르는 스틸 실버': 'bg-gradient-to-r from-gray-100 to-slate-200 border-gray-300',
      '데이터가 말하는 사파이어 블루': 'bg-gradient-to-r from-blue-100 to-indigo-200 border-blue-300',
      
      // 고객 중심 이노베이션 리더
      '고객의 꿈이 피어나는 아쿠아 그린': 'bg-gradient-to-r from-teal-100 to-green-200 border-teal-300',
      '혁신이 깃드는 오팔 퍼플': 'bg-gradient-to-r from-purple-100 to-violet-200 border-purple-300',
      
      // 감성 고객 경험 디자이너
      '마음이 닿는 따뜻한 앰버': 'bg-gradient-to-r from-amber-100 to-orange-200 border-amber-300',
      '공감이 흐르는 라벤더 퍼플': 'bg-gradient-to-r from-purple-100 to-violet-200 border-purple-300',
      
      // 트렌드 이노베이션 크리에이터
      '트렌드를 앞서는 네온 핑크': 'bg-gradient-to-r from-pink-100 to-rose-200 border-pink-300',
      '혁신이 흐르는 홀로그램 골드': 'bg-gradient-to-r from-yellow-100 to-amber-200 border-yellow-300',
      
      // 바이럴 콘텐츠 크리에이터
      '바이럴이 시작되는 일렉트릭 옐로우': 'bg-gradient-to-r from-yellow-100 to-orange-200 border-yellow-300',
      '콘텐츠가 흐르는 머메이드 그린': 'bg-gradient-to-r from-teal-100 to-green-200 border-teal-300',
      
      // 효율성 극대화 마케터
      '효율이 흐르는 클리어 크리스탈': 'bg-gradient-to-r from-white to-gray-100 border-gray-300',
      '성과가 빛나는 플래티넘 실버': 'bg-gradient-to-r from-slate-100 to-gray-200 border-slate-300',
      
      // 올라운드 마케팅 스트래티지스트
      '균형이 흐르는 오로라 그라데이션': 'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-indigo-300',
      '조화가 빛나는 프리즘 화이트': 'bg-gradient-to-r from-white to-gray-100 border-gray-300',
    };
    
    return colorMappings[colorText] || 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
  };

  // 컬러 순환 (별도 useEffect)
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorThemes.length);
    }, 4000);

    return () => clearInterval(colorInterval);
  }, []);

  // 결과 저장 (최초 1회만)
  useEffect(() => {
    if (answers.length > 0 && !sharedResult && !resultId && !hasSubmitted.current) {
      hasSubmitted.current = true;
      const clientId = getClientId();
      fetch('/api/submitResult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          result, 
          answers, 
          clientId, 
          salaryInfo,
          marketerType
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok && data.resultId) {
          setResultId(data.resultId);
        }
      })
      .catch(error => {
        console.error('결과 저장 중 오류:', error);
        hasSubmitted.current = false; // 에러 시 다시 시도할 수 있도록
      });
    }
  }, [answers, sharedResult, resultId, result, salaryInfo, marketerType]);

  // GA 이벤트 트리거
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_result',
        marketing_dna: result.marketingDNA
      });
    }
  }, [result.marketingDNA]);

  // 공유 기능
  const handleShare = () => {
    const shareUrl = resultId 
      ? `${window.location.origin}/scenarios/result?rid=${resultId}`
      : window.location.href;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('링크가 복사되었습니다!');
    });
  };

  const handleKakaoShare = () => {
    const shareUrl = resultId 
      ? `${window.location.origin}/scenarios/result?rid=${resultId}`
      : window.location.href;
      
    if (typeof window !== 'undefined' && window.Kakao) {
      try {
        // 카카오 SDK 초기화 확인
        if (!window.Kakao.isInitialized()) {
          console.log('카카오 SDK 초기화 중...');
          // 임시로 초기화 시도 (실제 앱 키가 필요함)
          window.Kakao.init('f265d81144e358dad13c422075f42c62');
        }
        
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `나의 마케팅 Personal Color: ${result.marketingDNA}`,
            description: `${result.personalColors.join(', ')}`,
            imageUrl: `${window.location.origin}/og-images/result.png`,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '나도 테스트하기',
              link: {
                mobileWebUrl: window.location.origin + '/scenarios',
                webUrl: window.location.origin + '/scenarios',
              },
            },
          ],
        });
      } catch (error) {
        console.error('카카오 공유 오류:', error);
        // 카카오 공유 실패 시 링크 복사로 대체
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('카카오 공유에 실패했습니다. 대신 링크가 복사되었습니다!');
        });
      }
    } else {
      console.log('카카오 SDK가 로드되지 않았습니다. 링크 복사로 대체합니다.');
      // 카카오 SDK가 없으면 링크 복사로 대체
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('카카오 공유를 사용할 수 없습니다. 대신 링크가 복사되었습니다!');
      });
    }
  };

  // 레이더 차트용 데이터 변환
  const radarData = Object.entries(result.tagScores).map(([tagName, tagScore]) => ({
    subject: tagName.length > 6 ? tagName.substring(0, 6) + '...' : tagName,
    fullName: tagName,
    A: tagScore.score,
    fullMark: 100
  }));

  // 성장 영역 색상 결정 (퍼스널컬러 테마)
  const getGrowthColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-purple-400 to-pink-400';
    if (score >= 65) return 'bg-gradient-to-r from-blue-400 to-purple-400';
    if (score >= 45) return 'bg-gradient-to-r from-green-400 to-blue-400';
    if (score >= 25) return 'bg-gradient-to-r from-yellow-400 to-green-400';
    return 'bg-gradient-to-r from-rose-400 to-orange-400';
  };

  // 실제 선택 비율 계산 (태그별)
  const getActualSelectionRate = (tagName: string) => {
    if (!statistics || !statistics.total) {
      return Math.floor(Math.random() * 60) + 15; // 기본 랜덤값
    }
    
    // 고유 사용자 수를 우선 사용, 없으면 기존 방식 사용
    const uniqueUserCount = statistics.uniqueUserTagCount?.[tagName] || 0;
    const fallbackCount = statistics.answerCount?.[tagName] || 0;
    const tagCount = uniqueUserCount > 0 ? uniqueUserCount : Math.min(fallbackCount, statistics.total);
    
    const totalUsers = statistics.total;
    
    return totalUsers > 0 ? Math.min(100, Math.round((tagCount / totalUsers) * 100)) : Math.floor(Math.random() * 60) + 15;
  };

  // 태그별 고유 이모지 매핑
  const getTagEmoji = (tagName: string) => {
    const emojiMap: Record<string, string> = {
      // 성향 관련
      "트렌드 중시": "📈",
      "감성": "💝", 
      "리스크 회피": "🛡️",
      "혁신/실험 선호": "🧪",
      
      // 고객 관련
      "고객 경험 중시": "👥",
      "콘텐츠 마케팅": "📝",
      
      // 데이터/분석 관련
      "데이터 기반": "📊",
      "비용 효율 중시": "💰",
      
      // 전략 관련
      "장기 전략": "🎯",
      "단기 성과 집착": "⚡",
      "브랜드 가치 중시": "👑",
    };
    
    return emojiMap[tagName] || "💎"; // 기본 이모지
  };

  // 점수와 선택 비율을 조합한 개인화 피드백 생성
  const getPersonalizedFeedback = (score: number, selectionRate: number, tagName: string) => {
    // 점수 구간 (1-5)
    let scoreLevel;
    if (score >= 85) scoreLevel = 5; // 매우 높음
    else if (score >= 70) scoreLevel = 4; // 높음  
    else if (score >= 55) scoreLevel = 3; // 보통
    else if (score >= 40) scoreLevel = 2; // 낮음
    else scoreLevel = 1; // 매우 낮음

    // 선택 비율 구간 (1-6)
    let rateLevel;
    if (selectionRate <= 5) rateLevel = 1; // 매우 독특 (5% 이하)
    else if (selectionRate <= 15) rateLevel = 2; // 독특 (6-15%)
    else if (selectionRate <= 30) rateLevel = 3; // 특별 (16-30%)
    else if (selectionRate <= 50) rateLevel = 4; // 일반 (31-50%)
    else if (selectionRate <= 70) rateLevel = 5; // 대중 (51-70%)
    else rateLevel = 6; // 매우 대중 (71%+)

    // 점수 + 선택비율 조합별 피드백
    const feedbackMatrix: Record<string, string> = {
      // 매우 높은 점수 (85+)
      "5-1": `${tagName}에 대한 남다른 전문성과 독창적 시각을 보유하고 계시네요!`,
      "5-2": `${tagName}에서 뛰어난 역량과 창의적 접근을 동시에 갖추셨어요`,
      "5-3": `${tagName} 전문가! 균형잡힌 시각으로 높은 성과를 내고 계세요`,
      "5-4": `${tagName}에 대한 탄탄한 기본기와 검증된 접근법을 갖고 계시네요`,
      "5-5": `${tagName}의 정석을 완벽히 마스터하신 실력자세요!`,
      "5-6": `${tagName}에서 모범적이고 안정적인 고성과를 보여주고 계세요`,

      // 높은 점수 (70-84)
      "4-1": `${tagName}에 대한 독특한 관점이 돋보이는 유능한 마케터세요`,
      "4-2": `${tagName}에서 창의성과 실력을 겸비한 실무진이네요`,
      "4-3": `${tagName}에 대한 견고한 실력과 균형감을 갖추셨어요`,
      "4-4": `${tagName}의 기본을 충실히 다진 안정적 성장형이세요`,
      "4-5": `${tagName}에서 대중적 접근으로 좋은 성과를 내고 계세요`,
      "4-6": `${tagName}의 일반적 방식을 잘 활용하는 실무진이네요`,

      // 보통 점수 (55-69)
      "3-1": `${tagName}에 독창적 시각이 있지만 더 발전시킬 여지가 있어요`,
      "3-2": `${tagName}에 특별한 관심이 있으니 더 집중해보시면 좋겠어요`,
      "3-3": `${tagName}에서 균형잡힌 발전 가능성을 보여주고 계세요`,
      "3-4": `${tagName}에 대한 기본기를 더 다져나가시면 좋겠어요`,
      "3-5": `${tagName}은 많은 분들이 관심갖는 영역이니 더 투자해보세요`,
      "3-6": `${tagName}에서 대중적 트렌드를 따라잡아 나가고 계세요`,

      // 낮은 점수 (40-54)
      "2-1": `${tagName}에 독특한 시각이 있으니 더 개발해보시면 어떨까요?`,
      "2-2": `${tagName}에 관심을 갖고 계시니 집중 학습하시면 좋겠어요`,
      "2-3": `${tagName}에서 성장 잠재력이 보이니 조금만 더 노력해보세요`,
      "2-4": `${tagName}은 기본기부터 차근차근 익혀나가시면 됩니다`,
      "2-5": `${tagName}은 많은 분들이 중요하게 여기니 관심가져보세요`,
      "2-6": `${tagName}에서 일반적 패턴을 학습하며 기초를 다져보세요`,

      // 매우 낮은 점수 (39 이하)  
      "1-1": `${tagName}에 독특한 접근을 시도하고 계시지만 기초 학습이 필요해요`,
      "1-2": `${tagName}에 관심이 있으시니 체계적 학습으로 시작해보세요`,
      "1-3": `${tagName}에 대한 기초 이해부터 차근차근 시작하시면 좋겠어요`,
      "1-4": `${tagName}은 기본 개념부터 천천히 익혀나가시길 권합니다`,
      "1-5": `${tagName}은 중요한 역량이니 다른 분들 경험을 참고해보세요`,
      "1-6": `${tagName}에서 일반적 베스트 프랙티스부터 학습해보시면 좋겠어요`,
    };

    const key = `${scoreLevel}-${rateLevel}`;
    return feedbackMatrix[key] || `${tagName}에서 꾸준한 성장을 이어가고 계시네요!`;
  };

  // 점수 카운팅 애니메이션
  const animateScore = (tagName: string, targetScore: number) => {
    const duration = 1500; // 1.5초
    const startTime = Date.now();
    const startScore = 0;
    
    const updateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic 이징 함수로 자연스러운 감속
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = startScore + (targetScore - startScore) * easeProgress;
      
      setAnimatedScores(prev => ({
        ...prev,
        [tagName]: currentScore
      }));
      
      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };
    
    updateScore();
  };

  // 선택비율에 따라 색상 반환 (7단계)
  const getSelectionRateColor = (rate: number) => {
    if (rate <= 5) return 'text-blue-600 font-bold';
    if (rate <= 15) return 'text-sky-600 font-bold';
    if (rate <= 30) return 'text-purple-600 font-bold';
    if (rate <= 50) return 'text-gray-600 font-bold';
    if (rate <= 70) return 'text-orange-500 font-bold';
    if (rate <= 90) return 'text-rose-500 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
      
      {/* 동적 배경 그라데이션 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-15 transition-all duration-2000 ease-in-out`}
      />
      
      {/* 플로팅 컬러 파티클 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-40"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${6 + (i % 3)}s`
            }}
          >
            <div 
              className="w-3 h-3 rounded-full blur-sm"
              style={{ backgroundColor: currentTheme.colors[i % 3] + '80' }}
            />
          </div>
        ))}
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="mb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 tracking-tight flex items-center justify-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                당신의 퍼스널컬러는
              </span>
              <span>🎨</span>
            </h1>
            <div className="text-sm text-gray-500">
              Marketing DNA Analysis Report
            </div>
          </div>
          
          {/* 현재 시즌 표시 */}
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentTheme.cardBg} px-3 py-1.5 rounded-full border ${currentTheme.borderColor} shadow-sm`}>
            <span className="text-sm">{currentTheme.emoji}</span>
            <span className="text-gray-600 text-xs font-medium">Current Season: {currentTheme.name}</span>
            <div className="flex gap-0.5">
              {currentTheme.colors.map((color, i) => (
                <div 
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ 
                    backgroundColor: color,
                    animationDelay: `${i * 0.2}s` 
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* DNA 메인 카드 */}
        <div className="bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-5xl sm:text-6xl lg:text-7xl mb-4">
                {result.marketingDNA.includes('Spring') ? '🌸' : 
                 result.marketingDNA.includes('Summer') ? '🌊' :
                 result.marketingDNA.includes('Autumn') ? '🍂' : '❄️'}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {result.marketingDNA}
              </h2>
              
              {/* 통계 정보 */}
              {statistics && (
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <div>
                    지금까지 <span className="font-semibold text-gray-800">{statistics.total?.toLocaleString() || 0}명</span>이 테스트를 완료했습니다
                  </div>
                  <div>
                    당신과 같은 유형은 <span className="font-semibold text-purple-600">
                      {statistics.personaCount && statistics.total ? 
                        ((statistics.personaCount[result.marketingDNA] || 0) / statistics.total * 100).toFixed(1) : 0}%
                    </span>입니다
                  </div>
                  <div>
                    가장 많은 유형은 <span className="font-semibold text-blue-600">
                      {/* 모든 테스트 결과 통틀어서 집계 (같은 마케터타입 여부와 무관) */}
                      {statistics.personaCount ? 
                        Object.entries(statistics.personaCount)
                          .sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || '분석중' 
                        : '분석중'}
                    </span>입니다
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              {result.personalColors.map((color, index) => (
                <div key={index} className={`${getPersonalColorBackground(color)} text-gray-700 px-3 py-2 rounded-full border font-medium shadow-md text-xs w-full sm:w-auto sm:min-w-[10rem] text-center leading-tight`}>
                  {color}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 레이더 차트 */}
        <div className="bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-3xl shadow-xl p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-2xl">📊</span>
            마케팅 역량 분석
          </h2>
          <div className="h-80 flex items-center justify-center">
            <ScenarioRadarChart tagScores={result.tagScores} />
          </div>
        </div>

        {/* 태그별 상세 점수 */}
        <div className="bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-3xl shadow-xl p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-2xl">🎯</span>
            세부 역량 점수
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(result.tagScores)
              .map(([tagName, tagScore]) => {
                const fixedData = fixedScores[tagName];
                const displayScore = fixedData?.displayScore ?? tagScore.score;
                const selectionRate = fixedData?.selectionRate ?? getActualSelectionRate(tagName);
                return { tagName, tagScore, displayScore, selectionRate };
              })
              .sort((a, b) => b.displayScore - a.displayScore) // 표시용 점수로 재정렬
              .slice(0, showAllScores ? undefined : 4) // 상위 4개만 표시, 더보기 시 전체 표시
              .map(({ tagName, tagScore, displayScore, selectionRate }) => (
                <div key={tagName} className={`bg-gradient-to-r ${currentTheme.cardBg} rounded-2xl p-4 border ${currentTheme.borderColor} shadow-md`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getTagEmoji(tagName)}</span>
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">{tagName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900 font-bold text-sm sm:text-lg">
                        {isScoreCalculating ? (
                          <span className="animate-pulse">계산중...</span>
                        ) : (
                          `${(animatedScores[tagName] || displayScore).toFixed(1)}점`
                        )}
                      </div>
                      <div className="text-gray-500 text-[10px] sm:text-xs">
                        {isScoreCalculating ? (
                          <span className="animate-pulse text-[10px]">분석중</span>
                        ) : (
                          <>
                            당신과 같은 선택비율: <span className={getSelectionRateColor(selectionRate)}>{selectionRate}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full ${getGrowthColor(tagScore.score)} transition-all duration-300`}
                      style={{ 
                        width: isScoreCalculating ? '0%' : `${animatedScores[tagName] || displayScore}%` 
                      }}
                    />
                  </div>
                  <div className="text-gray-600 text-[11px] sm:text-sm">
                    {getPersonalizedFeedback(displayScore, selectionRate, tagName)}
                  </div>
                </div>
              ))}
          </div>
          
          {/* 아코디언 더보기 */}
          {Object.keys(result.tagScores).length > 4 && (
            <div className="mt-4">
              <div 
                onClick={() => setShowAllScores(!showAllScores)}
                className={`w-full bg-gradient-to-r ${currentTheme.cardBg} border-t-2 border-dashed ${currentTheme.borderColor} px-6 py-4 cursor-pointer hover:bg-opacity-80 transition-all duration-300`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-700 font-medium">
                    {showAllScores ? '접기' : `나머지 역량 ${Object.keys(result.tagScores).length - 4}개 더 보기`}
                  </span>
                  <div className={`transform transition-transform duration-300 ${showAllScores ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              

            </div>
          )}
        </div>

        {/* 강점 및 성장 영역 */}
        <div className="mb-8">
          {/* 강점 */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 backdrop-blur-xl border-2 border-emerald-300/60 rounded-3xl shadow-xl p-6 relative overflow-hidden">
            {/* 강점 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-6 h-6 border-2 border-emerald-400 rounded-full"></div>
              <div className="absolute top-12 right-6 w-3 h-3 bg-emerald-400 rounded-full"></div>
              <div className="absolute bottom-6 left-8 w-4 h-4 border border-emerald-400 transform rotate-45"></div>
              <div className="absolute bottom-12 right-4 w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-emerald-900 mb-6 text-center flex items-center justify-center gap-3">
                <span className="text-3xl">🏆</span>
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  핵심 강점
                </span>
              </h3>
              
              {/* 강점 헤더 */}
              <div className="flex items-center justify-between mb-4 text-xs text-emerald-700/70">
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span>탁월한 역량</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💎</span>
                  <span>최고 수준</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {result.topStrengths.map((strength, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-emerald-800 font-semibold text-lg leading-relaxed group-hover:text-emerald-900 transition-colors mb-2">
                          ✨ {strength.title}
                        </div>
                        <div className="text-emerald-700 leading-relaxed text-sm">
                          {strength.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 강점 푸터 */}
              <div className="mt-4 pt-3 border-t border-emerald-200/50">
                <div className="flex items-center justify-between text-xs text-emerald-700/60">
                  <div className="flex items-center gap-2">
                    <span>🏆</span>
                    <span>우수 역량</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📈</span>
                    <span>성장 잠재력</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 추천사항 */}
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 backdrop-blur-xl border-2 border-purple-300/60 rounded-3xl shadow-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          {/* 추천사항 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 left-6 w-5 h-5 border-2 border-purple-400 rounded-full"></div>
            <div className="absolute top-16 right-10 w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-4 h-4 border border-purple-400 transform rotate-45"></div>
            <div className="absolute bottom-20 right-6 w-3 h-3 bg-purple-400 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-6 text-center flex items-center justify-center gap-3">
              <span className="text-3xl">💡</span>
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                개인화 추천사항
              </span>
            </h2>
            
            {/* 추천사항 헤더 */}
            <div className="flex items-center justify-between mb-6 text-xs text-purple-700/70">
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span>맞춤형 성장 전략</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>전문가 조언</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-purple-800 leading-relaxed group-hover:text-purple-900 transition-colors">
                        💎 {rec}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 추천사항 푸터 */}
            <div className="mt-6 pt-4 border-t border-purple-200/50">
              <div className="flex items-center justify-between text-xs text-purple-700/60">
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>전문가 추천</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🚀</span>
                  <span>성장 로드맵</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 배우면 좋은 기술/툴/스킬/콘텐츠/플랫폼 */}
        <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 backdrop-blur-xl border-2 border-yellow-200/60 rounded-3xl shadow-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          {/* 기술 추천 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-8 h-8 border-2 border-yellow-300 rounded-full"></div>
            <div className="absolute top-20 right-10 w-3 h-3 bg-yellow-300 rounded-full"></div>
            <div className="absolute bottom-10 left-16 w-5 h-5 border border-yellow-300 transform rotate-45"></div>
            <div className="absolute bottom-24 right-8 w-4 h-4 bg-yellow-300 rounded-full"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-900 mb-6 text-center flex items-center justify-center gap-3">
              <span className="text-3xl">🛠️</span>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                배우면 좋은 기술 & 툴
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
              {/* 동적으로 2개 영역만 렌더링 */}
              {result.recommendedTechnologies.tools && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔧</span>
                    <span className="font-semibold text-yellow-800">추천 툴</span>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendedTechnologies.tools.map((tool, idx) => (
                      <li key={tool} className="bg-white/80 rounded-xl px-3 py-2 border border-yellow-200 text-yellow-900 shadow-sm hover:bg-yellow-100 transition-all duration-200">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recommendedTechnologies.platforms && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌐</span>
                    <span className="font-semibold text-yellow-800">추천 플랫폼</span>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendedTechnologies.platforms.map((platform, idx) => (
                      <li key={platform} className="bg-white/80 rounded-xl px-3 py-2 border border-yellow-200 text-yellow-900 shadow-sm hover:bg-yellow-100 transition-all duration-200">
                        {platform}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recommendedTechnologies.skills && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📚</span>
                    <span className="font-semibold text-yellow-800">추천 스킬</span>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendedTechnologies.skills.map((skill, idx) => (
                      <li key={skill} className="bg-white/80 rounded-xl px-3 py-2 border border-yellow-200 text-yellow-900 shadow-sm hover:bg-yellow-100 transition-all duration-200">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recommendedTechnologies.contentTypes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📝</span>
                    <span className="font-semibold text-yellow-800">추천 콘텐츠</span>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendedTechnologies.contentTypes.map((content, idx) => (
                      <li key={content} className="bg-white/80 rounded-xl px-3 py-2 border border-yellow-200 text-yellow-900 shadow-sm hover:bg-yellow-100 transition-all duration-200">
                        {content}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className={`grid gap-4 mb-8 max-w-4xl mx-auto ${
          searchParams?.get('rid') 
            ? 'grid-cols-1 max-w-md' 
            : 'grid-cols-2 sm:grid-cols-4'
        }`}>
          {!searchParams?.get('rid') && (
            <button
              onClick={handleShare}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 text-sm sm:text-base"
            >
              🔗 링크 복사
            </button>
          )}
          {!searchParams?.get('rid') && (
            <button
              onClick={handleKakaoShare}
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 hover:scale-105 text-sm sm:text-base"
            >
              💬 카카오 공유
            </button>
          )}
          {!searchParams?.get('rid') && (
            <button
              onClick={() => router.push('/scenarios/salary-result')}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 text-base"
            >
              💰 연봉 통계
            </button>
          )}
          <button
            onClick={() => router.push('/scenarios')}
            className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 text-sm sm:text-base"
          >
            {searchParams?.get('rid') ? '🎯 나도 테스트하기' : '🔄 다시 테스트'}
          </button>
        </div>

        {/* 푸터 */}
        <div className="text-center text-gray-500 text-sm">
          Marketing Personal Color Diagnosis © 2024
        </div>
      </div>

      {/* 커스텀 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(120deg);
          }
          66% {
            transform: translateY(8px) rotate(240deg);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ScenarioResult; 