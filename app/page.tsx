import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-3">
          🎯 마케터 역량 진단
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          당신의 마케터 유형을 진단하고 강점을 발견하세요. 
          실무에서 흔히 하는 실수를 통해 본인의 전략을 인지하고 개선할 수 있습니다.
        </p>
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2">
              📋 시나리오 진단
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              다양한 마케팅 시나리오를 통해 당신의 의사결정 패턴을 분석합니다.
            </p>
            <Link 
              href="/scenarios"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
            >
              🚀 진단 시작하기
            </Link>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-2">
            ✨ 진단 특징
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                💼 실무 중심
              </h4>
              <p className="text-slate-600 leading-relaxed">실제 마케팅 현장에서 발생하는 상황을 바탕으로 구성</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                ⚡ 즉시 피드백
              </h4>
              <p className="text-slate-600 leading-relaxed">답변 선택 후 즉각적인 멘토링형 피드백 제공</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 rounded-xl p-4 border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
                📊 성향 분석
              </h4>
              <p className="text-slate-600 leading-relaxed">답변 패턴을 통한 마케터 성향 및 강점 분석</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 