import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await getDocs(collection(db, "results"));
  const personaCount: Record<string, number> = {};
  const answerCount: Record<string, number> = {};
  const questionChoiceStats: Record<string, Record<string, number>> = {};

  snapshot.forEach(doc => {
    const { persona, answers } = doc.data();
    personaCount[persona?.title] = (personaCount[persona?.title] || 0) + 1;
    
    answers?.forEach((ans: any) => {
      // 태그별 통계
      ans.tags?.forEach((tag: string) => {
        answerCount[tag] = (answerCount[tag] || 0) + 1;
      });
      
      // 문항별 선택지 통계
      if (ans.questionId && ans.tags) {
        if (!questionChoiceStats[ans.questionId]) {
          questionChoiceStats[ans.questionId] = {};
        }
        
        // 선택한 태그들을 키로 사용 (선택지 식별)
        const choiceKey = ans.tags.sort().join(',');
        questionChoiceStats[ans.questionId][choiceKey] = 
          (questionChoiceStats[ans.questionId][choiceKey] || 0) + 1;
      }
    });
  });

  res.status(200).json({ 
    personaCount, 
    answerCount, 
    questionChoiceStats,
    total: snapshot.size 
  });
} 