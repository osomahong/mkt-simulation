'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          문제가 발생했습니다
        </h2>
        <p className="text-slate-600 mb-6">
          예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
} 