// features/scenario/scenario.analysis.ts

import questionsData from './scenario.questions.json';

// 답변 데이터 타입 정의
type Answer = {
  tags: string[];
  difficulty: '쉬움' | '보통' | '어려움';
};

// 태그별 점수 타입
type TagScore = {
  score: number;              // 0-100점
  level: 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BASIC' | 'MINIMAL';
  rank: number;               // 1-11등
  percentage: number;         // 전체 점수 대비 비율
};

// 마케팅 스타일 분석 타입
type MarketingStyle = {
  approach: string;           // 접근 방식
  decisionMaking: string;     // 의사결정 스타일
  communication: string;      // 커뮤니케이션 방식
  riskTolerance: string;      // 위험 관리 스타일
  timeOrientation: string;    // 시간 지향성
};

// 개인화된 결과 타입
export type PersonalizedResult = {
  // 핵심 정체성
  marketingDNA: string;
  personalColors: string[];
  
  // 점수 상세 분석
  tagScores: { [tagName: string]: TagScore };
  totalScore: number;
  
  // 개인화된 피드백
  topStrengths: { title: string; description: string }[];     // 상위 3개 태그 기반 강점
  growthAreas: string[];      // 하위 3개 태그 기반 성장 영역
  recommendations: string[];   // 맞춤형 성장 제안
  
  // 마케팅 스타일 프로필
  marketingStyle: MarketingStyle;
  
  // 커리어 가이드
  suitableRoles: string[];    // 적합한 역할
  skillDevelopment: string[]; // 개발할 스킬
  
  // 기술 추천
  recommendedTechnologies: {
    tools: string[];          // 추천 툴
    platforms: string[];      // 추천 플랫폼
    skills: string[];         // 추천 스킬
    contentTypes: string[];   // 추천 콘텐츠 유형
  };
};

// 새로운 분석 시스템: 선택 패턴 기반 마케터 유형 분류

// 의사결정 스타일 분석
const analyzeDecisionStyle = (answers: Answer[]): string => {
  const tagCounts: { [tag: string]: number } = {};
  
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  const primaryTag = sortedTags[0]?.[0];
  const secondaryTag = sortedTags[1]?.[0];

  // 의사결정 스타일 매핑
  const decisionStyles: { [key: string]: string } = {
    '데이터 기반': '데이터로 검증하는 의사결정을',
    '고객 경험 중시': '고객의 마음을 읽는 의사결정을',
    '혁신/실험 선호': '새로운 가능성을 탐색하는 의사결정을',
    '트렌드 중시': '시장의 흐름을 읽는 의사결정을',
    '단기 성과 집착': '즉각적인 결과를 추구하는 의사결정을',
    '리스크 회피': '안정성을 우선하는 의사결정을',
    '감성': '감정의 연결을 중시하는 의사결정을',
    '콘텐츠 마케팅': '스토리텔링 기반 의사결정을',
    '비용 효율 중시': '효율성을 극대화하는 의사결정을',
    '장기 전략': '미래를 그리는 의사결정을',
    '브랜드 가치 중시': '브랜드의 정체성을 지키는 의사결정을'
  };

  if (primaryTag && decisionStyles[primaryTag]) {
    return decisionStyles[primaryTag];
  }

  return '종합적인 관점에서 의사결정을';
};

// 접근 방식 분석
const analyzeApproachStyle = (answers: Answer[]): string => {
  const tagCounts: { [tag: string]: number } = {};
  
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  const primaryTag = sortedTags[0]?.[0];
  const secondaryTag = sortedTags[1]?.[0];

  // 접근 방식 매핑
  const approachStyles: { [key: string]: string } = {
    '데이터 기반': '데이터로 증명하는 접근법을',
    '고객 경험 중시': '고객의 마음을 이해하는 접근법을',
    '혁신/실험 선호': '새로운 시도를 두려워하지 않는 접근법을',
    '트렌드 중시': '시대의 흐름을 타는 접근법을',
    '단기 성과 집착': '목표 달성에 집중하는 접근법을',
    '리스크 회피': '신중하고 안정적인 접근법을',
    '감성': '마음을 움직이는 접근법을',
    '콘텐츠 마케팅': '스토리로 소통하는 접근법을',
    '비용 효율 중시': '효율성을 추구하는 접근법을',
    '장기 전략': '미래를 준비하는 접근법을',
    '브랜드 가치 중시': '브랜드의 가치를 지키는 접근법을'
  };

  if (primaryTag && approachStyles[primaryTag]) {
    return approachStyles[primaryTag];
  }

  return '균형 잡힌 접근법을';
};

// 위험 관리 스타일 분석
const analyzeRiskProfile = (answers: Answer[]): string => {
  const tagCounts: { [tag: string]: number } = {};
  
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  const primaryTag = sortedTags[0]?.[0];
  const secondaryTag = sortedTags[1]?.[0];

  // 위험 관리 스타일 매핑
  const riskStyles: { [key: string]: string } = {
    '데이터 기반': '데이터로 검증된 위험 관리를',
    '고객 경험 중시': '고객 만족을 우선하는 위험 관리를',
    '혁신/실험 선호': '혁신을 위한 과감한 도전을',
    '트렌드 중시': '트렌드 선점을 위한 신속한 판단을',
    '단기 성과 집착': '성과 달성을 위한 집중적 관리를',
    '리스크 회피': '체계적인 위험 회피를',
    '감성': '브랜드 가치를 지키는 위험 관리를',
    '콘텐츠 마케팅': '창작의 자유를 추구하는 위험 관리를',
    '비용 효율 중시': '효율성을 검증하는 위험 관리를',
    '장기 전략': '전략적 위험 감수를',
    '브랜드 가치 중시': '브랜드 가치 보호를'
  };

  if (primaryTag && riskStyles[primaryTag]) {
    return riskStyles[primaryTag];
  }

  return '상황에 맞는 유연한 위험 관리를';
};

// 시간 지향성 분석
const analyzeTimeHorizon = (answers: Answer[]): string => {
  const tagCounts: { [tag: string]: number } = {};
  
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  const primaryTag = sortedTags[0]?.[0];
  const secondaryTag = sortedTags[1]?.[0];

  // 시간 지향성 매핑
  const timeStyles: { [key: string]: string } = {
    '데이터 기반': '체계적인 장기 계획을',
    '고객 경험 중시': '고객과의 지속적 관계를',
    '혁신/실험 선호': '미래를 선도하는 혁신을',
    '트렌드 중시': '시대의 흐름을 타는 즉시성을',
    '단기 성과 집착': '즉각적인 결과 추구를',
    '리스크 회피': '지속 가능한 안정성을',
    '감성': '감정적 지속성을',
    '콘텐츠 마케팅': '콘텐츠의 생명주기 관리를',
    '비용 효율 중시': '장기적 비용 최적화를',
    '장기 전략': '미래 지향적 성장을',
    '브랜드 가치 중시': '브랜드의 지속성을'
  };

  if (primaryTag && timeStyles[primaryTag]) {
    return timeStyles[primaryTag];
  }

  return '단기와 장기의 균형을';
};

// 커뮤니케이션 스타일 분석
const analyzeCommunicationStyle = (answers: Answer[]): string => {
  const tagCounts: { [tag: string]: number } = {};
  
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  const primaryTag = sortedTags[0]?.[0];
  const secondaryTag = sortedTags[1]?.[0];

  // 커뮤니케이션 스타일 매핑
  const communicationStyles: { [key: string]: string } = {
    '데이터 기반': '논리적으로 설득하는 소통을',
    '고객 경험 중시': '공감하며 소통하는 방식을',
    '혁신/실험 선호': '아이디어를 나누는 소통을',
    '트렌드 중시': '감각적으로 메시지를 전달하는 방식을',
    '단기 성과 집착': '결과 중심의 소통을',
    '리스크 회피': '신뢰를 바탕으로 한 소통을',
    '감성': '스토리로 마음을 전하는 방식을',
    '콘텐츠 마케팅': '내러티브 중심의 소통을',
    '비용 효율 중시': '수치로 증명하는 소통을',
    '장기 전략': '비전을 공유하는 소통을',
    '브랜드 가치 중시': '브랜드 스토리텔링을'
  };

  if (primaryTag && communicationStyles[primaryTag]) {
    return communicationStyles[primaryTag];
  }

  return '상황에 맞는 유연한 소통을';
};

// 11개 태그 완전 정의
const TAG_DEFINITIONS = {
  '데이터 기반': {
    name: '데이터 기반',
    description: '객관적 데이터와 분석을 통한 의사결정 선호도',
    expertLevel: 'Data Scientist Marketer',
    levels: {
      EXPERT: { name: '데이터 사이언티스트', description: 'GA4, SQL, Python을 활용한 고도의 데이터 분석과 예측 모델링으로 마케팅 전략을 수립합니다.' },
      ADVANCED: { name: '분석 전문가', description: '다양한 애널리틱스 툴을 능숙하게 활용하여 성과를 측정하고 최적화 방안을 도출합니다.' },
      INTERMEDIATE: { name: '논리적 사고자', description: '기본적인 데이터 분석을 통해 합리적인 마케팅 의사결정을 내립니다.' },
      BASIC: { name: '직감 의존형', description: '데이터보다는 경험과 직감에 의존하여 마케팅 활동을 진행합니다.' },
      MINIMAL: { name: '감정 우선형', description: '데이터 분석에 어려움을 느끼며 주로 감정과 느낌으로 판단합니다.' }
    }
  },
  '고객 경험 중시': {
    name: '고객 경험 중시',
    description: '고객의 니즈와 만족도를 최우선으로 하는 정도',
    expertLevel: 'Customer Experience Designer',
    levels: {
      EXPERT: { name: '고객 경험 디자이너', description: '고객 여정의 모든 터치포인트를 설계하고 개선하여 탁월한 경험을 창조합니다.' },
      ADVANCED: { name: '공감 마스터', description: '고객의 감정과 니즈를 깊이 이해하고 이를 마케팅 전략에 완벽하게 반영합니다.' },
      INTERMEDIATE: { name: '고객 지향적', description: '고객의 관점에서 마케팅 활동을 기획하고 실행합니다.' },
      BASIC: { name: '제품 중심적', description: '제품의 기능과 특징에 더 집중하며 고객 관점은 부분적으로 고려합니다.' },
      MINIMAL: { name: '내부 지향적', description: '회사 내부 관점에서 마케팅을 접근하며 고객 경험에 대한 관심이 낮습니다.' }
    }
  },
  '혁신/실험 선호': {
    name: '혁신/실험 선호',
    description: '새로운 아이디어와 실험적 접근을 추구하는 성향',
    expertLevel: 'Innovation Leader',
    levels: {
      EXPERT: { name: '혁신 리더', description: '업계를 선도하는 새로운 마케팅 방법론을 창조하고 확산시킵니다.' },
      ADVANCED: { name: '실험가', description: '끊임없는 A/B 테스트와 신기술 도입으로 마케팅 성과를 혁신합니다.' },
      INTERMEDIATE: { name: '도전자', description: '검증된 방법에서 벗어나 새로운 시도를 주저하지 않습니다.' },
      BASIC: { name: '안정 선호', description: '검증된 방법을 선호하며 새로운 시도는 신중하게 접근합니다.' },
      MINIMAL: { name: '변화 회피형', description: '기존 방식을 고수하며 새로운 변화에 저항감을 보입니다.' }
    }
  },
  '트렌드 중시': {
    name: '트렌드 중시',
    description: '최신 트렌드와 유행에 대한 민감도와 적용 능력',
    expertLevel: 'Trend Setter',
    levels: {
      EXPERT: { name: '트렌드 세터', description: '새로운 트렌드를 만들어내고 시장을 선도하는 영향력을 가집니다.' },
      ADVANCED: { name: '얼리 어답터', description: '트렌드를 가장 빠르게 포착하고 마케팅에 창의적으로 활용합니다.' },
      INTERMEDIATE: { name: '트렌드 팔로워', description: '검증된 트렌드를 적절한 시점에 마케팅에 접목시킵니다.' },
      BASIC: { name: '보수적', description: '트렌드보다는 안정적이고 검증된 방법을 선호합니다.' },
      MINIMAL: { name: '전통 고수형', description: '트렌드에 무관심하며 전통적인 마케팅 방식을 고집합니다.' }
    }
  },
  '단기 성과 집착': {
    name: '단기 성과 집착',
    description: '즉각적이고 가시적인 성과를 추구하는 정도',
    expertLevel: 'Performance Driver',
    levels: {
      EXPERT: { name: '성과 드라이버', description: '빠른 실행력과 민첩한 대응으로 즉각적인 성과를 창출합니다.' },
      ADVANCED: { name: '실행력 강화형', description: '명확한 KPI 달성을 위해 집중적이고 효율적으로 실행합니다.' },
      INTERMEDIATE: { name: '목표 지향적', description: '설정된 목표 달성에 집중하며 성과 창출에 적극적입니다.' },
      BASIC: { name: '과정 중시형', description: '결과보다는 과정과 방법론의 완성도를 더 중요하게 여깁니다.' },
      MINIMAL: { name: '장기 관점형', description: '단기 성과보다는 장기적 가치 창출에 더 큰 의미를 둡니다.' }
    }
  },
  '리스크 회피': {
    name: '리스크 회피',
    description: '안정성과 확실성을 중시하는 정도',
    expertLevel: 'Risk Manager',
    levels: {
      EXPERT: { name: '위험 관리 전문가', description: '체계적인 리스크 분석과 관리로 안정적인 성과를 보장합니다.' },
      ADVANCED: { name: '신중한 계획가', description: '철저한 사전 검토와 계획을 통해 위험을 최소화합니다.' },
      INTERMEDIATE: { name: '균형 추구형', description: '위험과 기회를 균형있게 고려하여 의사결정을 내립니다.' },
      BASIC: { name: '적극적', description: '계산된 위험을 감수하며 기회를 적극적으로 추구합니다.' },
      MINIMAL: { name: '모험가', description: '높은 위험도 감수하며 과감한 도전을 즐깁니다.' }
    }
  },
  '감성': {
    name: '감성',
    description: '감정적 연결과 스토리텔링을 중시하는 정도',
    expertLevel: 'Emotional Storyteller',
    levels: {
      EXPERT: { name: '감성 스토리텔러', description: '강력한 감정적 연결을 통해 브랜드와 고객 간의 깊은 유대감을 형성합니다.' },
      ADVANCED: { name: '공감 커뮤니케이터', description: '타겟 고객의 감정을 정확히 파악하고 공감대를 형성하는 메시지를 전달합니다.' },
      INTERMEDIATE: { name: '감정 인식형', description: '고객의 감정적 니즈를 이해하고 이를 마케팅에 반영합니다.' },
      BASIC: { name: '논리 우선형', description: '감정보다는 논리적 설득에 더 집중하는 경향이 있습니다.' },
      MINIMAL: { name: '분석적', description: '감정적 접근보다는 데이터와 분석에 전적으로 의존합니다.' }
    }
  },
  '콘텐츠 마케팅': {
    name: '콘텐츠 마케팅',
    description: '콘텐츠 기반 마케팅 전략과 실행 능력',
    expertLevel: 'Content Creator',
    levels: {
      EXPERT: { name: '콘텐츠 크리에이터', description: '바이럴이 되는 콘텐츠를 기획하고 제작하여 브랜드 인지도를 극대화합니다.' },
      ADVANCED: { name: '스토리 빌더', description: '브랜드의 핵심 메시지를 매력적인 스토리로 구성하여 전달합니다.' },
      INTERMEDIATE: { name: '콘텐츠 기획자', description: '타겟에 맞는 콘텐츠를 기획하고 일관된 메시지를 전달합니다.' },
      BASIC: { name: '광고 중심형', description: '콘텐츠보다는 직접적인 광고 메시지 전달을 선호합니다.' },
      MINIMAL: { name: '직접 판매형', description: '콘텐츠보다는 즉각적인 판매와 프로모션에 집중합니다.' }
    }
  },
  '비용 효율 중시': {
    name: '비용 효율 중시',
    description: 'ROI와 비용 최적화를 추구하는 정도',
    expertLevel: 'ROI Optimizer',
    levels: {
      EXPERT: { name: 'ROI 최적화 전문가', description: '모든 마케팅 활동의 ROI를 정밀하게 측정하고 최적화합니다.' },
      ADVANCED: { name: '효율성 관리자', description: '예산 대비 최대 효과를 창출하는 마케팅 전략을 수립합니다.' },
      INTERMEDIATE: { name: '비용 의식형', description: '예산을 고려하여 효율적인 마케팅 방안을 선택합니다.' },
      BASIC: { name: '투자 적극형', description: '성과를 위해서는 과감한 투자도 마다하지 않습니다.' },
      MINIMAL: { name: '프리미엄 추구형', description: '비용보다는 품질과 브랜드 가치를 우선시합니다.' }
    }
  },
  '장기 전략': {
    name: '장기 전략',
    description: '장기적 관점에서의 전략 수립과 실행 능력',
    expertLevel: 'Strategic Planner',
    levels: {
      EXPERT: { name: '전략 기획자', description: '5-10년 단위의 장기 비전을 수립하고 체계적으로 실행합니다.' },
      ADVANCED: { name: '비전 설계자', description: '미래 시장 변화를 예측하고 지속 가능한 전략을 설계합니다.' },
      INTERMEDIATE: { name: '계획적 사고자', description: '중장기적 관점에서 마케팅 계획을 수립하고 실행합니다.' },
      BASIC: { name: '단기 집중형', description: '장기보다는 당면한 과제 해결에 더 집중합니다.' },
      MINIMAL: { name: '즉흥적', description: '계획보다는 상황에 따른 즉석 대응을 선호합니다.' }
    }
  },
  '브랜드 가치 중시': {
    name: '브랜드 가치 중시',
    description: '브랜드 이미지와 가치 구축을 중시하는 정도',
    expertLevel: 'Brand Builder',
    levels: {
      EXPERT: { name: '브랜드 빌더', description: '강력한 브랜드 정체성을 구축하고 시장에서 독특한 포지셔닝을 확립합니다.' },
      ADVANCED: { name: '가치 창조자', description: '브랜드 고유의 가치를 창조하고 고객들에게 의미있는 경험을 제공합니다.' },
      INTERMEDIATE: { name: '브랜드 지향적', description: '브랜드 일관성을 유지하며 장기적 이미지 구축에 노력합니다.' },
      BASIC: { name: '성과 우선형', description: '브랜드보다는 즉각적인 성과와 매출에 더 집중합니다.' },
      MINIMAL: { name: '기능 중심형', description: '브랜드 이미지보다는 제품/서비스의 기능적 측면을 강조합니다.' }
    }
  }
};

// 점수 계산 함수 (완화된 극단화 방식)
const calculateTagScore = (tagCount: number, totalAnswers: number, allTagCounts: { [tag: string]: number }): number => {
  // 전체 태그 중에서 상대적 순위 계산
  const allCounts = Object.values(allTagCounts);
  const maxCount = Math.max(...allCounts);
  const minCount = Math.min(...allCounts);
  const totalRange = maxCount - minCount;
  
  if (totalRange === 0) {
    // 모든 점수가 같으면 50점
    return 50;
  }
  
  // 상대적 위치 계산 (0-1)
  const relativePosition = (tagCount - minCount) / totalRange;
  
  // 더욱 완화된 점수 분배 (극단적 분배 완화)
  const sortedCounts = allCounts.sort((a, b) => b - a);
  const myRank = sortedCounts.indexOf(tagCount) + 1;
  const totalTags = sortedCounts.length;
  
  let finalScore;
  
  if (myRank <= 2) {
    // 상위 2개: 60-80점 (기존 70-90에서 더 완화)
    finalScore = 60 + (relativePosition * 20);
  } else if (myRank <= 4) {
    // 중상위 2개: 50-70점 (기존 55-75에서 완화)
    finalScore = 50 + (relativePosition * 20);
  } else if (myRank <= 7) {
    // 중위 3개: 40-60점 (기존 40-60에서 유지)
    finalScore = 40 + (relativePosition * 20);
  } else if (myRank <= 9) {
    // 중하위 2개: 30-50점 (기존 25-45에서 완화)
    finalScore = 30 + (relativePosition * 20);
  } else {
    // 하위 2개: 20-40점 (기존 10-30에서 완화)
    finalScore = 20 + (relativePosition * 20);
  }
  
  // 추가 완화: 최고점과 최저점을 더욱 완화
  if (tagCount === maxCount) {
    finalScore = Math.max(finalScore, 65); // 최고점은 최소 65점 (기존 75에서 완화)
  }
  if (tagCount === minCount && tagCount < maxCount * 0.3) {
    finalScore = Math.min(finalScore, 30); // 최저점은 최대 30점 (기존 25에서 완화)
  }
  
  return Math.round(finalScore);
};

// 점수별 레벨 판정
const getScoreLevel = (score: number): 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BASIC' | 'MINIMAL' => {
  if (score >= 80) return 'EXPERT';
  if (score >= 65) return 'ADVANCED';
  if (score >= 45) return 'INTERMEDIATE';
  if (score >= 25) return 'BASIC';
  return 'MINIMAL';
};

// 마케팅 DNA 패턴 정의
const DNA_PATTERNS = {
  // 단일 우세형 (80점 이상 1개, 나머지 낮음)
  single_dominant: {
    '데이터 기반': {
      dna: '데이터 사이언티스트 마케터',
      colors: ['생각이 머무는 안개의 짙은 그레이', '신중하게 타오르는 청록의 불꽃'],
      approach: '분석적 접근법',
      decisionMaking: '데이터 기반 의사결정',
      communication: '논리적 설득',
      riskTolerance: '계산된 위험 관리',
      timeOrientation: '체계적 장기 계획'
    },
    '고객 경험 중시': {
      dna: '고객 경험 아키텍트',
      colors: ['따뜻한 마음이 피어나는 코랄 핑크', '공감의 물결이 흐르는 연둣빛 바다'],
      approach: '고객 중심 접근법',
      decisionMaking: '고객 니즈 기반 의사결정',
      communication: '공감적 소통',
      riskTolerance: '고객 만족 우선 위험 관리',
      timeOrientation: '고객 생애가치 중심'
    },
    '혁신/실험 선호': {
      dna: '디지털 이노베이터',
      colors: ['새벽을 깨우는 전기빛 바이올렛', '경계를 부수는 네온 오렌지'],
      approach: '실험적 접근법',
      decisionMaking: '가설 검증 기반 의사결정',
      communication: '아이디어 중심 소통',
      riskTolerance: '혁신을 위한 적극적 위험 감수',
      timeOrientation: '미래 지향적 사고'
    },
    '트렌드 중시': {
      dna: '트렌드 캐처',
      colors: ['순간을 포착하는 홀로그램 실버', '트렌드가 춤추는 무지개빛 프리즘'],
      approach: '트렌드 기반 접근법',
      decisionMaking: '시장 흐름 기반 의사결정',
      communication: '감각적 메시지 전달',
      riskTolerance: '트렌드 선점을 위한 신속한 결정',
      timeOrientation: '즉시성과 유행성 중시'
    },
    '단기 성과 집착': {
      dna: '퍼포먼스 드라이버',
      colors: ['목표를 향한 화살의 골드', '승리를 새기는 다이아몬드 화이트'],
      approach: '성과 중심 접근법',
      decisionMaking: 'KPI 달성 중심 의사결정',
      communication: '결과 중심 소통',
      riskTolerance: '단기 성과를 위한 집중적 위험 관리',
      timeOrientation: '즉각적 결과 추구'
    },
    '리스크 회피': {
      dna: '안정성 마스터',
      colors: ['신뢰가 쌓이는 깊은 네이비', '안정감이 흐르는 모스 그린'],
      approach: '안정적 접근법',
      decisionMaking: '리스크 최소화 의사결정',
      communication: '신뢰 기반 소통',
      riskTolerance: '체계적 위험 회피',
      timeOrientation: '지속 가능성 중시'
    },
    '감성': {
      dna: '감성 스토리텔러',
      colors: ['이야기가 시작되는 미드나잇 블루', '감동이 피어나는 벚꽃 로즈'],
      approach: '감성적 접근법',
      decisionMaking: '감정 연결 중심 의사결정',
      communication: '스토리텔링 소통',
      riskTolerance: '브랜드 가치 보호 중심',
      timeOrientation: '감정적 지속성 추구'
    },
    '콘텐츠 마케팅': {
      dna: '콘텐츠 크리에이터',
      colors: ['스토리가 흐르는 인디고 블루', '창작의 영감이 피어나는 에메랄드 그린'],
      approach: '콘텐츠 중심 접근법',
      decisionMaking: '스토리텔링 기반 의사결정',
      communication: '내러티브 중심 소통',
      riskTolerance: '창작적 자유 추구',
      timeOrientation: '콘텐츠 생명주기 관리'
    },
    '비용 효율 중시': {
      dna: '효율성 최적화 전문가',
      colors: ['절약의 지혜가 빛나는 실버 그레이', '효율이 흐르는 클리어 크리스탈'],
      approach: '효율성 중심 접근법',
      decisionMaking: 'ROI 기반 의사결정',
      communication: '수치 중심 소통',
      riskTolerance: '검증된 효율성 추구',
      timeOrientation: '장기적 비용 최적화'
    },
    '장기 전략': {
      dna: '전략적 비전 리더',
      colors: ['미래를 그리는 딥 퍼플', '전략이 빛나는 골드 앰버'],
      approach: '전략적 접근법',
      decisionMaking: '장기 비전 기반 의사결정',
      communication: '비전 중심 소통',
      riskTolerance: '전략적 위험 감수',
      timeOrientation: '장기적 성장 추구'
    },
    '브랜드 가치 중시': {
      dna: '브랜드 가디언',
      colors: ['브랜드의 영혼이 깃든 로얄 블루', '가치가 빛나는 다이아몬드 화이트'],
      approach: '브랜드 중심 접근법',
      decisionMaking: '브랜드 가치 기반 의사결정',
      communication: '브랜드 스토리텔링',
      riskTolerance: '브랜드 가치 보호',
      timeOrientation: '브랜드 지속성 추구'
    }
  },
  
  // 이중 우세형 (70점 이상 2개)
  dual_dominant: {
    '데이터 기반+고객 경험 중시': {
      dna: '데이터 기반 고객 경험 설계자',
      colors: ['마음을 읽는 크리스탈 블루', '통찰이 빛나는 갤럭시 퍼플'],
      approach: '데이터 기반 고객 중심 접근법',
      decisionMaking: '고객 데이터 분석 기반 의사결정',
      communication: '데이터로 증명하는 공감적 소통',
      riskTolerance: '고객 만족과 성과의 균형',
      timeOrientation: '장기적 고객 가치 구축'
    },
    '데이터 기반+혁신/실험 선호': {
      dna: '데이터 사이언스 이노베이터',
      colors: ['미래를 예측하는 퀀텀 실버', '혁신이 증명되는 사파이어 블루'],
      approach: '데이터 기반 혁신 접근법',
      decisionMaking: 'A/B 테스트 기반 의사결정',
      communication: '실험 결과 중심 소통',
      riskTolerance: '데이터로 검증된 혁신 추구',
      timeOrientation: '지속적 개선과 혁신'
    },
    '데이터 기반+단기 성과 집착': {
      dna: 'ROI 최적화 스페셜리스트',
      colors: ['승부를 가르는 스틸 실버', '데이터가 말하는 사파이어 블루'],
      approach: '성과 최적화 접근법',
      decisionMaking: 'ROI 기반 의사결정',
      communication: '수치로 말하는 소통',
      riskTolerance: '계산된 성과 추구',
      timeOrientation: '분기별 목표 달성 중심'
    },
    '고객 경험 중시+혁신/실험 선호': {
      dna: '고객 중심 이노베이션 리더',
      colors: ['고객의 꿈이 피어나는 아쿠아 그린', '혁신이 깃드는 오팔 퍼플'],
      approach: '고객 중심 혁신 접근법',
      decisionMaking: '고객 니즈 기반 실험 의사결정',
      communication: '고객과 함께하는 혁신 소통',
      riskTolerance: '고객을 위한 과감한 혁신',
      timeOrientation: '고객 미래 가치 창조'
    },
    '고객 경험 중시+감성': {
      dna: '감성 고객 경험 디자이너',
      colors: ['마음이 닿는 따뜻한 앰버', '공감이 흐르는 라벤더 퍼플'],
      approach: '감성적 고객 경험 접근법',
      decisionMaking: '고객 감정 중심 의사결정',
      communication: '마음을 움직이는 소통',
      riskTolerance: '고객 감정 보호 중심',
      timeOrientation: '감정적 유대감 구축'
    },
    '혁신/실험 선호+트렌드 중시': {
      dna: '트렌드 이노베이션 크리에이터',
      colors: ['트렌드를 앞서는 네온 핑크', '혁신이 흐르는 홀로그램 골드'],
      approach: '트렌드 기반 혁신 접근법',
      decisionMaking: '트렌드 예측 기반 의사결정',
      communication: '미래 트렌드 제시 소통',
      riskTolerance: '트렌드 선도를 위한 과감한 실험',
      timeOrientation: '트렌드 사이클 앞선 대응'
    },
    '트렌드 중시+콘텐츠 마케팅': {
      dna: '바이럴 콘텐츠 크리에이터',
      colors: ['바이럴이 시작되는 일렉트릭 옐로우', '콘텐츠가 흐르는 머메이드 그린'],
      approach: '콘텐츠 기반 트렌드 접근법',
      decisionMaking: '바이럴 가능성 중심 의사결정',
      communication: '트렌디한 스토리텔링',
      riskTolerance: '화제성을 위한 도전적 콘텐츠',
      timeOrientation: '트렌드 라이프사이클 최적화'
    },
    '단기 성과 집착+비용 효율 중시': {
      dna: '효율성 극대화 마케터',
      colors: ['효율이 흐르는 클리어 크리스탈', '성과가 빛나는 플래티넘 실버'],
      approach: '효율성 극대화 접근법',
      decisionMaking: '비용 대비 효과 중심 의사결정',
      communication: 'ROI 중심 소통',
      riskTolerance: '효율성 검증된 전략 선택',
      timeOrientation: '분기별 효율성 최적화'
    },
    '데이터 기반+트렌드 중시': {
      dna: '데이터 기반 트렌드 애널리스트',
      colors: ['트렌드를 분석하는 퀀텀 실버', '데이터가 말하는 홀로그램 골드'],
      approach: '데이터 기반 트렌드 접근법',
      decisionMaking: '트렌드 데이터 분석 기반 의사결정',
      communication: '데이터로 증명하는 트렌드 소통',
      riskTolerance: '데이터 검증된 트렌드 추구',
      timeOrientation: '트렌드 사이클 최적화'
    },
    '고객 경험 중시+단기 성과 집착': {
      dna: '고객 중심 성과 마스터',
      colors: ['고객의 마음을 읽는 코랄 핑크', '성과가 빛나는 골드'],
      approach: '고객 중심 성과 접근법',
      decisionMaking: '고객 만족과 성과 균형 의사결정',
      communication: '고객 중심 결과 소통',
      riskTolerance: '고객 만족 기반 성과 추구',
      timeOrientation: '고객 생애가치와 단기 성과'
    },
    '혁신/실험 선호+감성': {
      dna: '감성 이노베이션 크리에이터',
      colors: ['감성이 깃든 바이올렛', '혁신이 피어나는 로즈 골드'],
      approach: '감성적 혁신 접근법',
      decisionMaking: '감정 연결 기반 실험 의사결정',
      communication: '감성적 아이디어 소통',
      riskTolerance: '감정적 혁신 추구',
      timeOrientation: '감정적 지속성과 혁신'
    },
    '트렌드 중시+감성': {
      dna: '감성 트렌드 스토리텔러',
      colors: ['트렌드가 감동을 주는 무지개빛', '감성이 흐르는 라벤더'],
      approach: '감성적 트렌드 접근법',
      decisionMaking: '감정적 트렌드 기반 의사결정',
      communication: '감성적 트렌드 스토리텔링',
      riskTolerance: '감정적 트렌드 추구',
      timeOrientation: '감정적 트렌드 지속성'
    },
    '콘텐츠 마케팅+감성': {
      dna: '감성 콘텐츠 아티스트',
      colors: ['감성이 담긴 인디고', '스토리가 피어나는 로즈'],
      approach: '감성적 콘텐츠 접근법',
      decisionMaking: '감정적 스토리텔링 의사결정',
      communication: '감성적 내러티브 소통',
      riskTolerance: '감정적 창작 자유 추구',
      timeOrientation: '감정적 콘텐츠 생명주기'
    },
    '데이터 기반+브랜드 가치 중시': {
      dna: '데이터 기반 브랜드 스트래티지스트',
      colors: ['브랜드의 데이터가 빛나는 로얄 블루', '분석이 깃든 다이아몬드'],
      approach: '데이터 기반 브랜드 접근법',
      decisionMaking: '브랜드 데이터 분석 기반 의사결정',
      communication: '데이터로 증명하는 브랜드 소통',
      riskTolerance: '데이터 검증된 브랜드 가치 추구',
      timeOrientation: '브랜드 지속성과 데이터'
    },
    '고객 경험 중시+브랜드 가치 중시': {
      dna: '브랜드 고객 경험 디자이너',
      colors: ['브랜드의 마음이 닿는 로얄 블루', '고객의 꿈이 피어나는 코랄'],
      approach: '브랜드 기반 고객 경험 접근법',
      decisionMaking: '브랜드 가치와 고객 니즈 균형 의사결정',
      communication: '브랜드 스토리텔링 고객 소통',
      riskTolerance: '브랜드 가치와 고객 만족 보호',
      timeOrientation: '브랜드 지속성과 고객 생애가치'
    },
    '혁신/실험 선호+장기 전략': {
      dna: '전략적 이노베이션 비전리더',
      colors: ['미래를 그리는 딥 퍼플', '혁신이 빛나는 바이올렛'],
      approach: '전략적 혁신 접근법',
      decisionMaking: '장기 비전 기반 실험 의사결정',
      communication: '전략적 아이디어 소통',
      riskTolerance: '전략적 혁신 위험 감수',
      timeOrientation: '장기적 혁신 성장 추구'
    },
    '트렌드 중시+장기 전략': {
      dna: '전략적 트렌드 비전리더',
      colors: ['미래 트렌드를 그리는 딥 퍼플', '트렌드가 빛나는 홀로그램'],
      approach: '전략적 트렌드 접근법',
      decisionMaking: '장기 트렌드 예측 기반 의사결정',
      communication: '전략적 트렌드 비전 소통',
      riskTolerance: '전략적 트렌드 선점 위험 감수',
      timeOrientation: '장기적 트렌드 성장 추구'
    }
  },
  
  // 균형형 (모든 점수가 비슷한 경우)
  balanced: {
    dna: '올라운드 마케팅 스트래티지스트',
    colors: ['균형이 흐르는 오로라 그라데이션', '조화가 빛나는 프리즘 화이트'],
    approach: '통합적 접근법',
    decisionMaking: '다각도 분석 기반 의사결정',
    communication: '상황별 맞춤형 소통',
    riskTolerance: '상황별 유연한 위험 관리',
    timeOrientation: '단기와 장기의 균형'
  }
};

// 강점 및 성장 영역 생성 함수
const generateStrengthsAndGrowthAreas = (tagScores: { [tagName: string]: TagScore }) => {
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  
  const topStrengths = sortedTags.slice(0, 3).map(([tagName, tagScore]) => {
    const tagDef = TAG_DEFINITIONS[tagName as keyof typeof TAG_DEFINITIONS];
    const levelInfo = tagDef.levels[tagScore.level];
    return `**${levelInfo.name}** (${tagScore.score}점) - ${levelInfo.description}`;
  });
  
  const growthAreas = sortedTags.slice(-3).map(([tagName, tagScore]) => {
    const tagDef = TAG_DEFINITIONS[tagName as keyof typeof TAG_DEFINITIONS];
    const currentLevel = tagDef.levels[tagScore.level];
    const nextLevel = getNextLevel(tagScore.level);
    const nextLevelInfo = nextLevel ? tagDef.levels[nextLevel] : null;
    
    if (nextLevelInfo) {
      return `**${tagDef.name}** (현재: ${currentLevel.name}) → 다음 목표: ${nextLevelInfo.name}`;
    } else {
      return `**${tagDef.name}** - 이미 최고 수준에 도달했습니다!`;
    }
  });
  
  return { topStrengths, growthAreas };
};

// 다음 레벨 계산 함수
const getNextLevel = (currentLevel: string): 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BASIC' | 'MINIMAL' | null => {
  const levels = ['MINIMAL', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] as any : null;
};

// 추천사항 생성 함수
const generateRecommendations = (tagScores: { [tagName: string]: TagScore }) => {
  const recommendations: string[] = [];
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  
  // 상위 태그 기반 추천
  const topTag = sortedTags[0];
  if (topTag[1].score >= 80) {
    recommendations.push(`당신의 강점인 '${topTag[0]}'를 더욱 극대화하기 위해 관련 전문 자격증이나 고급 과정을 수강해보세요.`);
  }
  
  // 하위 태그 기반 추천
  const weakestTag = sortedTags[sortedTags.length - 1];
  if (weakestTag[1].score < 40) {
    recommendations.push(`'${weakestTag[0]}' 영역의 기초를 다지기 위해 온라인 강의나 실습 프로젝트를 시작해보세요.`);
  }
  
  // 균형적 추천
  const averageScore = Object.values(tagScores).reduce((sum, tag) => sum + tag.score, 0) / Object.keys(tagScores).length;
  if (averageScore > 60) {
    recommendations.push('전반적으로 높은 수준의 마케팅 역량을 보유하고 있습니다. 리더십 역할에 도전해보세요.');
  } else if (averageScore < 40) {
    recommendations.push('다양한 마케팅 영역에서 기초 역량을 키우는 것에 집중해보세요.');
  }
  
  return recommendations;
};

// 적합한 역할 및 스킬 개발 제안 함수
const generateCareerGuidance = (tagScores: { [tagName: string]: TagScore }) => {
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  const topTags = sortedTags.slice(0, 3);
  
  const suitableRoles: string[] = [];
  const skillDevelopment: string[] = [];
  
  // 상위 3개 태그 조합 기반 역할 제안
  const topTagNames = topTags.map(([name]) => name);
  
  if (topTagNames.includes('데이터 기반') && topTagNames.includes('단기 성과 집착')) {
    suitableRoles.push('퍼포먼스 마케팅 매니저', 'Growth Hacker', '디지털 마케팅 애널리스트');
  }
  
  if (topTagNames.includes('고객 경험 중시') && topTagNames.includes('감성')) {
    suitableRoles.push('브랜드 매니저', 'CRM 마케팅 스페셜리스트', '고객 경험 디자이너');
  }
  
  if (topTagNames.includes('혁신/실험 선호') && topTagNames.includes('트렌드 중시')) {
    suitableRoles.push('신사업 개발 매니저', '디지털 이노베이션 리더', '스타트업 마케팅 리드');
  }
  
  if (topTagNames.includes('콘텐츠 마케팅') && topTagNames.includes('트렌드 중시')) {
    suitableRoles.push('콘텐츠 마케팅 매니저', '소셜미디어 전략가', '브랜드 콘텐츠 디렉터');
  }
  
  // 기본 역할 (태그 조합이 없는 경우)
  if (suitableRoles.length === 0) {
    suitableRoles.push('마케팅 제너럴리스트', '디지털 마케터', '마케팅 기획자');
  }
  
  // 스킬 개발 제안 (하위 태그 기반)
  const weakTags = sortedTags.slice(-3);
  weakTags.forEach(([tagName, tagScore]) => {
    if (tagScore.score < 50) {
      switch (tagName) {
        case '데이터 기반':
          skillDevelopment.push('GA4, Excel/스프레드시트 고급 활용, SQL 기초');
          break;
        case '고객 경험 중시':
          skillDevelopment.push('고객 여정 맵핑, 사용자 리서치 방법론, CX 디자인');
          break;
        case '혁신/실험 선호':
          skillDevelopment.push('A/B 테스트 설계, 신기술 트렌드 학습, 애자일 마케팅');
          break;
        case '트렌드 중시':
          skillDevelopment.push('소셜미디어 트렌드 분석, 인플루언서 마케팅, 바이럴 콘텐츠 기획');
          break;
        case '콘텐츠 마케팅':
          skillDevelopment.push('콘텐츠 기획 및 제작, 카피라이팅, 영상 편집');
          break;
        case '단기 성과 집착':
          skillDevelopment.push('KPI 설정 및 관리, 캠페인 최적화, 실시간 성과 모니터링');
          break;
        case '비용 효율 중시':
          skillDevelopment.push('마케팅 ROI 분석, 예산 관리, 비딩 최적화');
          break;
        case '장기 전략':
          skillDevelopment.push('전략 기획, 시장 분석, 로드맵 수립');
          break;
        case '브랜드 가치 중시':
          skillDevelopment.push('브랜드 전략, 포지셔닝, 브랜드 아이덴티티 개발');
          break;
        case '리스크 회피':
          skillDevelopment.push('리스크 분석, 위기 관리, 컴플라이언스');
          break;
        case '감성':
          skillDevelopment.push('스토리텔링, 감성 마케팅, 브랜드 내러티브');
          break;
      }
    }
  });
  
  return { suitableRoles, skillDevelopment };
};

// 마케팅 DNA 결정 함수
const determineMarketingDNA = (tagScores: { [tagName: string]: TagScore }) => {
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  
  // 65점 이상인 태그들 (기준을 70점에서 65점으로 낮춤)
  const dominantTags = sortedTags.filter(([, score]) => score.score >= 65);
  
  // 55점 이상인 태그들 (기준을 60점에서 55점으로 낮춤)
  const highTags = sortedTags.filter(([, score]) => score.score >= 55);
  
  // 50점 이상인 태그들 (새로운 기준 추가)
  const mediumTags = sortedTags.filter(([, score]) => score.score >= 50);
  
  // 점수 차이 계산
  const scoreDifference = sortedTags.length > 1 ? sortedTags[0][1].score - sortedTags[1][1].score : 100;
  
  // 단일 우세형 (65점 이상이 1개이고, 1-2위 점수 차이가 8점 이상) - 기준 완화
  if (dominantTags.length === 1 && scoreDifference >= 8) {
    const dominantTag = dominantTags[0][0] as keyof typeof DNA_PATTERNS.single_dominant;
    return DNA_PATTERNS.single_dominant[dominantTag] || DNA_PATTERNS.balanced;
  }
  
  // 이중 우세형 (55점 이상이 2개이고, 점수 차이가 12점 미만)
  if (highTags.length >= 2 && scoreDifference < 12) {
    const tag1 = highTags[0][0];
    const tag2 = highTags[1][0];
    const comboKey = `${tag1}+${tag2}` as keyof typeof DNA_PATTERNS.dual_dominant;
    const reverseComboKey = `${tag2}+${tag1}` as keyof typeof DNA_PATTERNS.dual_dominant;
    
    return DNA_PATTERNS.dual_dominant[comboKey] || DNA_PATTERNS.dual_dominant[reverseComboKey] || DNA_PATTERNS.balanced;
  }
  
  // 삼중 우세형 (55점 이상이 3개 이상인 경우) - 새로운 패턴 추가
  if (highTags.length >= 3) {
    // 가장 높은 2개 태그의 조합으로 결정
    const tag1 = highTags[0][0];
    const tag2 = highTags[1][0];
    const comboKey = `${tag1}+${tag2}` as keyof typeof DNA_PATTERNS.dual_dominant;
    const reverseComboKey = `${tag2}+${tag1}` as keyof typeof DNA_PATTERNS.dual_dominant;
    
    return DNA_PATTERNS.dual_dominant[comboKey] || DNA_PATTERNS.dual_dominant[reverseComboKey] || DNA_PATTERNS.balanced;
  }
  
  // 상위 2개 태그의 점수 차이가 4점 이하인 경우 이중 우세형으로 처리 (기준 완화)
  if (sortedTags.length >= 2 && scoreDifference <= 4) {
    const tag1 = sortedTags[0][0];
    const tag2 = sortedTags[1][0];
    const comboKey = `${tag1}+${tag2}` as keyof typeof DNA_PATTERNS.dual_dominant;
    const reverseComboKey = `${tag2}+${tag1}` as keyof typeof DNA_PATTERNS.dual_dominant;
    
    return DNA_PATTERNS.dual_dominant[comboKey] || DNA_PATTERNS.dual_dominant[reverseComboKey] || DNA_PATTERNS.balanced;
  }
  
  // 상위 태그가 60점 이상이고 나머지가 40점 이하인 경우 단일 우세형으로 처리
  if (sortedTags[0][1].score >= 60 && sortedTags.slice(1).every(([, score]) => score.score <= 40)) {
    const dominantTag = sortedTags[0][0] as keyof typeof DNA_PATTERNS.single_dominant;
    return DNA_PATTERNS.single_dominant[dominantTag] || DNA_PATTERNS.balanced;
  }
  
  // 균형형 (모든 점수가 비슷하거나 특별한 패턴이 없는 경우)
  return DNA_PATTERNS.balanced;
};

// 메인 분석 함수 (새로운 로직)
export const analyzeAnswers = (answers: Answer[]): PersonalizedResult => {
  // 1. 새로운 점수 계산
  const tagScores = calculateNewTagScores(answers);
  const totalScore = Object.values(tagScores).reduce((sum, tag) => sum + tag.score, 0);

  // 2. 마케터 유형 결정 (새로운 로직)
  const marketerType = determineMarketerType(answers);
  
  // 3. 마케팅 스타일 분석
  const marketingStyle = {
    approach: analyzeApproachStyle(answers),
    decisionMaking: analyzeDecisionStyle(answers),
    communication: analyzeCommunicationStyle(answers),
    riskTolerance: analyzeRiskProfile(answers),
    timeOrientation: analyzeTimeHorizon(answers)
  };

  // 4. 강점 및 성장 영역 생성
  const { topStrengths, growthAreas } = generateNewStrengthsAndGrowthAreas(tagScores);
  
  // 5. 추천사항 생성
  const recommendations = generateNewRecommendations(tagScores);
  
  // 6. 커리어 가이드 생성
  const { suitableRoles, skillDevelopment } = generateNewCareerGuidance(tagScores);

  // 7. 기술 추천 생성
  const recommendedTechnologies = generateTechnologyRecommendations(tagScores);

  return {
    marketingDNA: marketerType.dna,
    personalColors: marketerType.colors,
    tagScores,
    totalScore,
    topStrengths,
    growthAreas,
    recommendations,
    marketingStyle,
    suitableRoles,
    skillDevelopment,
    recommendedTechnologies
  };
};

// 새로운 점수 계산 시스템 (선택 패턴 기반)
const calculateNewTagScores = (answers: Answer[]): { [tagName: string]: TagScore } => {
  const tagCounts: { [tag: string]: number } = {};
  let totalTags = 0;
  
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      totalTags++;
    });
  });

  const tagScores: { [tagName: string]: TagScore } = {};
  const totalAnswers = answers.length;

  Object.keys(TAG_DEFINITIONS).forEach(tagName => {
    const count = tagCounts[tagName] || 0;
    // 선택 비율 (0~1)
    const selectionRatio = count / totalAnswers;
    // 전체 태그 중 내 순위 (1~N)
    const sortedCounts = Object.values(tagCounts).sort((a, b) => b - a);
    const rank = sortedCounts.indexOf(count) + 1;
    const totalTags = sortedCounts.length;

    // 점수 계산 (40~100점 사이로 분포)
    let score = 0;
    if (rank === 1) {
      // 1위: 90~100점 (선택 비율에 따라)
      score = 90 + (selectionRatio * 10);
    } else if (rank === 2) {
      // 2위: 80~95점
      score = 80 + (selectionRatio * 15);
    } else if (rank === 3) {
      // 3위: 70~90점
      score = 70 + (selectionRatio * 20);
    } else if (rank <= 5) {
      // 4~5위: 60~85점
      score = 60 + (selectionRatio * 25);
    } else if (rank <= 7) {
      // 6~7위: 50~75점
      score = 50 + (selectionRatio * 25);
    } else {
      // 8위 이하: 40~65점
      score = 40 + (selectionRatio * 25);
    }
    // 최소/최대 점수 보정
    score = Math.max(40, Math.min(100, Math.round(score)));
    const level = getScoreLevel(score);
    tagScores[tagName] = {
      score,
      level,
      rank: 0, // 나중에 계산
      percentage: 0 // 나중에 계산
    };
  });

  // 랭킹과 퍼센티지 계산 (생략)
  return tagScores;
};

// 강점 및 성장 영역 생성 (새로운 로직)
const generateNewStrengthsAndGrowthAreas = (tagScores: { [tagName: string]: TagScore }) => {
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  
  const topStrengths = sortedTags.slice(0, 3).map(([tagName, tagScore]) => {
    const tagDef = TAG_DEFINITIONS[tagName as keyof typeof TAG_DEFINITIONS];
    const levelInfo = tagDef.levels[tagScore.level];
    return {
      title: levelInfo.name,
      description: levelInfo.description
    };
  });
  
  const growthAreas = sortedTags.slice(-3).map(([tagName, tagScore]) => {
    const tagDef = TAG_DEFINITIONS[tagName as keyof typeof TAG_DEFINITIONS];
    const currentLevel = tagDef.levels[tagScore.level];
    const nextLevel = getNextLevel(tagScore.level);
    const nextLevelInfo = nextLevel ? tagDef.levels[nextLevel] : null;
    
    if (nextLevelInfo) {
      return `${tagDef.name} (현재: ${currentLevel.name}) → 다음 목표: ${nextLevelInfo.name}`;
    } else {
      return `${tagDef.name} - 이미 최고 수준에 도달했습니다!`;
    }
  });
  
  return { topStrengths, growthAreas };
};

// 추천사항 생성 (새로운 로직)
const generateNewRecommendations = (tagScores: { [tagName: string]: TagScore }) => {
  const recommendations: string[] = [];
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  
  // 상위 태그 기반 추천
  const topTag = sortedTags[0];
  if (topTag[1].score >= 70) {
    recommendations.push(`당신의 강점인 '${topTag[0]}'를 더욱 극대화하기 위해 관련 전문 자격증이나 고급 과정을 수강해보세요.`);
  }
  
  // 하위 태그 기반 추천
  const weakestTag = sortedTags[sortedTags.length - 1];
  if (weakestTag[1].score < 30) {
    recommendations.push(`'${weakestTag[0]}' 영역의 기초를 다지기 위해 온라인 강의나 실습 프로젝트를 시작해보세요.`);
  }
  
  // 균형적 추천
  const averageScore = Object.values(tagScores).reduce((sum, tag) => sum + tag.score, 0) / Object.keys(tagScores).length;
  if (averageScore > 50) {
    recommendations.push('전반적으로 높은 수준의 마케팅 역량을 보유하고 있습니다. 리더십 역할에 도전해보세요.');
  } else if (averageScore < 30) {
    recommendations.push('다양한 마케팅 영역에서 기초 역량을 키우는 것에 집중해보세요.');
  }
  
  return recommendations;
};

// 커리어 가이드 생성 (새로운 로직)
const generateNewCareerGuidance = (tagScores: { [tagName: string]: TagScore }) => {
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  const topTags = sortedTags.slice(0, 3);
  
  const suitableRoles: string[] = [];
  const skillDevelopment: string[] = [];
  
  // 상위 3개 태그 조합 기반 역할 제안
  const topTagNames = topTags.map(([name]) => name);
  
  if (topTagNames.includes('데이터 기반') && topTagNames.includes('단기 성과 집착')) {
    suitableRoles.push('퍼포먼스 마케팅 매니저', 'Growth Hacker', '디지털 마케팅 애널리스트');
  }
  
  if (topTagNames.includes('고객 경험 중시') && topTagNames.includes('감성')) {
    suitableRoles.push('브랜드 매니저', 'CRM 마케팅 스페셜리스트', '고객 경험 디자이너');
  }
  
  if (topTagNames.includes('혁신/실험 선호') && topTagNames.includes('트렌드 중시')) {
    suitableRoles.push('신사업 개발 매니저', '디지털 이노베이션 리더', '스타트업 마케팅 리드');
  }
  
  if (topTagNames.includes('콘텐츠 마케팅') && topTagNames.includes('트렌드 중시')) {
    suitableRoles.push('콘텐츠 마케팅 매니저', '소셜미디어 전략가', '브랜드 콘텐츠 디렉터');
  }
  
  // 기본 역할 (태그 조합이 없는 경우)
  if (suitableRoles.length === 0) {
    suitableRoles.push('마케팅 제너럴리스트', '디지털 마케터', '마케팅 기획자');
  }
  
  // 스킬 개발 제안 (하위 태그 기반)
  const weakTags = sortedTags.slice(-3);
  weakTags.forEach(([tagName, tagScore]) => {
    if (tagScore.score < 40) {
      switch (tagName) {
        case '데이터 기반':
          skillDevelopment.push('GA4, Excel/스프레드시트 고급 활용, SQL 기초');
          break;
        case '고객 경험 중시':
          skillDevelopment.push('고객 여정 맵핑, 사용자 리서치 방법론, CX 디자인');
          break;
        case '혁신/실험 선호':
          skillDevelopment.push('A/B 테스트 설계, 신기술 트렌드 학습, 애자일 마케팅');
          break;
        case '트렌드 중시':
          skillDevelopment.push('소셜미디어 트렌드 분석, 인플루언서 마케팅, 바이럴 콘텐츠 기획');
          break;
        case '콘텐츠 마케팅':
          skillDevelopment.push('콘텐츠 기획 및 제작, 카피라이팅, 영상 편집');
          break;
        case '단기 성과 집착':
          skillDevelopment.push('KPI 설정 및 관리, 캠페인 최적화, 실시간 성과 모니터링');
          break;
        case '비용 효율 중시':
          skillDevelopment.push('마케팅 ROI 분석, 예산 관리, 비딩 최적화');
          break;
        case '장기 전략':
          skillDevelopment.push('전략 기획, 시장 분석, 로드맵 수립');
          break;
        case '브랜드 가치 중시':
          skillDevelopment.push('브랜드 전략, 포지셔닝, 브랜드 아이덴티티 개발');
          break;
        case '리스크 회피':
          skillDevelopment.push('리스크 분석, 위기 관리, 컴플라이언스');
          break;
        case '감성':
          skillDevelopment.push('스토리텔링, 감성 마케팅, 브랜드 내러티브');
          break;
      }
    }
  });
  
  return { suitableRoles, skillDevelopment };
};

// 단일 우세형 결정
const getSingleDominantType = (primaryTag: string): { dna: string; colors: string[] } => {
  const singleTypes = {
    '데이터 기반': {
      dna: '데이터 사이언티스트 마케터',
      colors: ['생각이 머무는 안개의 짙은 그레이', '신중하게 타오르는 청록의 불꽃']
    },
    '고객 경험 중시': {
      dna: '고객 경험 아키텍트',
      colors: ['따뜻한 마음이 피어나는 코랄 핑크', '공감의 물결이 흐르는 연둣빛 바다']
    },
    '혁신/실험 선호': {
      dna: '디지털 이노베이터',
      colors: ['새벽을 깨우는 전기빛 바이올렛', '경계를 부수는 네온 오렌지']
    },
    '트렌드 중시': {
      dna: '트렌드 캐처',
      colors: ['순간을 포착하는 홀로그램 실버', '트렌드가 춤추는 무지개빛 프리즘']
    },
    '단기 성과 집착': {
      dna: '퍼포먼스 드라이버',
      colors: ['목표를 향한 화살의 골드', '승리를 새기는 다이아몬드 화이트']
    },
    '리스크 회피': {
      dna: '안정성 마스터',
      colors: ['신뢰가 쌓이는 깊은 네이비', '안정감이 흐르는 모스 그린']
    },
    '감성': {
      dna: '감성 스토리텔러',
      colors: ['이야기가 시작되는 미드나잇 블루', '감동이 피어나는 벚꽃 로즈']
    },
    '콘텐츠 마케팅': {
      dna: '콘텐츠 크리에이터',
      colors: ['스토리가 흐르는 인디고 블루', '창작의 영감이 피어나는 에메랄드 그린']
    },
    '비용 효율 중시': {
      dna: '효율성 최적화 전문가',
      colors: ['절약의 지혜가 빛나는 실버 그레이', '효율이 흐르는 클리어 크리스탈']
    },
    '장기 전략': {
      dna: '전략적 비전 리더',
      colors: ['미래를 그리는 딥 퍼플', '전략이 빛나는 골드 앰버']
    },
    '브랜드 가치 중시': {
      dna: '브랜드 가디언',
      colors: ['브랜드의 영혼이 깃든 로얄 블루', '가치가 빛나는 다이아몬드 화이트']
    }
  };

  return singleTypes[primaryTag as keyof typeof singleTypes] || {
    dna: '올라운드 마케팅 스트래티지스트',
    colors: ['균형이 흐르는 오로라 그라데이션', '조화가 빛나는 프리즘 화이트']
  };
};

// 이중 우세형 결정
const getDualDominantType = (primaryTag: string, secondaryTag: string): { dna: string; colors: string[] } => {
  const dualTypes = {
    '데이터 기반+고객 경험 중시': {
      dna: '데이터 기반 고객 경험 설계자',
      colors: ['마음을 읽는 크리스탈 블루', '통찰이 빛나는 갤럭시 퍼플']
    },
    '데이터 기반+혁신/실험 선호': {
      dna: '데이터 사이언스 이노베이터',
      colors: ['미래를 예측하는 퀀텀 실버', '혁신이 증명되는 사파이어 블루']
    },
    '데이터 기반+단기 성과 집착': {
      dna: 'ROI 최적화 스페셜리스트',
      colors: ['승부를 가르는 스틸 실버', '데이터가 말하는 사파이어 블루']
    },
    '고객 경험 중시+혁신/실험 선호': {
      dna: '고객 중심 이노베이션 리더',
      colors: ['고객의 꿈이 피어나는 아쿠아 그린', '혁신이 깃드는 오팔 퍼플']
    },
    '고객 경험 중시+감성': {
      dna: '감성 고객 경험 디자이너',
      colors: ['마음이 닿는 따뜻한 앰버', '공감이 흐르는 라벤더 퍼플']
    },
    '혁신/실험 선호+트렌드 중시': {
      dna: '트렌드 이노베이션 크리에이터',
      colors: ['트렌드를 앞서는 네온 핑크', '혁신이 흐르는 홀로그램 골드']
    },
    '트렌드 중시+콘텐츠 마케팅': {
      dna: '바이럴 콘텐츠 크리에이터',
      colors: ['바이럴이 시작되는 일렉트릭 옐로우', '콘텐츠가 흐르는 머메이드 그린']
    },
    '단기 성과 집착+비용 효율 중시': {
      dna: '효율성 극대화 마케터',
      colors: ['효율이 흐르는 클리어 크리스탈', '성과가 빛나는 플래티넘 실버']
    },
    '데이터 기반+트렌드 중시': {
      dna: '데이터 기반 트렌드 애널리스트',
      colors: ['트렌드를 분석하는 퀀텀 실버', '데이터가 말하는 홀로그램 골드']
    },
    '고객 경험 중시+단기 성과 집착': {
      dna: '고객 중심 성과 마스터',
      colors: ['고객의 마음을 읽는 코랄 핑크', '성과가 빛나는 골드']
    },
    '혁신/실험 선호+감성': {
      dna: '감성 이노베이션 크리에이터',
      colors: ['감성이 깃든 바이올렛', '혁신이 피어나는 로즈 골드']
    },
    '트렌드 중시+감성': {
      dna: '감성 트렌드 스토리텔러',
      colors: ['트렌드가 감동을 주는 무지개빛', '감성이 흐르는 라벤더']
    },
    '콘텐츠 마케팅+감성': {
      dna: '감성 콘텐츠 아티스트',
      colors: ['감성이 담긴 인디고', '스토리가 피어나는 로즈']
    },
    '데이터 기반+브랜드 가치 중시': {
      dna: '데이터 기반 브랜드 스트래티지스트',
      colors: ['브랜드의 데이터가 빛나는 로얄 블루', '분석이 깃든 다이아몬드'],
      approach: '데이터 기반 브랜드 접근법',
      decisionMaking: '브랜드 데이터 분석 기반 의사결정',
      communication: '데이터로 증명하는 브랜드 소통',
      riskTolerance: '데이터 검증된 브랜드 가치 추구',
      timeOrientation: '브랜드 지속성과 데이터'
    },
    '고객 경험 중시+브랜드 가치 중시': {
      dna: '브랜드 고객 경험 디자이너',
      colors: ['브랜드의 마음이 닿는 로얄 블루', '고객의 꿈이 피어나는 코랄'],
      approach: '브랜드 기반 고객 경험 접근법',
      decisionMaking: '브랜드 가치와 고객 니즈 균형 의사결정',
      communication: '브랜드 스토리텔링 고객 소통',
      riskTolerance: '브랜드 가치와 고객 만족 보호',
      timeOrientation: '브랜드 지속성과 고객 생애가치'
    },
    '혁신/실험 선호+장기 전략': {
      dna: '전략적 이노베이션 비전리더',
      colors: ['미래를 그리는 딥 퍼플', '혁신이 빛나는 바이올렛'],
      approach: '전략적 혁신 접근법',
      decisionMaking: '장기 비전 기반 실험 의사결정',
      communication: '전략적 아이디어 소통',
      riskTolerance: '전략적 혁신 위험 감수',
      timeOrientation: '장기적 혁신 성장 추구'
    },
    '트렌드 중시+장기 전략': {
      dna: '전략적 트렌드 비전리더',
      colors: ['미래 트렌드를 그리는 딥 퍼플', '트렌드가 빛나는 홀로그램'],
      approach: '전략적 트렌드 접근법',
      decisionMaking: '장기 트렌드 예측 기반 의사결정',
      communication: '전략적 트렌드 비전 소통',
      riskTolerance: '전략적 트렌드 선점 위험 감수',
      timeOrientation: '장기적 트렌드 성장 추구'
    }
  };

  const comboKey = `${primaryTag}+${secondaryTag}`;
  const reverseComboKey = `${secondaryTag}+${primaryTag}`;

  return dualTypes[comboKey as keyof typeof dualTypes] || 
         dualTypes[reverseComboKey as keyof typeof dualTypes] || {
    dna: '올라운드 마케팅 스트래티지스트',
    colors: ['균형이 흐르는 오로라 그라데이션', '조화가 빛나는 프리즘 화이트']
  };
};

// 균형형 결정
const getBalancedType = (primaryTag: string, secondaryTag: string): { dna: string; colors: string[] } => {
  // 균형형은 주로 이중 우세형과 유사하지만 더 균등한 분포
  // 상위 2개 태그의 조합으로 구체적인 유형 결정
  return getDualDominantType(primaryTag, secondaryTag);
};

// 특수형 결정 (특별한 패턴 분석)
const getSpecialType = (answers: Answer[], tagCounts: { [tag: string]: number }): { dna: string; colors: string[] } => {
  // 특별한 패턴 분석 (예: 모든 영역이 고르게 분포, 특정 조합 등)
  const totalTags = Object.values(tagCounts).reduce((sum, count) => sum + count, 0);
  const averagePerTag = totalTags / Object.keys(tagCounts).length;
  const variance = Object.values(tagCounts).reduce((sum, count) => sum + Math.pow(count - averagePerTag, 2), 0) / Object.keys(tagCounts).length;
  
  // 분산 기준 완화 (2→1.5)
  if (variance < 1.5) {
    // 매우 균등한 분포
    return {
      dna: '올라운드 마케팅 스트래티지스트',
      colors: ['균형이 흐르는 오로라 그라데이션', '조화가 빛나는 프리즘 화이트']
    };
  }
  
  // 상위 2개 태그로 이중 우세형 결정 (기본적으로 균형형으로 처리)
  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  
  // 상위 태그가 2회 이상이면 이중 우세형으로 처리
  if (sortedTags[0][1] >= 2 && sortedTags[1] && sortedTags[1][1] >= 1) {
    return getDualDominantType(sortedTags[0][0], sortedTags[1][0]);
  }
  
  // 상위 태그가 3회 이상이면 단일 우세형으로 처리
  if (sortedTags[0][1] >= 3) {
    return getSingleDominantType(sortedTags[0][0]);
  }
  
  // 그 외의 경우는 상위 2개 태그로 이중 우세형
  return getDualDominantType(sortedTags[0][0], sortedTags[1] ? sortedTags[1][0] : sortedTags[0][0]);
};

// 마케터 유형 결정 함수 (새로운 로직)
const determineMarketerType = (answers: Answer[]): { dna: string; colors: string[] } => {
  const tagCounts: { [tag: string]: number } = {};
  
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
  const primaryTag = sortedTags[0][0];
  const secondaryTag = sortedTags[1] ? sortedTags[1][0] : primaryTag;
  const primaryCount = sortedTags[0][1];
  const secondaryCount = sortedTags[1] ? sortedTags[1][1] : 0;
  const totalAnswers = answers.length;

  // 선택 비율 계산
  const primaryRatio = primaryCount / totalAnswers;
  const secondaryRatio = secondaryCount / totalAnswers;
  const dominanceRatio = primaryCount / (secondaryCount || 1);

  // 10문제 기준으로 완화된 유형 결정 로직
  if (dominanceRatio >= 2.0 && primaryRatio >= 0.3) {
    // 단일 우세형: 한 영역에 집중 (기준 완화: 2.5→2.0, 0.4→0.3)
    return getSingleDominantType(primaryTag);
  } else if (dominanceRatio >= 1.3 && primaryRatio >= 0.25 && secondaryRatio >= 0.15) {
    // 이중 우세형: 두 영역이 비슷하게 강함 (기준 완화: 1.5→1.3, 0.3→0.25, 0.2→0.15)
    return getDualDominantType(primaryTag, secondaryTag);
  } else if (primaryRatio >= 0.2 && secondaryRatio >= 0.15) {
    // 균형형: 여러 영역이 고르게 분포 (기준 완화: 0.25→0.2, 0.2→0.15)
    return getBalancedType(primaryTag, secondaryTag);
  } else if (primaryCount >= 3 && secondaryCount >= 2) {
    // 추가 조건: 1위가 3회 이상, 2위가 2회 이상이면 이중 우세형
    return getDualDominantType(primaryTag, secondaryTag);
  } else if (primaryCount >= 4) {
    // 추가 조건: 1위가 4회 이상이면 단일 우세형
    return getSingleDominantType(primaryTag);
  } else {
    // 특수형: 특별한 패턴
    return getSpecialType(answers, tagCounts);
  }
};

// 기술 추천 로직 (상위 태그별 대표 2개 영역만)
const TAG_MAIN_TECH_MAP: { [tag: string]: [keyof Omit<ReturnType<typeof generateTechnologyRecommendations>, never>, keyof Omit<ReturnType<typeof generateTechnologyRecommendations>, never>] } = {
  '데이터 기반': ['tools', 'skills'],
  '고객 경험 중시': ['platforms', 'skills'],
  '혁신/실험 선호': ['tools', 'contentTypes'],
  '트렌드 중시': ['platforms', 'contentTypes'],
  '단기 성과 집착': ['tools', 'platforms'],
  '리스크 회피': ['tools', 'skills'],
  '감성': ['platforms', 'contentTypes'],
  '콘텐츠 마케팅': ['skills', 'contentTypes'],
  '비용 효율 중시': ['tools', 'skills'],
  '장기 전략': ['tools', 'skills'],
  '브랜드 가치 중시': ['platforms', 'contentTypes'],
};

const generateTechnologyRecommendations = (tagScores: { [tagName: string]: TagScore }) => {
  const sortedTags = Object.entries(tagScores)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 1)
    .map(([tag]) => tag);

  const tools: string[] = [];
  const platforms: string[] = [];
  const skills: string[] = [];
  const contentTypes: string[] = [];

  sortedTags.forEach(tag => {
    switch (tag) {
      case '데이터 기반':
        tools.push('Google Analytics', 'Tableau', 'Mixpanel');
        skills.push('데이터 분석', 'SQL', 'A/B 테스트');
        break;
      case '고객 경험 중시':
        platforms.push('Instagram', 'YouTube', '네이버 블로그');
        skills.push('고객 인터뷰', '퍼소나 설계', 'UX 리서치');
        break;
      case '혁신/실험 선호':
        tools.push('Optimizely', 'Figma', 'Notion');
        contentTypes.push('실험 과정', '혁신 사례', '베타 테스트');
        break;
      case '트렌드 중시':
        platforms.push('Twitter', 'Instagram', 'TikTok');
        contentTypes.push('트렌드 리포트', '챌린지', '실시간 콘텐츠');
        break;
      case '단기 성과 집착':
        tools.push('Google Ads', 'Facebook Ads', '네이버 광고');
        platforms.push('Instagram', 'TikTok', '네이버 쇼핑');
        break;
      case '리스크 회피':
        tools.push('SEMrush', 'Ahrefs', 'Google Search Console');
        skills.push('SEO', '콘텐츠 마케팅', '브랜드 빌딩');
        break;
      case '감성':
        platforms.push('Instagram', 'Pinterest', 'YouTube');
        contentTypes.push('감성 사진', '스토리', '브랜드 스토리');
        break;
      case '콘텐츠 마케팅':
        skills.push('콘텐츠 기획', '글쓰기', '편집');
        contentTypes.push('블로그 포스트', '뉴스레터', '팟캐스트');
        break;
      case '비용 효율 중시':
        tools.push('Google Analytics', 'Hootsuite', 'Mailchimp');
        skills.push('자동화', 'ROI 분석', '리소스 관리');
        break;
      case '장기 전략':
        tools.push('HubSpot', 'Salesforce', 'Notion');
        skills.push('전략 기획', '브랜드 전략', '시장 분석');
        break;
      case '브랜드 가치 중시':
        platforms.push('Instagram', 'YouTube', 'LinkedIn');
        contentTypes.push('브랜드 스토리', '미션/비전', '가치 공유');
        break;
    }
  });

  // 상위 태그의 대표 2개 영역만 추출
  const mainTag = sortedTags[0];
  const mainAreas = TAG_MAIN_TECH_MAP[mainTag] || ['tools', 'skills'];
  const result: any = {};
  mainAreas.forEach(area => {
    if (area === 'tools') result.tools = tools;
    if (area === 'platforms') result.platforms = platforms;
    if (area === 'skills') result.skills = skills;
    if (area === 'contentTypes') result.contentTypes = contentTypes;
  });
  return result;
};