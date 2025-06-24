import { useScenarioQuery } from "./scenario.api";
import useScenarioStore from "@/stores/scenarioStore";

export function useScenario(id: string) {
  const { data, error, isLoading } = useScenarioQuery(id);

  return {
    scenario: data,
    error,
    isLoading,
  };
} 