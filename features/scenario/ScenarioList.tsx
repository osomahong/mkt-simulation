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
          className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-4 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
          onClick={() => onSelect(scenario.id)}
        >
                      <h3 className="font-bold text-lg text-slate-800">{scenario.title}</h3>
          <p className="text-sm text-slate-600 mb-2 leading-relaxed">{scenario.description}</p>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full shadow-sm">{scenario.difficulty}</span>
            {scenario.tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-700 shadow-sm">#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 