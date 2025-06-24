import { Scenario } from "./scenario.types";
import { ScenarioSummary } from './scenario.types';

// 실제 프로젝트에서는 tRPC 인스턴스를 import해서 사용해야 합니다.
// 아래는 예시용 구조입니다.
export const useScenarioQuery = (id: string) => {
  // 예시: tRPC 사용 시
  // return trpc.scenario.getScenario.useQuery({ id });

  // MVP용 목업 데이터 (실제 API 연동 전)
  const data: Scenario = {
    id,
    title: "마케팅 시나리오 예시",
    description: "이것은 예시 시나리오 설명입니다.",
    difficulty: 'easy',
    tags: [],
    steps: [
      {
        id: 'step1',
        question: '예시 질문입니다. 어떤 옵션을 선택하시겠습니까?',
        options: [
          { id: 'a', text: '옵션 A' },
          { id: 'b', text: '옵션 B' },
        ],
      },
    ],
  };
  return { data, isLoading: false, error: null };
};

export async function fetchScenarioList(): Promise<ScenarioSummary[]> {
  // TODO: 실제 API 연동 시 fetch('/api/scenarios') 등으로 변경
  return [
    {
      id: '1',
      title: '이커머스 마케팅 캠페인',
      description: '가상의 이커머스 브랜드의 마케팅 캠페인을 기획하고 실행해보세요.',
      difficulty: 'medium',
      tags: ['이커머스', '캠페인'],
    },
    {
      id: '2',
      title: 'B2B SaaS 런칭',
      description: 'B2B SaaS 제품의 시장 진입 전략을 수립하세요.',
      difficulty: 'hard',
      tags: ['B2B', 'SaaS'],
    },
  ];
}

export async function fetchScenarioDetail(id: string): Promise<Scenario> {
  // TODO: 실제 API 연동 시 fetch(`/api/scenarios/${id}`) 등으로 변경
  // 임시 mock 데이터
  if (id === '1') {
    return {
      id: '1',
      title: '이커머스 마케팅 캠페인',
      description: '가상의 이커머스 브랜드의 마케팅 캠페인을 기획하고 실행해보세요.',
      difficulty: 'medium',
      tags: ['이커머스', '캠페인'],
      steps: [
        {
          id: 'step1',
          question: '1단계: 어떤 마케팅 채널을 우선적으로 활용하시겠습니까?',
          options: [
            { id: 'a', text: 'SNS 광고', feedback: 'SNS 광고는 빠른 도달과 젊은 타겟에게 효과적입니다.' },
            { id: 'b', text: '검색엔진 마케팅', feedback: '검색엔진 마케팅은 구매 의도가 높은 고객을 타겟팅할 수 있습니다.' },
            { id: 'c', text: '인플루언서 협업', feedback: '인플루언서 협업은 신뢰도와 바이럴 효과를 기대할 수 있습니다.' },
          ],
        },
        {
          id: 'step2',
          question: '2단계: 마케팅 예산을 어떻게 배분하시겠습니까?',
          options: [
            { id: 'a', text: '브랜드 인지도 70% / 퍼포먼스 30%', feedback: '브랜드 인지도에 집중하면 장기적 성장에 유리합니다.' },
            { id: 'b', text: '브랜드 인지도 30% / 퍼포먼스 70%', feedback: '퍼포먼스에 집중하면 단기 매출 증대에 효과적입니다.' },
            { id: 'c', text: '50% / 50% 균형 배분', feedback: '균형 배분은 리스크를 분산할 수 있습니다.' },
          ],
        },
        {
          id: 'step3',
          question: '3단계: 가장 중요한 KPI는 무엇입니까?',
          options: [
            { id: 'a', text: '신규 회원 가입 수', feedback: '신규 회원 확보는 시장 점유율 확대에 중요합니다.' },
            { id: 'b', text: '구매 전환율', feedback: '구매 전환율은 실질적인 매출 성장을 의미합니다.' },
            { id: 'c', text: 'SNS 팔로워 증가', feedback: '팔로워 증가는 브랜드 팬덤 형성에 기여합니다.' },
          ],
        },
      ],
    };
  }
  // ... 기존 B2B SaaS 시나리오 ...
  return {
    id,
    title: 'B2B SaaS 런칭',
    description: 'B2B SaaS 제품의 시장 진입 전략을 수립하세요.',
    difficulty: 'hard',
    tags: ['B2B', 'SaaS'],
    steps: [
      {
        id: 'step1',
        question: '첫 번째 마케팅 전략을 선택하세요.',
        options: [
          { id: 'a', text: 'SNS 광고', feedback: 'SNS 광고는 빠른 도달이 강점입니다.' },
          { id: 'b', text: '검색엔진 마케팅', feedback: '검색엔진 마케팅은 구매 의도가 높은 고객을 타겟팅할 수 있습니다.' },
        ],
      },
      {
        id: 'step2',
        question: '예산 배분 방식을 선택하세요.',
        options: [
          { id: 'a', text: '브랜드 인지도 중심', feedback: '브랜드 인지도에 집중하면 장기적 성장에 유리합니다.' },
          { id: 'b', text: '전환율 중심', feedback: '전환율에 집중하면 단기 매출 증대에 효과적입니다.' },
        ],
      },
    ],
  };
} 