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
  salaryInfo: {
    yearsOfExperience: number | null;
    salary: number | null;
  };
  salaryInputSkipped: boolean;
  setMarketerType: (type: string) => void;
  setSalaryInfo: (yearsOfExperience: number | null, salary: number | null) => void;
  setSalaryInputSkipped: (skipped: boolean) => void;
  answerQuestion: (questionId: string, tags: string[], difficulty: '쉬움' | '보통' | '어려움') => void;
  reset: () => void;
}

const useScenarioStore = create<ScenarioState>((set, get) => ({
  marketerType: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  salaryInfo: {
    yearsOfExperience: null,
    salary: null,
  },
  salaryInputSkipped: false,

  setMarketerType: (type: string) => {
    const allQuestions = questionsData as Question[];
    const questions: Question[] = [];
    const primaryQuestions = allQuestions.filter(q => q.marketerType.includes(type));
    questions.push(...primaryQuestions);
    if (questions.length < 10) {
      const remainingQuestions = allQuestions.filter(q => !q.marketerType.includes(type));
      const shuffledRemaining = remainingQuestions.sort(() => 0.5 - Math.random());
      const needed = 10 - questions.length;
      questions.push(...shuffledRemaining.slice(0, needed));
    }
    const finalQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    set({
      marketerType: type,
      questions: finalQuestions,
      currentQuestionIndex: 0,
      answers: [],
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
    set(state => ({
      answers: [...state.answers, { questionId, tags, difficulty }],
      currentQuestionIndex: state.currentQuestionIndex + 1,
    }));
  },

  reset: () => {
    set({
      marketerType: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      salaryInfo: {
        yearsOfExperience: null,
        salary: null,
      },
      salaryInputSkipped: false,
    });
  },
}));

export default useScenarioStore; 