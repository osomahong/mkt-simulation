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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 text-center hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2">
              🚨 심각한 오류가 발생했습니다
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              애플리케이션에서 예상치 못한 오류가 발생했습니다.
            </p>
            <button
              onClick={reset}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
            >
              🔄 다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 