import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { generateShortId } from "@/lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { persona, answers, clientId, marketerType, salaryInfo } = req.body;
  
  try {
    const resultData: any = {
      persona,
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