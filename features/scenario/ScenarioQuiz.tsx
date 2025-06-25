import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import glossary from './glossary.json';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const metadata = {
  title: "마케터 역량 진단 - 질문",
  description: "상황별 질문에 답하고 나만의 마케터 유형을 확인하세요.",
  openGraph: {
    title: "마케터 역량 진단 - 질문",
    description: "상황별 질문에 답하고 나만의 마케터 유형을 확인하세요.",
    type: "website",
    url: "https://도메인/quiz",
  },
  alternates: {
    canonical: "https://도메인/quiz",
  },
};

// 용어가 포함된 텍스트를 퍼스널컬러 테마로 강조하는 함수
function highlightTermsBold(text: string, terms: string[]) {
  if (!text) return text;
  let result: React.ReactNode[] = [text];
  terms.forEach(term => {
    result = result.flatMap(chunk => {
      if (typeof chunk !== 'string') return [chunk];
      const parts = chunk.split(term);
      if (parts.length === 1) return [chunk];
      const nodes: React.ReactNode[] = [];
      parts.forEach((part, i) => {
        nodes.push(part);
        if (i < parts.length - 1) nodes.push(
          <span key={i+term} className="bg-gradient-to-r from-rose-200 to-pink-200 text-rose-700 px-1 py-0.5 rounded font-medium">
            {term}
          </span>
        );
      });
      return nodes;
    });
  });
  return result;
}

// 현재 문제/선택지에 등장하는 용어만 추출
function extractTermsFromCurrent(questions: any, currentQuestion: any) {
  const texts = [currentQuestion.question, ...currentQuestion.choices.map((c: any) => c.text)];
  const terms = glossary.map(g => g.term).filter(term =>
    texts.some(t => t.includes(term))
  );
  return terms;
}

const ScenarioQuiz = () => {
  const { questions, currentQuestionIndex, answerQuestion, marketerType } = useScenarioStore(
    state => ({
      questions: state.questions,
      currentQuestionIndex: state.currentQuestionIndex,
      answerQuestion: state.answerQuestion,
      marketerType: state.marketerType,
    }),
  );
  const router = useRouter();

  const [analysisStatus, setAnalysisStatus] = useState('분석 준비 중...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState<number | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

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
  ];

  const currentTheme = colorThemes[currentColorIndex];
  const currentQuestion = questions[currentQuestionIndex];

  // 마케터 타입에 따른 이모지 설정
  const getMarketerEmoji = (type: string) => {
    const emojiMap = {
      'B2C': '🌸',
      'B2B': '🌊', 
      '이커머스': '🍂'
    };
    return emojiMap[type as keyof typeof emojiMap] || '✨';
  };

  useEffect(() => {
    setIsLoaded(true);
    
    // 컬러 순환
    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorThemes.length);
    }, 4000);
    
    // 분석 상태 메시지 변경
    const statuses = [
      '분석 준비 중...',
      '성향 패턴 분석 중...',
      '컬러 매칭 진행 중...',
      '개인화 결과 생성 중...',
      '다음 질문 준비 중...'
    ];
    
    const statusInterval = setInterval(() => {
      setAnalysisStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 3000);

    return () => {
      clearInterval(colorInterval);
      clearInterval(statusInterval);
    };
  }, []);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
        
        {/* 배경 그라데이션 */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-15 transition-all duration-2000 ease-in-out`}
        />
        
        {/* 플로팅 파티클 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-40"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i * 10)}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${5 + (i % 3)}s`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full blur-sm"
                style={{ backgroundColor: currentTheme.colors[i % 3] + '60' }}
              />
            </div>
          ))}
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl p-8 text-center max-w-md w-full">
            <div className="relative mx-auto w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-spin border-t-rose-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">{getMarketerEmoji(marketerType!)}</span>
              </div>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Personal Color 분석 준비 중
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              맞춤형 질문을 로딩하고 있습니다
            </p>
            
            <div className="flex items-center justify-center gap-1">
              {currentTheme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    backgroundColor: color,
                    animationDelay: `${i * 0.2}s` 
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 커스텀 애니메이션 */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(120deg); }
            66% { transform: translateY(4px) rotate(240deg); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  const termsInCurrent = extractTermsFromCurrent(questions, currentQuestion);
  const glossaryInCurrent = glossary.filter(g => termsInCurrent.includes(g.term));

  // 답변 선택 핸들러
  const handleAnswer = async (choice: { text: string; tags: string[] }, index: number) => {
    setSelectedChoice(index);
    setIsProcessing(true);
    
    // 처리 효과
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // GTM 이벤트 트리거
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: `quiz_answer_${currentQuestionIndex + 1}`,
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
        answer: index + 1,
      });
    }
    
    answerQuestion(
      currentQuestion.id,
      choice.tags,
      currentQuestion.difficulty,
    );
    
    // 마지막 문제라면 결과페이지로 이동
    if (currentQuestionIndex === questions.length - 1) {
      router.push('/scenarios/result');
    }
    
    setIsProcessing(false);
    setSelectedChoice(null);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
      
      {/* 배경 그라데이션 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-10 transition-all duration-2000 ease-in-out`}
      />
      
      {/* 플로팅 파티클 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${6 + (i % 3)}s`
            }}
          >
            <div 
              className="w-1.5 h-1.5 rounded-full blur-sm"
              style={{ backgroundColor: currentTheme.colors[i % 3] + '80' }}
            />
          </div>
        ))}
      </div>

      <div className={`relative z-10 py-8 md:py-12 px-4 md:px-6 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          
          {/* 헤더 */}
          <div className="text-center mb-8 md:mb-12">
            
            {/* 상태 표시 */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-rose-200/50 rounded-full px-3 py-1.5 mb-6 shadow-sm">
              <div className="flex gap-1">
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
              <span className="text-gray-700 font-medium tracking-wide text-xs">
                {analysisStatus}
              </span>
            </div>
            
            

            {/* 진행률 표시 */}
            <div className="max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600 font-medium">진행률</span>
                <span className="text-sm font-bold text-rose-600">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${currentTheme.gradient} h-3 rounded-full transition-all duration-700 ease-out relative`}
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-center mt-2">
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i <= currentQuestionIndex 
                            ? 'bg-rose-400 scale-110' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 질문 카드 */}
          <div className="bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-3xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
            
            {/* 질문 섹션 - 가운데 정렬 */}
            <div className="text-center mb-6">
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {highlightTermsBold(currentQuestion.question, termsInCurrent)}
              </h2>
              
              {/* 카테고리와 난이도 통합 태그 */}
              <div className="flex justify-center mb-4">
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentTheme.cardBg} text-gray-700 px-4 py-2 rounded-full text-sm font-medium border ${currentTheme.borderColor}/50`}>
                  <div className="flex gap-1">
                    {currentTheme.colors.slice(0, 2).map((color, i) => (
                      <div 
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span>
                    카테고리: {currentQuestion.category}
                    {currentQuestion.difficulty && (
                      <> | 난이도: {currentQuestion.difficulty}</>
                    )}
                  </span>
                </div>
              </div>
              
              {currentQuestion.context && (
                <div className={`bg-gradient-to-r ${currentTheme.cardBg} rounded-2xl p-4 mb-6 border ${currentTheme.borderColor}/30 text-left`}>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {highlightTermsBold(currentQuestion.context, termsInCurrent)}
                  </p>
                </div>
              )}
            </div>

            {/* 선택지 */}
            <div className="space-y-4">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => !isProcessing && handleAnswer(choice, index)}
                  onMouseEnter={() => !isProcessing && setHoveredChoice(index)}
                  onMouseLeave={() => setHoveredChoice(null)}
                  disabled={isProcessing}
                  className={`
                    w-full text-left p-4 md:p-6 rounded-2xl border-2 transition-all duration-500
                    ${isProcessing 
                      ? selectedChoice === index
                        ? `bg-gradient-to-r ${currentTheme.gradient} border-transparent shadow-xl scale-[1.02]`
                        : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                      : hoveredChoice === index
                        ? `bg-gradient-to-r ${currentTheme.cardBg} ${currentTheme.borderColor} shadow-xl transform scale-[1.02]`
                        : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all duration-300
                      ${isProcessing && selectedChoice === index
                        ? 'bg-white/90 text-gray-800'
                        : hoveredChoice === index 
                          ? 'bg-rose-400 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {isProcessing && selectedChoice === index ? (
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-gray-900 font-medium text-sm sm:text-base leading-relaxed text-center">
                        {highlightTermsBold(choice.text, termsInCurrent)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 처리 중 표시 */}
            {isProcessing && (
              <div className="mt-8 text-center">
                <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentTheme.cardBg} px-6 py-3 rounded-full border ${currentTheme.borderColor}/50 shadow-lg`}>
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">답변 분석 중...</span>
                  <div className="flex gap-1">
                    {currentTheme.colors.slice(0, 3).map((color, i) => (
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
            )}
          </div>

          {/* 용어 설명 카드 (용어가 있을 때만) */}
          {glossaryInCurrent.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-3xl shadow-xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.cardBg} rounded-xl flex items-center justify-center border ${currentTheme.borderColor}/50`}>
                  <span className="text-lg">📖</span>
                </div>
                <span>용어 설명</span>
                <div className="flex gap-1 ml-auto">
                  {currentTheme.colors.slice(0, 2).map((color, i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: color,
                        animationDelay: `${i * 0.3}s` 
                      }}
                    />
                  ))}
                </div>
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {glossaryInCurrent.map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-r ${currentTheme.cardBg} rounded-2xl p-4 border ${currentTheme.borderColor}/30 ${glossaryInCurrent.length % 2 === 1 && index === glossaryInCurrent.length - 1 ? 'sm:col-span-2' : ''}`}
                  >
                    <h4 className="font-bold text-rose-600 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                      {item.term}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 커스텀 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ScenarioQuiz; 