"use client";
import ScenarioResult from './ScenarioResult';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';

export default function ScenarioResultPage() {
  const router = useRouter();
  const { answers } = useScenarioStore();

  useEffect(() => {
    if (!answers || answers.length === 0) {
      router.replace('/scenarios');
    }
  }, [answers, router]);

  if (!answers || answers.length === 0) return null;
  return <ScenarioResult />;
} 