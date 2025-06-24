'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              심각한 오류가 발생했습니다
            </h2>
            <p className="text-slate-600 mb-6">
              애플리케이션에서 예상치 못한 오류가 발생했습니다.
            </p>
            <button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 