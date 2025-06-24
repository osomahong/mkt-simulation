import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '마케터 유형 분석 결과';
  const description = searchParams.get('desc') || '나의 마케터 성향과 강점을 확인해보세요!';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#f8fafc',
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, color: '#2563eb', marginBottom: 24 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: '#334155', marginBottom: 32 }}>
          {description}
        </div>
        {/* 차트 등 추가 가능 */}
        <div style={{ fontSize: 18, color: '#64748b' }}>
          marketer-simulator.com
        </div>
      </div>
    ),
    {
      width: 600,
      height: 315,
    }
  );
} 