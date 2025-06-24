import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { persona, answers, clientId, marketerType, salaryInfo } = req.body;
  
  try {
    const resultData: any = {
      persona,
      answers,
      clientId: clientId || 'anonymous',
      marketerType,
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

    await addDoc(collection(db, "results"), resultData);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
} 