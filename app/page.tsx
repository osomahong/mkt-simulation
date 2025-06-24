import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          마케터 역량 진단
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          당신의 마케터 유형을 진단하고 강점을 발견하세요. 
          실무에서 흔히 하는 실수를 통해 본인의 전략을 인지하고 개선할 수 있습니다.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              시나리오 진단
            </h2>
            <p className="text-gray-600 mb-6">
              다양한 마케팅 시나리오를 통해 당신의 의사결정 패턴을 분석합니다.
            </p>
            <Link 
              href="/scenarios"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              진단 시작하기
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              급여 분석
            </h2>
            <p className="text-gray-600 mb-6">
              마케터 유형별 급여 현황을 확인하고 본인의 가치를 파악해보세요.
            </p>
            <Link 
              href="/scenarios/salary"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              급여 분석하기
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            진단 특징
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">실무 중심</h4>
              <p className="text-gray-600">실제 마케팅 현장에서 발생하는 상황을 바탕으로 구성</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">즉시 피드백</h4>
              <p className="text-gray-600">답변 선택 후 즉각적인 멘토링형 피드백 제공</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">성향 분석</h4>
              <p className="text-gray-600">답변 패턴을 통한 마케터 성향 및 강점 분석</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 