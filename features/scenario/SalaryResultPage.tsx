"use client";
import SalaryResult from './SalaryResult';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';

export default function SalaryResultPage() {
  const router = useRouter();
  const { answers, salaryInfo } = useScenarioStore();

  useEffect(() => {
    if (!answers || answers.length === 0 || !salaryInfo || !salaryInfo.salary) {
      router.replace('/scenarios');
    }
  }, [answers, salaryInfo, router]);

  if (!answers || answers.length === 0 || !salaryInfo || !salaryInfo.salary) return null;
  return <SalaryResult />;
} 