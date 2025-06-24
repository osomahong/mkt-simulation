export const metadata = {
  title: '마케팅 성향 분석 결과 | 마케터 역량 시뮬레이터',
  openGraph: {
    title: '마케팅 성향 분석 결과 | 마케터 역량 시뮬레이터',
    description: '나의 마케터 성향과 강점을 확인해보세요!',
    images: [
      {
        url: '/og-images/result.png',
        width: 720,
        height: 720,
        alt: '마케터 성향테스트 결과 썸네일',
      },
    ],
  },
};

import ScenarioResultPage from '@/features/scenario/ScenarioResultPage';

export default async function ResultRoutePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedSearchParams = await searchParams;
  return <ScenarioResultPage searchParams={resolvedSearchParams} />;
} 