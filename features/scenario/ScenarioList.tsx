import React from 'react';
import { ScenarioSummary } from './scenario.types';

interface ScenarioListProps {
  scenarios: ScenarioSummary[];
  onSelect: (id: string) => void;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, onSelect }) => {
  return (
    <div className="grid gap-4">
      {scenarios.map((scenario) => (
        <div
          key={scenario.id}
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(scenario.id)}
        >
          <h3 className="font-bold text-lg">{scenario.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-gray-200 rounded">{scenario.difficulty}</span>
            {scenario.tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-blue-100 rounded text-blue-700">#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 