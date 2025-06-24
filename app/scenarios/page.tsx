"use client";
import ScenarioTypeSelector from '@/features/scenario/ScenarioTypeSelector';
import React, { useEffect } from 'react';
import useScenarioStore from '@/stores/scenarioStore';

const ScenariosRoutePage = () => {
  const reset = useScenarioStore(state => state.reset);
  useEffect(() => {
    reset();
  }, [reset]);
  return <ScenarioTypeSelector />;
};

export default ScenariosRoutePage; 