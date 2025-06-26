import React, { useState, useEffect } from 'react';
import useScenarioStore from '@/stores/scenarioStore';

const SalaryInput = () => {
  const { marketerType, setSalaryInfo, salaryInfo, setSalaryInputSkipped } = useScenarioStore();
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [errors, setErrors] = useState<{ years?: string; salary?: string; general?: string }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  // 로드 애니메이션 및 컬러 순환
  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorThemes.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const getMarketerTypeInfo = (type: string) => {
    const typeInfo = {
      'B2C': { name: 'B2C 스페셜리스트', emoji: '🌸', season: 'Spring' },
      'B2B': { name: 'B2B 전략가', emoji: '🌊', season: 'Summer' },
      '이커머스': { name: 'E-Commerce 전문가', emoji: '🍂', season: 'Autumn' },
    };
    return typeInfo[type as keyof typeof typeInfo] || { name: type, emoji: '✨', season: 'Unknown' };
  };

  const validateInputs = () => {
    const newErrors: { years?: string; salary?: string; general?: string } = {};

    // 연차 검증
    if (yearsOfExperience) {
      const years = parseFloat(yearsOfExperience);
      if (isNaN(years) || years < 0 || years > 50) {
        newErrors.years = '경력은 0년부터 50년 사이로 입력해주세요';
      }
    }

    // 연봉 검증
    if (salary) {
      const salaryNum = parseFloat(salary);
      if (isNaN(salaryNum) || salaryNum < 1000 || salaryNum > 100000) {
        newErrors.salary = '연봉은 1,000만원부터 100,000만원 사이로 입력해주세요';
      } else if (salaryNum % 100 !== 0) {
        newErrors.salary = '100만원 단위로 입력해주세요 (예: 4200, 3900)';
      }
    }

    // 둘 중 하나만 입력한 경우 경고
    const hasYears = yearsOfExperience.trim() !== '';
    const hasSalary = salary.trim() !== '';
    
    if ((hasYears && !hasSalary) || (!hasYears && hasSalary)) {
      newErrors.general = '경력과 연봉을 모두 입력하거나, 모두 건너뛰어주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateInputs()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const years = yearsOfExperience ? parseFloat(yearsOfExperience) : null;
      const salaryNum = salary ? parseFloat(salary) : null;

      setSalaryInfo(years, salaryNum);
    }, 3000);
  };

  const handleSkip = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setSalaryInfo(null, null);
      setSalaryInputSkipped(true);
    }, 2500);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalary(e.target.value);
  };

  const typeInfo = getMarketerTypeInfo(marketerType!);

  // 분석 중 화면
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
        
        {/* 배경 그라데이션 오버레이 */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-20 transition-all duration-2000 ease-in-out`}
        />
        
        {/* 플로팅 컬러 파티클 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-50"
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

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
          <div className="text-center space-y-8 max-w-lg">
            
            {/* 분석 로딩 아이콘 */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-spin border-t-rose-400"></div>
              <div className="absolute inset-2 rounded-full border-4 border-purple-200 animate-spin border-t-purple-400" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">{typeInfo.emoji}</span>
              </div>
            </div>
            
            {/* 분석 상태 */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light leading-tight">
                <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-extralight tracking-wide mb-2">
                  Personal Color
                </div>
                <div className="text-gray-800 font-medium">
                  분석 진행 중
                </div>
              </h1>
              
              <div className="space-y-3">
                <p className="text-gray-600 font-medium">
                  {typeInfo.name} 데이터 분석 중...
                </p>
                <p className="text-sm text-gray-500">
                  성향 패턴 분석 • 컬러 매칭 • 개인화 결과 생성
                </p>
              </div>

              {/* 진행 상태 */}
              <div className="w-64 mx-auto">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${currentTheme.gradient} rounded-full animate-pulse`}></div>
                </div>
                <div className="flex justify-center mt-3">
                  <div className="flex gap-1">
                    {currentTheme.colors.map((color, i) => (
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 커스텀 애니메이션 */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(5px) rotate(240deg); }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
      
      {/* 배경 그라데이션 오버레이 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-15 transition-all duration-2000 ease-in-out`}
      />
      
      {/* 플로팅 컬러 파티클 */}
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

      <div className={`relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="w-full max-w-lg mx-auto">
          
          {/* 헤더 섹션 */}
          <div className="text-center mb-8 sm:mb-12">
            
            {/* 상태 태그 */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-rose-200/50 rounded-full px-3 py-1.5 mb-6 sm:mb-8 shadow-sm">
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
                Personal Color Analysis
              </span>
            </div>

            {/* 메인 타이틀 */}
            <div className="mb-6 sm:mb-8 px-2">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-bounce-slow">
                {typeInfo.emoji}
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-extralight tracking-wide">
                  Additional
                </div>
                <div className="text-gray-800 font-medium">
                  Information
                </div>
                <div className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light mt-1 sm:mt-2">
                  추가 정보 입력
                </div>
              </h1>

              <div className="space-y-2">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-light">
                  선택하신 분야: <span className="font-medium text-rose-500">{typeInfo.name}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  더 정확한 분석을 위한 선택적 정보
                </p>
              </div>
            </div>
          </div>

          {/* 메인 입력 카드 */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 shadow-xl overflow-hidden">
            
                         {/* 카드 헤더 */}
             <div className={`bg-gradient-to-r ${currentTheme.cardBg} p-4 sm:p-5 border-b border-gray-100/80 relative`}>
               {/* 선택사항 강조 배지 */}
               <div className="absolute top-2 right-2">
                 <div className="bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-bold border border-orange-300 shadow-sm animate-pulse">
                   ⭐ 선택사항
                 </div>
               </div>
               
               <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-2">
                 경력 & 연봉 정보
               </h2>
               <p className="text-xs sm:text-sm text-gray-600 text-center">
                 개인화된 분석을 위한 추가 데이터
               </p>
               <p className="text-xs text-rose-500 text-center mt-1 font-medium">
                 💡 입력하지 않아도 기본 분석이 가능합니다
               </p>
             </div>

            {/* 입력 폼 */}
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* 에러 메시지 */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{errors.general}</span>
                  </p>
                </div>
              )}

              {/* 경력 입력 */}
              <div className="space-y-3">
                <label htmlFor="years" className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span>💼</span>
                  <span>경력 (년차)</span>
                </label>
                <input
                  type="number"
                  id="years"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="예: 3.5"
                  min="0"
                  max="50"
                  step="0.5"
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-800 placeholder-gray-400 ${
                    errors.years ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-rose-300'
                  } transition-all duration-300 font-medium`}
                />
                {errors.years && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{errors.years}</span>
                  </p>
                )}
              </div>

              {/* 연봉 입력 */}
              <div className="space-y-3">
                <label htmlFor="salary" className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span>💰</span>
                  <span>연봉 (만원)</span>
                </label>
                <input
                  type="number"
                  id="salary"
                  value={salary}
                  onChange={handleSalaryChange}
                  placeholder="예: 4200"
                  min="1000"
                  max="100000"
                  step="100"
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-800 placeholder-gray-400 ${
                    errors.salary ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-rose-300'
                  } transition-all duration-300 font-medium`}
                />
                {errors.salary && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{errors.salary}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>💡</span>
                  <span>1,000만원 ~ 100,000만원 • 100만원 단위로 입력</span>
                </p>
              </div>

                             {/* 버튼 영역 */}
               <div className="space-y-3 pt-4">
                 <button
                   onClick={handleContinue}
                   className={`w-full bg-gradient-to-r ${currentTheme.gradient} text-gray-800 font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2`}
                 >
                   <span className="text-lg">{typeInfo.emoji}</span>
                   <span>분석 시작하기</span>
                 </button>
                 
                 <button
                   onClick={handleSkip}
                   className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                 >
                   <span className="text-lg">⏭️</span>
                   <span>건너뛰기</span>
                 </button>
               </div>

                             {/* 안내 메시지 */}
               <div className="pt-4 border-t border-gray-100 space-y-2">
                 <p className="text-xs text-gray-600 text-center leading-relaxed">
                   🔒 <strong>개인정보 보호</strong> - 모든 데이터는 익명으로 처리됩니다
                 </p>
                 <p className="text-xs text-gray-500 text-center">
                   💡 경력과 연봉 정보는 더 정확한 맞춤 분석을 위해 사용됩니다
                 </p>
                 <p className="text-xs text-orange-600 text-center font-medium">
                   ⚠️ 연봉정보를 입력하지 않으면 연봉 통계에 기반한 결과를 볼 수 없습니다
                 </p>
               </div>
            </div>

            {/* 하단 컬러 바 */}
            <div className={`h-1 bg-gradient-to-r ${currentTheme.gradient} opacity-70`}></div>
          </div>

          {/* 하단 안내 */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/70 backdrop-blur-xl rounded-2xl px-6 py-3 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">선택적 입력</span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="text-xs font-medium text-gray-700">개인화 분석</span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="text-xs font-medium text-gray-700">안전한 처리</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 커스텀 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(120deg);
          }
          66% {
            transform: translateY(4px) rotate(240deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SalaryInput;