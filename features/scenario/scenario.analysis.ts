// features/scenario/scenario.analysis.ts

// 답변 데이터 타입 정의
type Answer = {
  tags: string[];
  difficulty: '쉬움' | '보통' | '어려움';
};

// 페르소나 분석 결과 타입
export type PersonaResult = {
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
};

// 태그별 키워드 정의
const tagInfo = {
  '데이터 기반': {
    persona: '분석가',
    adjective: '논리적인',
    strength: '논리적이고 객관적인 의사결정을 내립니다. GA4, 애널리틱스 도구를 활용한 정확한 성과 측정과 A/B 테스트를 통한 최적화에 뛰어납니다. 특히 한국의 높은 디지털 접근성을 활용한 온라인 마케팅 성과 분석에서 강점을 보입니다.',
    weakness: '시장의 감성적, 정성적 요소를 놓칠 수 있습니다. 한국 소비자들의 브랜드 충성도와 감정적 연결을 중요시하는 특성을 간과할 수 있어, 데이터만으로는 해결할 수 없는 브랜드 이미지 구축에 어려움을 겪을 수 있습니다.',
  },
  '고객 경험 중시': {
    persona: '공감가',
    adjective: '고객 중심의',
    strength: '높은 고객 충성도를 확보하고 유지하는 데 능숙합니다. 한국의 높은 모바일 사용률과 소셜미디어 의존도를 고려한 멀티채널 고객 경험 설계에 탁월합니다. 특히 카카오톡, 네이버 등 플랫폼 특성을 활용한 개인화된 커뮤니케이션에서 뛰어난 성과를 보입니다.',
    weakness: '때로는 데이터 기반의 냉정한 판단을 내리기 어려워합니다. 감정적 판단으로 인해 ROI가 낮은 캠페인을 지속하거나, 정량적 성과 측정을 소홀히 할 수 있어 예산 효율성 측면에서 약점을 보일 수 있습니다.',
  },
  '혁신/실험 선호': {
    persona: '혁신가',
    adjective: '대담한',
    strength: '새로운 시장 기회를 포착하고 선점하는 능력이 뛰어납니다. 한국의 빠른 기술 수용도와 새로운 플랫폼(틱톡, 쇼츠 등) 활용에 앞장서며, 메타버스, AI 마케팅 등 최신 트렌드를 적극 도입하는 선도적 역할을 합니다. 특히 Z세대를 타겟으로 한 혁신적 캠페인 설계에서 탁월합니다.',
    weakness: '안정성이 부족하고, 실패 확률이 높은 시도를 할 수 있습니다. 한국의 보수적인 기업 문화와 안정성 중시 경향을 고려하지 않아, 과도한 실험으로 인한 예산 낭비나 브랜드 이미지 훼손의 위험을 초래할 수 있습니다.',
  },
  '트렌드 중시': {
    persona: '트렌드세터',
    adjective: '감각적인',
    strength: '시장의 최신 흐름을 빠르게 파악하고 적용합니다. 한국의 빠른 트렌드 변화와 소셜미디어 중심 문화에 완벽하게 적응하여, 인스타그램, 틱톡, 유튜브 쇼츠 등 최신 플랫폼의 바이럴 콘텐츠 제작에 뛰어납니다. 특히 K-컬처와 연계한 글로벌 마케팅에서 강점을 보입니다.',
    weakness: '유행에 민감하여 장기적인 브랜드 전략 구축에 약할 수 있습니다. 단기적 트렌드 추종으로 인해 브랜드 아이덴티티가 흔들리거나, 트렌드가 지나간 후 지속 가능한 성과 창출에 어려움을 겪을 수 있습니다.',
  },
  '단기 성과 집착': {
    persona: '해결사',
    adjective: '성과 중심의',
    strength: '명확한 목표를 빠르게 달성하는 강력한 실행력을 가졌습니다. 한국의 빠른 의사결정 문화와 성과 중심 평가 체계에 적합하여, 월간/분기별 KPI 달성과 실시간 성과 모니터링을 통한 빠른 대응에 탁월합니다. 특히 이커머스 플랫폼의 세일 이벤트나 프로모션 캠페인에서 뛰어난 성과를 보입니다.',
    weakness: '장기적인 브랜드 가치나 고객 관계 구축을 소홀히 할 수 있습니다. 단기 성과에만 집중하여 브랜드 이미지 훼손이나 고객 이탈을 초래할 수 있으며, 한국 소비자들이 중시하는 브랜드 신뢰도와 지속 가능한 관계 구축에 소극적일 수 있습니다.',
  },
  '리스크 회피': {
    persona: '안정주의자',
    adjective: '신중한',
    strength: '신중한 의사결정으로 실패 확률을 최소화합니다. 한국의 보수적 기업 문화와 안정성 중시 경향에 적합하여, 검증된 마케팅 채널과 안전한 전략을 통해 일관된 성과를 창출합니다. 특히 브랜드 이미지 보호와 위기 관리 측면에서 뛰어난 능력을 보입니다.',
    weakness: '과감한 시도를 하지 못해 큰 성장의 기회를 놓칠 수 있습니다. 빠르게 변화하는 한국 디지털 마케팅 환경에서 새로운 플랫폼이나 혁신적 접근을 주저하여 경쟁사에 뒤처지거나, 젊은 세대의 관심을 잃을 수 있습니다.',
  },
  '감성': {
    persona: '스토리텔러',
    adjective: '감성적인',
    strength: '매력적인 브랜드 스토리로 소비자의 마음을 움직입니다. 한국의 감정적 소비 문화와 브랜드 스토리텔링 중시 경향에 완벽하게 부합하여, 감동적이고 공감되는 콘텐츠 제작에 뛰어납니다. 특히 K-드라마, 웹툰 등과 연계한 감성적 마케팅에서 탁월한 성과를 보입니다.',
    weakness: '성과를 데이터로 증명하거나 논리적으로 설명하는 데 약할 수 있습니다. 감정적 접근에만 의존하여 정량적 성과 측정을 소홀히 하거나, ROI 분석이 어려운 캠페인을 지속할 수 있어 예산 효율성 측면에서 약점을 보일 수 있습니다.',
  },
  // 기타 태그 추가 가능
};

type Tag = keyof typeof tagInfo;

// 공동 1위 특별 조합 페르소나
const specialCombos: { [key: string]: PersonaResult } = {
  '고객 경험 중시,혁신/실험 선호': {
    title: '고객의 마음을 파고드는 혁신가',
    description: "당신은 고객의 경험을 최우선으로 생각하면서도, 기존의 틀을 깨는 대담한 실험을 두려워하지 않는군요! 한국의 높은 모바일 사용률과 소셜미디어 의존도를 고려한 혁신적 고객 경험 설계에 탁월합니다. 특히 카카오톡, 네이버 등 플랫폼의 특성을 활용한 개인화된 커뮤니케이션과 함께, 메타버스, AI 챗봇 등 최신 기술을 접목한 고객 경험 혁신을 선도합니다. Z세대와 밀레니얼 세대의 디지털 네이티브 특성을 완벽하게 이해하고, 이를 바탕으로 한 혁신적 마케팅 전략 수립에서 뛰어난 성과를 보입니다.",
    strengths: [tagInfo['고객 경험 중시'].strength, tagInfo['혁신/실험 선호'].strength],
    weaknesses: [tagInfo['고객 경험 중시'].weakness, tagInfo['혁신/실험 선호'].weakness],
  },
  '데이터 기반,단기 성과 집착': {
    title: '성과로 증명하는 데이터 해결사',
    description: "당신은 냉철한 데이터 분석을 통해 가장 빠르게 성과를 만들어내는 해결사 타입입니다. 한국의 빠른 의사결정 문화와 성과 중심 평가 체계에 완벽하게 적합하여, GA4, 애널리틱스 도구를 활용한 실시간 성과 모니터링과 A/B 테스트를 통한 최적화에 뛰어납니다. 특히 이커머스 플랫폼의 세일 이벤트나 프로모션 캠페인에서 데이터 기반의 빠른 의사결정으로 탁월한 성과를 창출합니다. 월간/분기별 KPI 달성과 ROI 최적화를 통해 팀의 성공을 이끄는 리더십을 발휘합니다.",
    strengths: [tagInfo['데이터 기반'].strength, tagInfo['단기 성과 집착'].strength],
    weaknesses: [tagInfo['데이터 기반'].weakness, tagInfo['단기 성과 집착'].weakness],
  },
   '데이터 기반,고객 경험 중시': {
    title: '데이터로 고객을 읽는 전략가',
    description: "당신은 고객의 행동 데이터 속에서 숨겨진 니즈를 발견하고, 이를 바탕으로 정교한 전략을 수립하는 마케터입니다. 한국의 높은 디지털 접근성과 모바일 사용률을 활용하여, 고객 여정 데이터와 행동 패턴을 분석해 개인화된 마케팅 전략을 구축합니다. 특히 카카오톡, 네이버 등 플랫폼의 특성을 고려한 데이터 기반 고객 세분화와 타겟팅에 탁월하며, 감에 의존하기보다 데이터로 고객의 마음을 증명해냅니다. 브랜드 충성도와 고객 생애 가치(LTV)를 동시에 향상시키는 균형 잡힌 전략 수립 능력을 보유하고 있습니다.",
    strengths: [tagInfo['데이터 기반'].strength, tagInfo['고객 경험 중시'].strength],
    weaknesses: [tagInfo['데이터 기반'].weakness, tagInfo['고객 경험 중시'].weakness],
  },
  // 기타 특별 조합 추가 가능
};


export const analyzeAnswers = (answers: Answer[]): PersonaResult => {
  const tagCounts: { [tag: string]: number } = {};
  answers.forEach(answer => {
    answer.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

  if (sortedTags.length === 0) {
    return { title: '분석 결과가 없습니다', description: '답변을 선택해주세요.', strengths: [], weaknesses: [] };
  }

  const topScore = sortedTags[0][1];
  const topTiedTags = sortedTags.filter(([, score]) => score === topScore).map(([tag]) => tag);
  topTiedTags.sort(); // 일관된 키 생성을 위해 정렬

  // 규칙 3: 공동 1위 특별 조합 확인
  const comboKey = topTiedTags.join(',');
  if (specialCombos[comboKey]) {
    return specialCombos[comboKey];
  }

  // 규칙 1 & 2: 1위 독주형 또는 2강 체제형
  const primaryTag = sortedTags[0][0] as Tag;
  const primaryInfo = tagInfo[primaryTag] || { persona: primaryTag, adjective: '실용적인', strength: '실용적인 문제 해결에 강합니다.', weakness: '새로운 시도에 소극적일 수 있습니다.' };
  
  if (sortedTags.length === 1 || sortedTags[0][1] > sortedTags[1][1]) {
    return {
      title: `${primaryInfo.adjective} ${primaryInfo.persona}`,
      description: `당신은 '${primaryTag}' 성향이 가장 두드러지는 마케터입니다. 한국의 디지털 마케팅 환경에서 이 성향을 중심으로 전략을 세우고 실행하는 데 강점이 있습니다. 특히 ${primaryTag === '데이터 기반' ? 'GA4, 애널리틱스 도구를 활용한 정확한 성과 측정과 A/B 테스트를 통한 최적화' : primaryTag === '고객 경험 중시' ? '카카오톡, 네이버 등 플랫폼 특성을 활용한 개인화된 커뮤니케이션' : primaryTag === '혁신/실험 선호' ? '틱톡, 쇼츠 등 새로운 플랫폼 활용과 메타버스, AI 마케팅 등 최신 트렌드 도입' : primaryTag === '트렌드 중시' ? '인스타그램, 틱톡, 유튜브 쇼츠 등 최신 플랫폼의 바이럴 콘텐츠 제작' : primaryTag === '단기 성과 집착' ? '이커머스 플랫폼의 세일 이벤트나 프로모션 캠페인에서의 빠른 성과 창출' : primaryTag === '리스크 회피' ? '검증된 마케팅 채널과 안전한 전략을 통한 일관된 성과 창출' : 'K-드라마, 웹툰 등과 연계한 감성적 마케팅'}에서 뛰어난 성과를 보일 수 있습니다.`,
      strengths: [primaryInfo.strength],
      weaknesses: [primaryInfo.weakness],
    };
  } else {
    const secondaryTag = sortedTags[1][0] as Tag;
    const secondaryInfo = tagInfo[secondaryTag] || { persona: secondaryTag, adjective: '다재다능한', strength: '다양한 상황에 유연하게 대처합니다.', weakness: '한 분야의 전문성이 부족할 수 있습니다.'};
    return {
      title: `${secondaryInfo.adjective} ${primaryInfo.persona}`,
      description: `당신은 '${primaryTag}' 성향을 기반으로, '${secondaryTag}' 성향을 유연하게 활용하는 마케터입니다. 한국의 복합적인 디지털 마케팅 환경에서 두 성향의 조화를 통해 더욱 효과적인 전략을 구축할 수 있습니다. ${primaryTag === '데이터 기반' && secondaryTag === '고객 경험 중시' ? '고객 행동 데이터를 분석하여 개인화된 경험을 설계하는 균형 잡힌 접근' : primaryTag === '고객 경험 중시' && secondaryTag === '데이터 기반' ? '고객 중심의 마케팅을 데이터로 검증하고 최적화하는 체계적 접근' : '두 성향의 장점을 결합한 혁신적 마케팅 전략'}을 통해 시장에서 차별화된 경쟁력을 확보할 수 있는 잠재력이 있습니다.`,
      strengths: [primaryInfo.strength, secondaryInfo.strength],
      weaknesses: [primaryInfo.weakness, secondaryInfo.weakness],
    };
  }
}; 