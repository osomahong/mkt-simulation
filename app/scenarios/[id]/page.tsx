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

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!scenario) return null;

  return (
    <main className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{scenario.title}</h1>
      <p className="mb-2 text-gray-600">{scenario.description}</p>
      <div className="mb-4 flex gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-200 rounded">{scenario.difficulty}</span>
        {scenario.tags?.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-blue-100 rounded text-blue-700">#{tag}</span>
        ))}
      </div>
      <ul className="mb-6">
        {scenario.steps.map((s, idx) => (
          <li key={s.id} className="mb-4 border-b pb-3">
            <div className="font-semibold mb-1">{idx + 1}. {s.question}</div>
            <ul className="ml-4 list-disc">
              {s.options.map((opt) => (
                <li key={opt.id} className="text-blue-700">{opt.text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button
        className="bg-gray-200 px-4 py-2 rounded"
        onClick={() => router.push('/scenarios')}
      >목록으로</button>
    </main>
  );
} 