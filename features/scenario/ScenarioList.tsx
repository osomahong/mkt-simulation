import { useState } from 'react'
import Link from 'next/link'

const ScenarioList = () => {
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  // 임시 빈 배열 (현재 시스템에서 사용하지 않음)
  const scenarios: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 배경 패턴 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/3 via-cyan-400/3 to-blue-400/3"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.06) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="relative z-10 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* 헤더 */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">시나리오 선택</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              🎯 <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">시나리오 분석</span>
            </h1>
            
            <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              실제 마케팅 현장에서 일어나는 다양한 상황들을 통해<br />
              당신의 마케터 성향을 분석해보세요
            </p>
          </div>

          {/* 시나리오 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              
              return (
                <Link key={scenario.id} href={`/scenarios/${scenario.id}`}>
                  <div
                    onMouseEnter={() => setHoveredScenario(scenario.id)}
                    onMouseLeave={() => setHoveredScenario(null)}
                    className={`
                      group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl
                      shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden
                      ${hoveredScenario === scenario.id 
                        ? 'transform scale-105 border-sky-300/70' 
                        : 'hover:scale-102'
                      }
                    `}
                  >
                    {/* 호버 글로우 효과 */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-br from-sky-400/10 to-cyan-400/10 
                      opacity-0 transition-opacity duration-300
                      ${hoveredScenario === scenario.id ? 'opacity-100' : 'group-hover:opacity-50'}
                    `} />
                    
                    <div className="relative p-8">
                      {/* 아이콘 */}
                      <div className="mb-6">
                        <div className={`
                          w-16 h-16 mx-auto bg-gradient-to-br from-sky-100 to-cyan-100 
                          rounded-2xl flex items-center justify-center transition-all duration-300
                          ${hoveredScenario === scenario.id 
                            ? 'bg-gradient-to-br from-sky-200 to-cyan-200 transform rotate-3' 
                            : 'group-hover:from-sky-150 group-hover:to-cyan-150'
                          }
                        `}>
                          <Icon className="w-8 h-8 text-sky-600" />
                        </div>
                      </div>

                      {/* 타이틀 */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-sky-800 transition-colors">
                        {scenario.title}
                      </h3>

                      {/* 설명 */}
                      <p className="text-gray-600 text-sm leading-relaxed text-center mb-6">
                        {scenario.description}
                      </p>

                      {/* 메타 정보 */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                          <span>{scenario.questions.length}개 질문</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span>약 {scenario.estimatedTime}분</span>
                        </div>
                      </div>

                      {/* 시작하기 버튼 */}
                      <div className="mt-6">
                        <div className={`
                          w-full py-3 px-6 rounded-xl text-center font-medium transition-all duration-300
                          ${hoveredScenario === scenario.id
                            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg transform -translate-y-1'
                            : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                          }
                        `}>
                          {hoveredScenario === scenario.id ? '🚀 시작하기' : '분석 시작'}
                        </div>
                      </div>
                    </div>

                    {/* 카드 장식 효과 */}
                    {hoveredScenario === scenario.id && (
                      <>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-sky-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 하단 안내 */}
          <div className="mt-16 text-center">
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">분석 안내</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                각 시나리오는 실제 마케팅 현장의 상황을 재현했습니다.<br />
                정답은 없으니 직감에 따라 자유롭게 선택해 주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioList; 