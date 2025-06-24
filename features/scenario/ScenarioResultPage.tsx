"use client";
import ScenarioResult from './ScenarioResult';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ScenarioResultPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
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
    } else if (!answers || answers.length === 0) {
      router.replace('/scenarios');
    }
  }, [rid, answers, router]);

  useEffect(() => {
    // 페이지 진입 시 view_result 이벤트 트리거
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_result',
        rid: rid || null
      });
    }
  }, [rid]);

  if (rid && loading) return <div className="p-8 text-center">결과를 불러오는 중입니다...</div>;
  if (rid && !loading && !sharedResult) return <div className="p-8 text-center text-red-500">공유된 결과를 찾을 수 없습니다.</div>;
  if (rid && sharedResult) return <ScenarioResult sharedResult={sharedResult} />;
  if (!answers || answers.length === 0) return null;
  return <ScenarioResult />;
} 