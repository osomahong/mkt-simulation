export const metadata = {
  title: '마케팅 성향 분석 결과 | 마케터 역량 시뮬레이터',
};

import ScenarioResultPage from '@/features/scenario/ScenarioResultPage';

export default function ResultRoutePage({ searchParams }: any) {
  return <ScenarioResultPage searchParams={searchParams} />;
} 