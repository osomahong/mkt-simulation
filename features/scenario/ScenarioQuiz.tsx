import React from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import glossary from './glossary.json';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const metadata = {
  title: "마케터 역량 진단 - 질문",
  description: "상황별 질문에 답하고 나만의 마케터 유형을 확인하세요.",
  openGraph: {
    title: "마케터 역량 진단 - 질문",
    description: "상황별 질문에 답하고 나만의 마케터 유형을 확인하세요.",
    type: "website",
    url: "https://도메인/quiz",
  },
  alternates: {
    canonical: "https://도메인/quiz",
  },
};

// 용어가 포함된 텍스트를 자동으로 진하게 감싸주는 함수
function highlightTermsBold(text: string, terms: string[]) {
  if (!text) return text;
  let result: React.ReactNode[] = [text];
  terms.forEach(term => {
    result = result.flatMap(chunk => {
      if (typeof chunk !== 'string') return [chunk];
      const parts = chunk.split(term);
      if (parts.length === 1) return [chunk];
      const nodes: React.ReactNode[] = [];
      parts.forEach((part, i) => {
        nodes.push(part);
        if (i < parts.length - 1) nodes.push(<b key={i+term} className="text-blue-700">{term}</b>);
      });
      return nodes;
    });
  });
  return result;
}

// 현재 문제/선택지에 등장하는 용어만 추출
function extractTermsFromCurrent(questions: any, currentQuestion: any) {
  const texts = [currentQuestion.question, ...currentQuestion.choices.map((c: any) => c.text)];
  const terms = glossary.map(g => g.term).filter(term =>
    texts.some(t => t.includes(term))
  );
  return terms;
}

const ScenarioQuiz = () => {
  const { questions, currentQuestionIndex, answerQuestion } = useScenarioStore(
    state => ({
      questions: state.questions,
      currentQuestionIndex: state.currentQuestionIndex,
      answerQuestion: state.answerQuestion,
    }),
  );
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>질문을 불러오는 중입니다...</div>;
  }

  const termsInCurrent = extractTermsFromCurrent(questions, currentQuestion);
  const glossaryInCurrent = glossary.filter(g => termsInCurrent.includes(g.term));

  // 답변 선택 핸들러
  const handleAnswer = (choice: { text: string; tags: string[] }, index: number) => {
    // GTM 이벤트 트리거
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: `quiz_answer_${currentQuestionIndex + 1}`,
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
        answer: index + 1, // 버튼 순서대로 1,2,3,4
      });
    }
    answerQuestion(
      currentQuestion.id,
      choice.tags,
      currentQuestion.difficulty,
    );
    // 마지막 문제라면 결과페이지로 이동
    if (currentQuestionIndex === questions.length - 1) {
      router.push('/scenarios/result');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-base sm:text-lg font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-slate-800 break-words">
            {highlightTermsBold(currentQuestion.question, termsInCurrent)}
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="font-bold mr-1">질문유형:</span>
              <span className="text-blue-700">{currentQuestion.category}</span>
            </div>
            <span className="text-slate-400 font-bold px-1">|</span>
            <div className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="font-bold mr-1">난이도:</span>
              <span className={
                currentQuestion.difficulty === '어려움'
                  ? 'text-red-600'
                  : currentQuestion.difficulty === '보통'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(choice, index)}
                className="bg-slate-50 hover:bg-blue-100 border border-slate-200 text-slate-700 font-medium py-3 px-4 sm:py-4 sm:px-6 rounded-lg text-left transition-colors duration-200 w-full"
              >
                <span className="text-sm sm:text-base break-words">
                  {highlightTermsBold(choice.text, termsInCurrent)}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* 등장 용어 해설 */}
        {glossaryInCurrent.length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="font-bold text-yellow-700 mb-2">이 문제에 등장한 용어 해설</div>
            <ul className="text-sm text-slate-700 space-y-1">
              {glossaryInCurrent.map(g => (
                <li key={g.term}><b className="text-blue-700">{g.term}</b>: {g.definition}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioQuiz; 