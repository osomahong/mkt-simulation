"use client";
import SalaryInput from '@/features/scenario/SalaryInput';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';

const SalaryPage = () => {
  const router = useRouter();
  const { marketerType, salaryInfo, salaryInputSkipped } = useScenarioStore();

  useEffect(() => {
    if (!marketerType) {
      router.replace('/scenarios');
    } else if (salaryInfo.salary || salaryInfo.yearsOfExperience || salaryInputSkipped) {
      router.replace('/scenarios/quiz');
    }
  }, [marketerType, salaryInfo, salaryInputSkipped, router]);

  if (!marketerType) return null;
  if (salaryInfo.salary || salaryInfo.yearsOfExperience || salaryInputSkipped) return null;
  return <SalaryInput />;
};

export default SalaryPage; 