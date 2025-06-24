"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';

const MARKETER_TYPES = [
  {
    type: 'B2C',
    name: 'B2C 마케터',
    description: '소비재, 서비스 등 일반 대중을 대상으로 마케팅합니다.',
  },
  {
    type: 'B2B',
    name: 'B2B 마케터',
    description: '다른 기업을 대상으로 제품이나 솔루션을 마케팅합니다.',
  },
  {
    type: '이커머스',
    name: '이커머스 마케터',
    description: '온라인 쇼핑몰의 매출 증대와 고객 관리를 담당합니다.',
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          마케터 역량 진단
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10">
          어떤 유형의 마케터인지 선택하고, 당신의 강점을 확인해보세요.
        </p>
        <div className="space-y-4">
          {MARKETER_TYPES.map(({ type, name, description }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="w-full text-left bg-white hover:bg-slate-100 border border-slate-200 transition-all duration-200 rounded-lg shadow-sm p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">{name}</h2>
              <p className="text-sm sm:text-base text-slate-500 mt-1">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioTypeSelector; 