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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 text-center">
          <div className="animate-pulse">⏳ 질문을 불러오는 중입니다...</div>
        </div>
      </div>
    );
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-base sm:text-lg font-semibold text-slate-800 flex items-center justify-center gap-2">
            📝 Question {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 text-center break-words">
            {highlightTermsBold(currentQuestion.question, termsInCurrent)}
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="font-bold mr-1">📋 질문유형:</span>
              <span className="text-blue-700">{currentQuestion.category}</span>
            </div>
            <span className="text-slate-400 font-bold px-1">|</span>
            <div className="flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-full px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="font-bold mr-1">⭐ 난이도:</span>
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
                className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 hover:from-blue-50 hover:to-indigo-50 border border-slate-200/50 hover:border-blue-300/50 text-slate-700 font-medium py-3 px-4 sm:py-4 sm:px-6 rounded-xl text-left transition-all duration-300 w-full shadow-sm hover:shadow-md transform hover:scale-[1.02] hover:-translate-y-0.5 backdrop-blur-sm"
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
          <div className="mt-8 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
            <div className="font-bold text-yellow-700 mb-2 flex items-center gap-2">
              💡 이 문제에 등장한 용어 해설
            </div>
            <ul className="text-sm text-slate-700 space-y-2">
              {glossaryInCurrent.map(g => (
                <li key={g.term} className="bg-white/60 rounded-lg p-2 border border-yellow-200/30">
                  <b className="text-blue-700">{g.term}</b>: {g.definition}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioQuiz; 