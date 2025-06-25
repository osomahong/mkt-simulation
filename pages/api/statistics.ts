import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await getDocs(collection(db, "results"));
  const personaCount: Record<string, number> = {};
  const answerCount: Record<string, number> = {}; // 총 선택 횟수
  const userTagCount: Record<string, Set<string>> = {}; // 태그별 고유 사용자 Set
  const questionChoiceStats: Record<string, Record<string, number>> = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const { answers, clientId } = data;
    const userId = clientId || doc.id; // clientId가 없으면 문서 ID 사용

    // 유형명 집계: result.marketingDNA 또는 marketingDNA
    const type = data.result?.marketingDNA || data.marketingDNA || 'undefined';
    personaCount[type] = (personaCount[type] || 0) + 1;
    
    answers?.forEach((ans: any) => {
      // 태그별 총 선택 횟수 (기존 로직 유지)
      ans.tags?.forEach((tag: string) => {
        answerCount[tag] = (answerCount[tag] || 0) + 1;
        
        // 태그별 고유 사용자 추가
        if (!userTagCount[tag]) {
          userTagCount[tag] = new Set();
        }
        userTagCount[tag].add(userId);
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

  // 태그별 고유 사용자 수로 변환
  const uniqueUserTagCount: Record<string, number> = {};
  Object.entries(userTagCount).forEach(([tag, userSet]) => {
    uniqueUserTagCount[tag] = userSet.size;
  });

  res.status(200).json({ 
    personaCount, 
    answerCount, // 총 선택 횟수 (기존 호환성)
    uniqueUserTagCount, // 고유 사용자 수 (새로 추가)
    questionChoiceStats,
    total: snapshot.size 
  });
} 