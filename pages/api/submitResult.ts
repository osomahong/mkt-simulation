import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { generateShortId } from "@/lib/utils";
import { PersonalizedResult } from "@/features/scenario/scenario.analysis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { result, answers, clientId, marketerType, salaryInfo } = req.body;
  
  try {
    const resultData: any = {
      result: result as PersonalizedResult,
      answers,
      clientId: clientId || 'anonymous',
      marketerType: marketerType || 'unknown',
      createdAt: new Date(),
    };

    // 연봉 정보가 있으면 추가
    if (salaryInfo) {
      resultData.yearsOfExperience = salaryInfo.yearsOfExperience;
      resultData.salary = salaryInfo.salary;
      resultData.hasSalary = true;
    } else {
      resultData.hasSalary = false;
    }

    // 새로운 통계 데이터 저장을 위한 요약 정보 추가
    const typedResult = result as PersonalizedResult;
    resultData.marketingDNA = typedResult.marketingDNA;
    resultData.totalScore = typedResult.totalScore;
    resultData.topTags = Object.entries(typedResult.tagScores)
      .sort(([,a], [,b]) => (b as any).score - (a as any).score)
      .slice(0, 3)
      .map(([tagName, tagScore]) => ({ 
        tagName, 
        score: (tagScore as any).score, 
        level: (tagScore as any).level 
      }));

    // 짧은 ID 생성 및 중복 방지
    let shortId = generateShortId(8);
    let exists = true;
    let tryCount = 0;
    while (exists && tryCount < 5) {
      const ref = doc(db, "results", shortId);
      const snap = await getDoc(ref);
      exists = snap.exists();
      if (exists) shortId = generateShortId(8);
      tryCount++;
    }
    
    // Firestore에 직접 문서ID로 저장
    await setDoc(doc(db, "results", shortId), resultData);
    res.status(200).json({ ok: true, resultId: shortId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
} 