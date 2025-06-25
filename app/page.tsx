'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentSeason, setCurrentSeason] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // 4계절 퍼스널컬러 테마
  const seasons = [
    {
      name: "Spring",
      korean: "봄 웜톤",
      colors: ["#FFB5BA", "#FFE5AD", "#B5E5CF", "#E5B5FF"],
      description: "밝고 생동감 넘치는",
      icon: "🌸",
      gradient: "from-rose-200 via-yellow-200 to-green-200"
    },
    {
      name: "Summer", 
      korean: "여름 쿨톤",
      colors: ["#B5D5FF", "#E5B5FF", "#FFB5E5", "#B5FFE5"],
      description: "차분하고 우아한", 
      icon: "🌊",
      gradient: "from-blue-200 via-purple-200 to-pink-200"
    },
    {
      name: "Autumn",
      korean: "가을 웜톤", 
      colors: ["#FFB5AD", "#FFDB99", "#D4B5A0", "#FF9999"],
      description: "따뜻하고 깊이 있는",
      icon: "🍂",
      gradient: "from-orange-200 via-amber-200 to-red-200"
    },
    {
      name: "Winter",
      korean: "겨울 쿨톤",
      colors: ["#B5B5FF", "#FF99CC", "#99FFFF", "#E6E6FA"],
      description: "선명하고 강렬한",
      icon: "❄️", 
      gradient: "from-indigo-200 via-pink-200 to-cyan-200"
    }
  ];

  // 마우스 트래킹
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 계절 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSeason((prev) => (prev + 1) % seasons.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 로드 애니메이션
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentSeasonData = seasons[currentSeason];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
      
      {/* 배경 그라데이션 오버레이 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentSeasonData.gradient} opacity-20 transition-all duration-2000 ease-in-out`}
      />
      
      {/* 인터랙티브 글로우 효과 */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle, ${currentSeasonData.colors[0]}40, ${currentSeasonData.colors[1]}20, transparent)`,
          left: `${mousePosition.x - 10}%`,
          top: `${mousePosition.y - 10}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* 플로팅 꽃잎/파티클 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-60"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + (i % 3)}s`
            }}
          >
            <div 
              className="w-3 h-3 rounded-full blur-sm"
              style={{ backgroundColor: currentSeasonData.colors[i % 4] + '80' }}
            />
          </div>
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        
        {/* 상단 브랜드 영역 */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* 서비스 태그 - 작게 수정 */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-rose-200/50 rounded-full px-3 py-1.5 mb-6 sm:mb-8 shadow-sm">
            <div className="flex gap-1">
              {currentSeasonData.colors.map((color, i) => (
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
            <span className="text-gray-700 font-medium tracking-wide text-xs">Personal Color for Marketing</span>
          </div>

          {/* 메인 타이틀 */}
          <div className="mb-6 sm:mb-8 px-2">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow">
              {currentSeasonData.icon}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-extralight tracking-wide">
                Marketing
              </div>
              <div className="text-gray-800 font-medium">
                Personal Color
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-600 font-light mt-1 sm:mt-2">
                Diagnosis
              </div>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              당신의 마케팅 성향에 어울리는<br />
              <span className="text-rose-500 font-medium">퍼스널컬러</span>를 찾아보세요
            </p>
          </div>
        </div>

        {/* 메인 CTA 카드 */}
        <div className={`max-w-2xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* 글로우 효과 래퍼 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-200 via-pink-200 to-purple-200 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-white/50">
              <div className="text-center space-y-4 sm:space-y-6">
                
                {/* 카드 헤더 */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 px-2 text-center">
                    나는 어떤 성향의<br />
                    마케팅을 하는 사람일까요?
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-lg mx-auto px-4 sm:px-0">
                    Spring, Summer, Autumn, Winter<br />
                    마케팅 성향을 분석하여<br />
                    당신에게 어울리는 컬러 조합을 찾아드립니다
                  </p>
                </div>

                {/* 특징 미니 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-6 sm:my-8 px-2 sm:px-0">
                  <div className="bg-rose-50 rounded-xl p-3 sm:p-4 border border-rose-100">
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🎨</div>
                    <div className="text-xs sm:text-sm font-medium text-rose-700 mb-1">퍼스널컬러</div>
                    <div className="text-xs text-rose-600">나만의 색상 조합</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 sm:p-4 border border-purple-100">
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💡</div>
                    <div className="text-xs sm:text-sm font-medium text-purple-700 mb-1">AI 분석</div>
                    <div className="text-xs text-purple-600">똑똑한 성향 분석</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-3 sm:p-4 border border-pink-100">
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">✨</div>
                    <div className="text-xs sm:text-sm font-medium text-pink-700 mb-1">실무 활용</div>
                    <div className="text-xs text-pink-600">바로 써먹는 팁</div>
                  </div>
                </div>

                {/* 메인 CTA 버튼 */}
                <div className="px-4 sm:px-0">
                  <Link href="/scenarios" className="group block">
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white rounded-2xl m-1 px-6 sm:px-8 py-3 sm:py-4 transform group-hover:scale-[0.98] transition-all duration-200">
                        <span className="text-base sm:text-lg font-medium bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                          컬러 진단 시작하기
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* 하단 정보 */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 text-xs sm:text-sm text-gray-500 px-4 sm:px-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-400 rounded-full animate-pulse"></div>
                    <span>무료 진단</span>
                  </div>
                  <div className="hidden sm:block w-px h-3 sm:h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>3분 완료</span>
                  </div>
                  <div className="hidden sm:block w-px h-3 sm:h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>개인화된 결과</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 계절 디스플레이 */}
        <div className={`text-center mb-8 sm:mb-12 px-4 sm:px-0 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* 현재 계절 표시 */}
          <div className="mb-6 sm:mb-8">
            <div className="text-xs sm:text-sm text-gray-500 mb-2">현재 분석 중인 컬러 타입</div>
            <div className="relative">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 transition-all duration-500 transform hover:scale-110">
                {currentSeasonData.icon}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 mb-1 sm:mb-2">
                {currentSeasonData.korean}
              </div>
              <div className="text-sm sm:text-base md:text-lg text-gray-600">
                {currentSeasonData.description} 마케팅 스타일
              </div>
            </div>
          </div>

          {/* 컬러 팔레트 */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {currentSeasonData.colors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full shadow-lg transform hover:scale-125 transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: color,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* 계절 인디케이터 */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4 sm:px-0">
            {seasons.map((season, i) => (
              <div
                key={i}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-300 ${
                  i === currentSeason 
                    ? 'bg-rose-100 text-rose-700 shadow-md' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {season.icon} {season.name}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 컬러 스펙트럼 */}
        <div className={`mt-8 sm:mt-16 text-center px-4 sm:px-0 transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-md mx-auto">
            <div className="h-0.5 sm:h-1 bg-gradient-to-r from-rose-300 via-pink-300 via-purple-300 to-indigo-300 rounded-full mb-3 sm:mb-4 opacity-60"></div>
            <p className="text-xs sm:text-sm text-gray-500 font-light tracking-wide">
              Spring • Summer • Autumn • Winter
            </p>
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
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
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
} 