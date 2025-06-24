"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';

const MARKETER_TYPES = [
  {
    type: 'B2C',
    name: 'B2C 마케터',
    description: '소비재, 서비스 등 일반 대중을 대상으로 마케팅합니다.',
    emoji: '🛍️',
  },
  {
    type: 'B2B',
    name: 'B2B 마케터',
    description: '다른 기업을 대상으로 제품이나 솔루션을 마케팅합니다.',
    emoji: '🏢',
  },
  {
    type: '이커머스',
    name: '이커머스 마케터',
    description: '온라인 쇼핑몰의 매출 증대와 고객 관리를 담당합니다.',
    emoji: '🛒',
  },
];

const ScenarioTypeSelector = () => {
  const setMarketerType = useScenarioStore(state => state.setMarketerType);
  const router = useRouter();

  const handleSelect = (type: string) => {
    setMarketerType(type);
    router.push('/scenarios/salary');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
          🎨 마케팅 성향 테스트
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed">
          정답은 없어요! 당신은 어떤 스타일의 마케터인가요?
        </p>
        <div className="space-y-4">
          {MARKETER_TYPES.map(({ type, name, description, emoji }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="w-full flex items-center gap-4 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 border border-slate-200/50 hover:border-blue-400/50 transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl p-5 sm:p-7 ring-0 hover:ring-2 hover:ring-blue-200/50 focus:outline-none transform hover:scale-[1.02] hover:-translate-y-1"
            >
              <span className="text-3xl sm:text-4xl">{emoji}</span>
              <div className="flex flex-col text-left">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">{name}</h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioTypeSelector; 