"use client";
import ScenarioQuiz from './ScenarioQuiz';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';

export default function ScenarioQuizPage() {
  const router = useRouter();
  const { marketerType, salaryInfo, salaryInputSkipped } = useScenarioStore();

  useEffect(() => {
    if (!marketerType) {
      router.replace('/scenarios');
    } else if (!salaryInputSkipped && (!salaryInfo.salary || !salaryInfo.yearsOfExperience)) {
      router.replace('/scenarios/salary');
    }
  }, [marketerType, salaryInfo, salaryInputSkipped, router]);

  if (!marketerType) return null;
  if (!salaryInputSkipped && (!salaryInfo.salary || !salaryInfo.yearsOfExperience)) return null;
  return <ScenarioQuiz />;
} 