"use client";
import ScenarioResult from './ScenarioResult';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ScenarioResultPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ScenarioResultPage({ searchParams }: ScenarioResultPageProps) {
  const router = useRouter();
  let rid: string | null = null;
  if (searchParams && searchParams.rid) {
    rid = Array.isArray(searchParams.rid) ? searchParams.rid[0] : searchParams.rid;
  }
  const { answers } = useScenarioStore();
  const [sharedResult, setSharedResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const code = searchParams && typeof searchParams.code === 'string' ? searchParams.code : null;

  useEffect(() => {
    if (rid) {
      setLoading(true);
      getDoc(doc(db, 'results', rid)).then((snap) => {
        if (snap.exists()) {
          setSharedResult(snap.data());
        } else {
          setSharedResult(null);
        }
        setLoading(false);
      });
    } else if (!code && (!answers || answers.length === 0)) {
      router.replace('/scenarios');
    }
  }, [rid, code, answers, router]);

  useEffect(() => {
    // 페이지 진입 시 view_result 이벤트 트리거
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_result',
        rid: rid || null
      });
    }
  }, [rid]);

  if (rid && loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 text-center">
        <div className="animate-pulse">⏳ 결과를 불러오는 중입니다...</div>
      </div>
    </div>
  );
  if (rid && !loading && !sharedResult) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 text-center">
        <div className="text-red-600">⚠️ 공유된 결과를 찾을 수 없습니다.</div>
      </div>
    </div>
  );
  if (rid && sharedResult) return <ScenarioResult sharedResult={sharedResult} />;
  if (!code && (!answers || answers.length === 0)) return null;
  return <ScenarioResult />;
} 