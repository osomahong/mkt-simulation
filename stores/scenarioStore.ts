import { create } from 'zustand';
import questionsData from '@/features/scenario/scenario.questions.json';
import { Question } from '@/features/scenario/scenario.types';

type Answer = {
  questionId: string;
  tags: string[];
  difficulty: '쉬움' | '보통' | '어려움';
};

interface ScenarioState {
  marketerType: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  allQuestions: Question[]; // 전체 질문 풀
  answeredQuestionIds: Set<string>; // 답변한 질문 ID들
  salaryInfo: {
    yearsOfExperience: number | null;
    salary: number | null;
  };
  salaryInputSkipped: boolean;
  setMarketerType: (type: string) => void;
  setSalaryInfo: (yearsOfExperience: number | null, salary: number | null) => void;
  setSalaryInputSkipped: (skipped: boolean) => void;
  answerQuestion: (questionId: string, tags: string[], difficulty: '쉬움' | '보통' | '어려움') => void;
  getNextQuestion: () => Question | null;
  reset: () => void;
}

const useScenarioStore = create<ScenarioState>((set, get) => ({
  marketerType: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  allQuestions: [],
  answeredQuestionIds: new Set(),
  salaryInfo: {
    yearsOfExperience: null,
    salary: null,
  },
  salaryInputSkipped: false,

  setMarketerType: (type: string) => {
    const allQuestions = questionsData as Question[];
    
    // 해당 마케터 타입의 질문들을 필터링
    const typeQuestions = allQuestions.filter(q => q.marketerType.includes(type));
    
    // 첫 번째 질문을 랜덤 선택
    const firstQuestion = typeQuestions[Math.floor(Math.random() * typeQuestions.length)];
    
    set({
      marketerType: type,
      questions: [firstQuestion], // 첫 번째 질문만 설정
      currentQuestionIndex: 0,
      answers: [],
      allQuestions: allQuestions, // 전체 질문 풀 저장
      answeredQuestionIds: new Set([firstQuestion.id]), // 첫 번째 질문 ID를 답변된 것으로 표시
      salaryInfo: {
        yearsOfExperience: null,
        salary: null,
      },
      salaryInputSkipped: false,
    });
  },

  setSalaryInfo: (yearsOfExperience: number | null, salary: number | null) => {
    set({
      salaryInfo: { yearsOfExperience, salary },
    });
  },

  setSalaryInputSkipped: (skipped: boolean) => {
    set({ salaryInputSkipped: skipped });
  },

  answerQuestion: (questionId: string, tags: string[], difficulty) => {
    const state = get();
    
    // 답변 추가
    const newAnswers = [...state.answers, { questionId, tags, difficulty }];
    
    // 다음 질문 선택
    const nextQuestion = get().getNextQuestion();
    
    if (nextQuestion) {
      // 다음 질문이 있으면 추가
      const newQuestions = [...state.questions, nextQuestion];
      const newAnsweredIds = new Set(state.answeredQuestionIds);
      newAnsweredIds.add(nextQuestion.id);
      
      set({
        answers: newAnswers,
        questions: newQuestions,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answeredQuestionIds: newAnsweredIds,
      });
    } else {
      // 다음 질문이 없으면 (10개 완료) 답변만 추가
      set({
        answers: newAnswers,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      });
    }
  },

  getNextQuestion: () => {
    const state = get();
    
    // 10개 질문 완료 시 null 반환
    if (state.answers.length >= 9) { // 0부터 시작하므로 9개 답변 = 10개 질문
      return null;
    }
    
    // 사용자가 선택한 모든 태그 수집
    const allSelectedTags = state.answers.flatMap(answer => answer.tags);
    
    // 해당 태그가 포함된 질문들 찾기 (답변하지 않은 것만)
    const candidateQuestions = state.allQuestions.filter(q => 
      !state.answeredQuestionIds.has(q.id) && // 답변하지 않은 질문
      q.choices.some(choice => 
        choice.tags.some(tag => allSelectedTags.includes(tag)) // 선택된 태그가 포함된 선택지가 있는 질문
      )
    );
    
    // 후보 질문이 없으면 모든 질문에서 선택 (답변하지 않은 것만)
    let availableQuestions = candidateQuestions.length > 0 
      ? candidateQuestions 
      : state.allQuestions.filter(q => !state.answeredQuestionIds.has(q.id));
    
    // 마케터 타입 우선순위 적용
    if (state.marketerType) {
      const typeQuestions = availableQuestions.filter(q => 
        q.marketerType.includes(state.marketerType!)
      );
      if (typeQuestions.length > 0) {
        availableQuestions = typeQuestions;
      }
    }
    
    // 랜덤 선택
    if (availableQuestions.length > 0) {
      return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }
    
    return null;
  },

  reset: () => {
    set({
      marketerType: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      allQuestions: [],
      answeredQuestionIds: new Set(),
      salaryInfo: {
        yearsOfExperience: null,
        salary: null,
      },
      salaryInputSkipped: false,
    });
  },
}));

export default useScenarioStore; 