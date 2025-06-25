const admin = require('firebase-admin');
const serviceAccount = require('./marketer-simulator-firebase-adminsdk-fbsvc-26d1283c88.json');

// Firebase 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 실제 서비스에서 사용되는 모든 유형명 후보군
const MARKETING_DNA_TYPES = [
  // 단일 우세형
  '데이터 사이언티스트 마케터',
  '고객 경험 아키텍트', 
  '디지털 이노베이터',
  '트렌드 캐처',
  '퍼포먼스 드라이버',
  '안정성 마스터',
  '감성 스토리텔러',
  '콘텐츠 크리에이터',
  '효율성 최적화 전문가',
  '전략적 비전 리더',
  '브랜드 가디언',
  
  // 이중 우세형
  '데이터 기반 고객 경험 설계자',
  '데이터 사이언스 이노베이터',
  'ROI 최적화 스페셜리스트',
  '고객 중심 이노베이션 리더',
  '감성 고객 경험 디자이너',
  '트렌드 이노베이션 크리에이터',
  '바이럴 콘텐츠 크리에이터',
  '효율성 극대화 마케터',
  '데이터 기반 트렌드 애널리스트',
  '고객 중심 성과 마스터',
  '감성 이노베이션 크리에이터',
  '감성 트렌드 스토리텔러',
  '감성 콘텐츠 아티스트',
  '데이터 기반 브랜드 스트래티지스트',
  '브랜드 고객 경험 디자이너',
  '전략적 이노베이션 비전리더',
  '전략적 트렌드 비전리더',
  
  // 균형형/특수형
  '올라운드 마케팅 스트래티지스트'
];

// 실제 서비스에서 사용되는 모든 컬러 후보군
const PERSONAL_COLORS = [
  // 단일 우세형 컬러
  '생각이 머무는 안개의 짙은 그레이',
  '신중하게 타오르는 청록의 불꽃',
  '따뜻한 마음이 피어나는 코랄 핑크',
  '공감의 물결이 흐르는 연둣빛 바다',
  '새벽을 깨우는 전기빛 바이올렛',
  '경계를 부수는 네온 오렌지',
  '순간을 포착하는 홀로그램 실버',
  '트렌드가 춤추는 무지개빛 프리즘',
  '목표를 향한 화살의 골드',
  '승리를 새기는 다이아몬드 화이트',
  '신뢰가 쌓이는 깊은 네이비',
  '안정감이 흐르는 모스 그린',
  '이야기가 시작되는 미드나잇 블루',
  '감동이 피어나는 벚꽃 로즈',
  '스토리가 흐르는 인디고 블루',
  '창작의 영감이 피어나는 에메랄드 그린',
  '절약의 지혜가 빛나는 실버 그레이',
  '효율이 흐르는 클리어 크리스탈',
  '미래를 그리는 딥 퍼플',
  '전략이 빛나는 골드 앰버',
  '브랜드의 영혼이 깃든 로얄 블루',
  '가치가 빛나는 다이아몬드 화이트',
  
  // 이중 우세형 컬러
  '마음을 읽는 크리스탈 블루',
  '통찰이 빛나는 갤럭시 퍼플',
  '미래를 예측하는 퀀텀 실버',
  '혁신이 증명되는 사파이어 블루',
  '승부를 가르는 스틸 실버',
  '데이터가 말하는 사파이어 블루',
  '고객의 꿈이 피어나는 아쿠아 그린',
  '혁신이 깃드는 오팔 퍼플',
  '마음이 닿는 따뜻한 앰버',
  '공감이 흐르는 라벤더 퍼플',
  '트렌드를 앞서는 네온 핑크',
  '혁신이 흐르는 홀로그램 골드',
  '바이럴이 시작되는 일렉트릭 옐로우',
  '콘텐츠가 흐르는 머메이드 그린',
  '효율이 흐르는 클리어 크리스탈',
  '성과가 빛나는 플래티넘 실버',
  '트렌드를 분석하는 퀀텀 실버',
  '데이터가 말하는 홀로그램 골드',
  '고객의 마음을 읽는 코랄 핑크',
  '성과가 빛나는 골드',
  '감성이 깃든 바이올렛',
  '혁신이 피어나는 로즈 골드',
  '트렌드가 감동을 주는 무지개빛',
  '감성이 흐르는 라벤더',
  '감성이 담긴 인디고',
  '스토리가 피어나는 로즈',
  '브랜드의 데이터가 빛나는 로얄 블루',
  '분석이 깃든 다이아몬드',
  '브랜드의 마음이 닿는 로얄 블루',
  '고객의 꿈이 피어나는 코랄',
  '미래를 그리는 딥 퍼플',
  '혁신이 빛나는 바이올렛',
  '미래 트렌드를 그리는 딥 퍼플',
  '트렌드가 빛나는 홀로그램',
  
  // 균형형/특수형 컬러
  '균형이 흐르는 오로라 그라데이션',
  '조화가 빛나는 프리즘 화이트'
];

// 실제 서비스에서 사용되는 모든 태그 후보군
const TAG_NAMES = [
  '데이터 기반',
  '고객 경험 중시',
  '혁신/실험 선호',
  '트렌드 중시',
  '단기 성과 집착',
  '리스크 회피',
  '감성',
  '콘텐츠 마케팅',
  '비용 효율 중시',
  '장기 전략',
  '브랜드 가치 중시'
];

// 강점 후보군 (실제 서비스에서 생성되는 형태)
const STRENGTH_TITLES = [
  '데이터 기반 의사결정 전문가',
  '고객 중심 마케팅 전략가',
  '혁신적 실험 설계자',
  '트렌드 예측 및 활용 전문가',
  '성과 최적화 마스터',
  '리스크 관리 전문가',
  '감성적 브랜드 커뮤니케이터',
  '콘텐츠 전략 및 제작 전문가',
  '효율성 극대화 전문가',
  '장기 전략 수립 전문가',
  '브랜드 가치 창조 전문가'
];

const STRENGTH_DESCRIPTIONS = [
  '정확한 데이터 분석을 통해 마케팅 전략을 수립하고 성과를 극대화합니다.',
  '고객의 니즈와 경험을 최우선으로 고려한 마케팅 솔루션을 제공합니다.',
  '창의적이고 혁신적인 접근법으로 새로운 마케팅 기회를 창출합니다.',
  '시장 트렌드를 정확히 파악하고 이를 마케팅에 효과적으로 활용합니다.',
  '단기적 성과 달성과 ROI 최적화에 특화된 마케팅 전략을 실행합니다.',
  '체계적이고 안정적인 마케팅 접근법으로 지속 가능한 성과를 만듭니다.',
  '감정적 연결을 통해 브랜드와 고객 간의 강력한 유대감을 구축합니다.',
  '매력적이고 효과적인 콘텐츠를 통해 브랜드 메시지를 전달합니다.',
  '비용 효율성을 고려한 최적화된 마케팅 전략을 수립합니다.',
  '장기적 관점에서 브랜드 성장과 시장 지배력을 추구합니다.',
  '브랜드의 핵심 가치를 보호하고 강화하는 마케팅 전략을 실행합니다.'
];

// 추천사항 후보군
const RECOMMENDATIONS = [
  '당신의 강점인 데이터 분석을 더욱 극대화하기 위해 관련 전문 자격증이나 고급 과정을 수강해보세요.',
  '고객 경험 중시 역량을 강화하기 위해 UX/UI 디자인 과정이나 고객 여정 맵핑 워크샵에 참여해보세요.',
  '혁신적 실험 능력을 키우기 위해 A/B 테스트 전문 과정이나 실험 설계 방법론을 학습해보세요.',
  '트렌드 예측 능력을 향상시키기 위해 시장 분석 도구나 트렌드 리서치 방법론을 익혀보세요.',
  '성과 최적화 역량을 강화하기 위해 디지털 마케팅 분석 도구나 성과 측정 방법론을 학습해보세요.',
  '리스크 관리 능력을 향상시키기 위해 프로젝트 관리 자격증이나 위험 평가 방법론을 익혀보세요.',
  '감성적 커뮤니케이션 능력을 키우기 위해 스토리텔링 워크샵이나 브랜드 스토리 작성법을 학습해보세요.',
  '콘텐츠 마케팅 역량을 강화하기 위해 콘텐츠 전략 수립법이나 크리에이티브 디자인 과정을 수강해보세요.',
  '효율성 최적화 능력을 향상시키기 위해 프로세스 개선 방법론이나 자동화 도구 활용법을 학습해보세요.',
  '장기 전략 수립 능력을 키우기 위해 전략적 사고 워크샵이나 비즈니스 모델 설계 과정을 수강해보세요.',
  '브랜드 가치 창조 능력을 강화하기 위해 브랜드 전략 수립법이나 브랜드 아이덴티티 디자인 과정을 학습해보세요.',
  '전반적으로 높은 수준의 마케팅 역량을 보유하고 있습니다. 리더십 역할에 도전해보세요.',
  '다양한 마케팅 영역에서 기초 역량을 키우는 것에 집중해보세요.',
  '기초 역량을 다지기 위해 온라인 강의나 실습 프로젝트를 시작해보세요.'
];

// 기술 추천 후보군
const RECOMMENDED_TOOLS = [
  'Google Analytics', 'Google Data Studio', 'Tableau', 'Power BI', 'Mixpanel', 'Hotjar',
  'Adobe Analytics', 'Kissmetrics', 'Amplitude', 'Segment', 'Optimizely', 'VWO'
];

const RECOMMENDED_PLATFORMS = [
  'Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'TikTok Ads',
  'YouTube Ads', 'Twitter Ads', 'Pinterest Ads', 'Snapchat Ads', 'Amazon Ads'
];

const RECOMMENDED_SKILLS = [
  '데이터 분석', 'A/B 테스트', '고객 여정 맵핑', '브랜드 전략', '콘텐츠 마케팅',
  '소셜 미디어 마케팅', '이메일 마케팅', 'SEO/SEM', '인플루언서 마케팅', '퍼포먼스 마케팅'
];

const RECOMMENDED_CONTENT_TYPES = [
  '블로그 포스트', '인포그래픽', '비디오 콘텐츠', '웨비나', '이메일 뉴스레터',
  '소셜 미디어 포스트', '팟캐스트', '웨비나', '케이스 스터디', '화이트페이퍼'
];

// 랜덤 선택 함수
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 랜덤 배열 생성 함수
function getRandomArray(array, minLength = 1, maxLength = 3) {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, length);
}

// 랜덤 점수 생성 함수
function generateRandomScore() {
  return Math.floor(Math.random() * 100) + 1; // 1-100
}

// 랜덤 태그 점수 생성
function generateTagScores() {
  const tagScores = {};
  TAG_NAMES.forEach(tag => {
    const score = generateRandomScore();
    let level;
    if (score >= 80) level = 'EXPERT';
    else if (score >= 60) level = 'ADVANCED';
    else if (score >= 40) level = 'INTERMEDIATE';
    else if (score >= 20) level = 'BASIC';
    else level = 'MINIMAL';
    
    tagScores[tag] = {
      score,
      level,
      rank: 0, // 나중에 계산
      percentage: 0 // 나중에 계산
    };
  });
  
  // 순위와 비율 계산
  const sortedTags = Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score);
  const totalScore = Object.values(tagScores).reduce((sum, tag) => sum + tag.score, 0);
  
  sortedTags.forEach(([tagName], index) => {
    tagScores[tagName].rank = index + 1;
    tagScores[tagName].percentage = Math.round((tagScores[tagName].score / totalScore) * 100);
  });
  
  return tagScores;
}

// 랜덤 강점 생성
function generateTopStrengths() {
  const strengths = [];
  const selectedTitles = getRandomArray(STRENGTH_TITLES, 2, 3);
  
  selectedTitles.forEach((title, index) => {
    const description = STRENGTH_DESCRIPTIONS[STRENGTH_TITLES.indexOf(title)];
    strengths.push({
      title,
      description
    });
  });
  
  return strengths;
}

// 랜덤 추천사항 생성
function generateRecommendations() {
  return getRandomArray(RECOMMENDATIONS, 2, 4);
}

// 랜덤 기술 추천 생성
function generateRecommendedTechnologies() {
  return {
    tools: getRandomArray(RECOMMENDED_TOOLS, 2, 4),
    platforms: getRandomArray(RECOMMENDED_PLATFORMS, 2, 4),
    skills: getRandomArray(RECOMMENDED_SKILLS, 2, 4),
    contentTypes: getRandomArray(RECOMMENDED_CONTENT_TYPES, 2, 4)
  };
}

// 랜덤 답변 생성
function generateRandomAnswers() {
  const answers = [];
  const questionCount = Math.floor(Math.random() * 10) + 15; // 15-25개 질문
  
  for (let i = 0; i < questionCount; i++) {
    const selectedTags = getRandomArray(TAG_NAMES, 1, 3);
    const difficulties = ['쉬움', '보통', '어려움'];
    
    answers.push({
      tags: selectedTags,
      difficulty: getRandomElement(difficulties)
    });
  }
  
  return answers;
}

// 더미 데이터 생성
function generateDummyData(count = 100) {
  const dummyData = [];
  
  for (let i = 0; i < count; i++) {
    const answers = generateRandomAnswers();
    const tagScores = generateTagScores();
    const marketingDNA = getRandomElement(MARKETING_DNA_TYPES);
    const personalColors = getRandomArray(PERSONAL_COLORS, 1, 2);
    const topStrengths = generateTopStrengths();
    const recommendations = generateRecommendations();
    const recommendedTechnologies = generateRecommendedTechnologies();
    
    const result = {
      marketingDNA,
      personalColors,
      tagScores,
      totalScore: Object.values(tagScores).reduce((sum, tag) => sum + tag.score, 0),
      topStrengths,
      growthAreas: getRandomArray(TAG_NAMES, 2, 3).map(tag => `${tag} 영역의 성장이 필요합니다.`),
      recommendations,
      marketingStyle: {
        approach: '통합적 접근법',
        decisionMaking: '데이터 기반 의사결정',
        communication: '상황별 맞춤형 소통',
        riskTolerance: '계산된 위험 관리',
        timeOrientation: '단기와 장기의 균형'
      },
      suitableRoles: getRandomArray(['마케팅 매니저', '브랜드 매니저', '디지털 마케터', '콘텐츠 마케터', '퍼포먼스 마케터'], 2, 4),
      skillDevelopment: getRandomArray(['데이터 분석', '브랜드 전략', '콘텐츠 제작', '소셜 미디어', '퍼포먼스 마케팅'], 2, 4),
      recommendedTechnologies
    };
    
    // 경력별 연봉 구간 (100단위)
    const salaryRanges = {
      1: [2600, 3200],
      2: [3000, 3500],
      3: [3300, 3800],
      4: [3600, 4200],
      5: [4000, 4700],
      6: [4500, 5300],
      7: [5000, 6000],
      8: [5500, 6500]
    };
    const yearsOfExperience = Math.floor(Math.random() * 8) + 1; // 1-8년
    const [minSalary, maxSalary] = salaryRanges[yearsOfExperience];
    // 100단위 step으로 랜덤 선택
    const possibleSalaries = [];
    for (let s = minSalary; s <= maxSalary; s += 100) {
      possibleSalaries.push(s);
    }
    const salary = possibleSalaries[Math.floor(Math.random() * possibleSalaries.length)];
    
    dummyData.push({
      answers,
      salary,
      yearsOfExperience,
      marketerType: marketingDNA,
      result,
      marketingDNA,
      topTags: Object.entries(tagScores).sort(([, a], [, b]) => b.score - a.score).slice(0, 3).map(([tag]) => tag),
      tagScores,
      persona: {
        title: marketingDNA
      },
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 최근 30일 내
    });
  }
  
  return dummyData;
}

// Firestore에 데이터 전송
async function sendDummyDataToFirestore(count = 100) {
  try {
    console.log(`${count}개의 더미 데이터를 생성하고 Firestore에 전송합니다...`);
    
    const dummyData = generateDummyData(count);
    const batch = db.batch();
    
    dummyData.forEach((data, index) => {
      const docRef = db.collection('results').doc();
      batch.set(docRef, data);
      
      if ((index + 1) % 10 === 0) {
        console.log(`${index + 1}개 데이터 처리 완료`);
      }
    });
    
    await batch.commit();
    console.log(`✅ ${count}개의 더미 데이터가 성공적으로 Firestore에 전송되었습니다!`);
    
    // 통계 정보 출력
    const dnaCounts = {};
    dummyData.forEach(data => {
      const dna = data.marketingDNA;
      dnaCounts[dna] = (dnaCounts[dna] || 0) + 1;
    });
    
    console.log('\n📊 생성된 유형별 분포:');
    Object.entries(dnaCounts).forEach(([dna, count]) => {
      console.log(`${dna}: ${count}개 (${((count / dummyData.length) * 100).toFixed(1)}%)`);
    });
    
  } catch (error) {
    console.error('❌ 데이터 전송 중 오류 발생:', error);
  }
}

// 실행
const count = process.argv[2] ? parseInt(process.argv[2]) : 100;
sendDummyDataToFirestore(count); 