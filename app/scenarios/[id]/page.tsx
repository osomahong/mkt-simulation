'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchScenarioDetail } from '@/features/scenario/scenario.api';
import { Scenario } from '@/features/scenario/scenario.types';

export default function ScenarioDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchScenarioDetail(id)
      .then((data) => setScenario(data))
      .catch(() => setError('시나리오 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 text-center">
        <div className="animate-pulse">⏳ 로딩 중...</div>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 text-center">
        <div className="text-red-600">⚠️ {error}</div>
      </div>
    </div>
  );
  if (!scenario) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <main className="max-w-xl mx-auto py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent flex items-center gap-2">
            📋 {scenario.title}
          </h1>
          <p className="mb-4 text-slate-600 leading-relaxed">{scenario.description}</p>
          <div className="mb-6 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full shadow-sm">{scenario.difficulty}</span>
            {scenario.tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-700 shadow-sm">#{tag}</span>
            ))}
          </div>
          <ul className="mb-6">
            {scenario.steps.map((s, idx) => (
              <li key={s.id} className="mb-4 border-b border-slate-200/50 pb-3">
                <div className="font-semibold mb-1 text-slate-700">{idx + 1}. {s.question}</div>
                <ul className="ml-4 list-disc">
                  {s.options.map((opt) => (
                    <li key={opt.id} className="text-blue-700">{opt.text}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2"
            onClick={() => router.push('/scenarios')}
          >
            🔙 목록으로
          </button>
        </div>
      </main>
    </div>
  );
} 