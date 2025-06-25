"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';

const MARKETER_TYPES = [
  {
    type: 'B2C',
    name: 'B2C 스페셜리스트',
    subtitle: '소비자 마케팅 전문가',
    description: '브랜드 스토리텔링과\n고객 감정 연결을 통한 마케팅',
    features: ['브랜드 스토리텔링', '소셜미디어', '고객 경험'],
    emoji: '🌸',
    season: 'Spring',
    colors: ['#FFB5BA', '#FFE5AD', '#B5E5CF'],
    gradient: 'from-rose-200 via-yellow-200 to-green-200',
    cardBg: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    accentColor: 'rose',
  },
  {
    type: 'B2B',
    name: 'B2B 전략가', 
    subtitle: '기업솔루션 마케팅 전문가',
    description: '데이터 기반 의사결정과\n전략적 파트너십 구축',
    features: ['솔루션 마케팅', '리드 제너레이션', '파트너십'],
    emoji: '🌊',
    season: 'Summer',
    colors: ['#B5D5FF', '#E5B5FF', '#FFB5E5'],
    gradient: 'from-blue-200 via-purple-200 to-pink-200',
    cardBg: 'from-blue-50 to-purple-50',
    borderColor: 'border-blue-200',
    accentColor: 'blue',
  },
  {
    type: '이커머스',
    name: 'E-Commerce 전문가',
    subtitle: '디지털 커머스 전문가', 
    description: '퍼포먼스 마케팅과\n사용자 경험 최적화 전문',
    features: ['퍼포먼스 마케팅', 'UX 최적화', '데이터 분석'],
    emoji: '🍂',
    season: 'Autumn',
    colors: ['#FFB5AD', '#FFDB99', '#D4B5A0'],
    gradient: 'from-orange-200 via-amber-200 to-red-200',
    cardBg: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    accentColor: 'orange',
  },
];

const ScenarioTypeSelector = () => {
  const setMarketerType = useScenarioStore(state => state.setMarketerType);
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [currentSeason, setCurrentSeason] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 계절 순환 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSeason((prev) => (prev + 1) % MARKETER_TYPES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 로드 애니메이션
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSelect = (type: string) => {
    setSelectedType(type);
    
    setTimeout(() => {
      setMarketerType(type);
      router.push('/scenarios/salary');
    }, 1500);
  };

  const currentSeasonData = MARKETER_TYPES[currentSeason];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
      
      {/* 배경 그라데이션 오버레이 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentSeasonData.gradient} opacity-10 transition-all duration-2000 ease-in-out`}
      />
      
      {/* 플로팅 꽃잎/파티클 */}
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
              style={{ backgroundColor: currentSeasonData.colors[i % 3] + '60' }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        
        {/* 상단 브랜드 영역 */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* 서비스 태그 */}
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
            <span className="text-gray-700 font-medium tracking-wide text-xs">
              {selectedType ? '분석 시작 중...' : 'Personal Color Selection'}
            </span>
          </div>

          {/* 메인 타이틀 */}
          <div className="mb-6 sm:mb-8 px-2">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-bounce-slow">
              {currentSeasonData.emoji}
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-extralight tracking-wide">
                Marketing
              </div>
              <div className="text-gray-800 font-medium">
                Personal Color
              </div>
              <div className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light mt-1 sm:mt-2">
                Type Selection
              </div>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              당신의 전문 분야를 선택하고<br />
              <span className="text-rose-500 font-medium">맞춤형 퍼스널컬러</span> 분석을 시작하세요
            </p>
          </div>
        </div>

        {/* 타입 선택 카드들 */}
        <div className={`max-w-4xl mx-auto mb-8 sm:mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {MARKETER_TYPES.map((type, index) => (
              <div
                key={type.type}
                className={`group relative transition-all duration-500 ${
                  selectedType === type.type ? 'scale-105 z-20' :
                  selectedType ? 'scale-95 opacity-50' : 
                  hoveredType === type.type ? 'scale-102' : ''
                }`}
                onMouseEnter={() => setHoveredType(type.type)}
                onMouseLeave={() => setHoveredType(null)}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* 배경 글로우 */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${type.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl blur`}></div>
                
                <button
                  onClick={() => handleSelect(type.type)}
                  disabled={!!selectedType}
                  className={`relative w-full bg-white/90 backdrop-blur-xl border-2 ${type.borderColor}/50 
                    rounded-3xl overflow-hidden transition-all duration-500 group
                    hover:border-gray-300/70 hover:shadow-xl focus:outline-none h-full min-h-[300px] sm:min-h-[320px]
                    ${selectedType === type.type ? `${type.borderColor} shadow-2xl` : ''}
                  `}
                >
                  {/* 선택 시 오버레이 */}
                  {selectedType === type.type && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.cardBg} animate-pulse opacity-50`}></div>
                  )}
                  
                  {/* 상단 헤더 영역 */}
                  <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100/80">
                    <div className="text-center">
                      {/* 계절 아이콘 */}
                      <div className={`relative w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br ${type.cardBg} 
                        flex items-center justify-center transform transition-all duration-300 mx-auto mb-3
                        ${hoveredType === type.type ? 'scale-110 rotate-3' : ''}
                      `}>
                        <span className="text-2xl sm:text-3xl">{type.emoji}</span>
                        {selectedType === type.type && (
                          <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping"></div>
                        )}
                      </div>
                      
                      {/* 타입 정보 */}
                      <div>
                        <h3 className={`text-sm sm:text-base font-bold tracking-tight mb-1
                          ${selectedType === type.type ? `text-${type.accentColor}-700` : 'text-gray-900'}
                        `}>
                          {type.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          {type.subtitle}
                        </p>
                      </div>
                      
                      {/* 계절 표시 */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full mt-2
                        ${selectedType === type.type 
                          ? `bg-${type.accentColor}-100 border border-${type.accentColor}-200` 
                          : 'bg-gray-100 border border-gray-200'
                        } transition-colors duration-300`}>
                        <div className={`w-1.5 h-1.5 rounded-full 
                          ${selectedType === type.type ? `bg-${type.accentColor}-500 animate-pulse` : 'bg-gray-400'}
                        `}></div>
                        <span className="text-xs font-medium text-gray-600">
                          {type.season}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 메인 콘텐츠 영역 */}
                  <div className="relative px-4 sm:px-6 py-4 sm:py-6 space-y-4 flex-1 flex flex-col">
                                         {/* 설명 */}
                     <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium text-center whitespace-pre-line">
                       {type.description}
                     </p>
                    
                    {/* 컬러 팔레트 */}
                    <div className="flex justify-center gap-2 mb-3">
                      {type.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-md transform hover:scale-125 transition-all duration-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                                         {/* 전문 분야 태그들 */}
                     <div className="space-y-2 flex-1">
                       <h4 className="text-xs font-semibold text-gray-500 text-center">
                         핵심 역량
                       </h4>
                       <div className="flex flex-wrap gap-1 justify-center">
                         {type.features.map((feature, idx) => (
                           <span 
                             key={idx}
                             className={`px-1.5 py-0.5 rounded-full font-medium border transition-all duration-300 whitespace-nowrap
                               ${hoveredType === type.type 
                                 ? `bg-gradient-to-r ${type.gradient} text-white border-transparent shadow-lg` 
                                 : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                               }
                             `}
                             style={{ fontSize: '10px' }}
                           >
                             {feature}
                           </span>
                         ))}
                       </div>
                     </div>
                    
                    {/* 하단 상태 표시 */}
                    <div className="pt-3 border-t border-gray-100 text-center">
                      {selectedType === type.type ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 bg-${type.accentColor}-500 rounded-full animate-ping`}></div>
                          <span className={`text-xs font-semibold text-${type.accentColor}-700`}>
                            분석 시작 중...
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">
                          클릭하여 분석 시작
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 하단 그라데이션 바 */}
                  <div className={`h-1 bg-gradient-to-r ${type.gradient} transform transition-all duration-300 
                    ${hoveredType === type.type || selectedType === type.type ? 'opacity-100' : 'opacity-0'}
                  `}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 안내 */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/70 backdrop-blur-xl rounded-2xl px-6 py-3 border border-gray-200/50 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">무료 분석</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-xs font-medium text-gray-700">개인화된 결과</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-xs font-medium text-gray-700">즉시 완료</span>
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

export default ScenarioTypeSelector;