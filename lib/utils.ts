// lib/utils.ts

// clientId 생성 및 관리
export const getClientId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let clientId = localStorage.getItem('marketer-test-client-id');
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('marketer-test-client-id', clientId);
  }
  return clientId;
};

// 퍼센트 계산 유틸리티
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// 숫자 포맷팅
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

// 짧은 랜덤 ID 생성 (6~8자리)
export function generateShortId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 4진수 idx 배열을 알파벳으로 매핑 (0:A, 1:N, 2:p, 3:y)
const IDX_MAP = ['A', 'N', 'p', 'y'];
const IDX_REVERSE_MAP: Record<string, number> = { A: 0, N: 1, p: 2, y: 3 };

export function encodeIdx(idxArr: number[]): string {
  return idxArr.map(n => IDX_MAP[n] ?? 'A').join('');
}

export function decodeIdx(code: string): number[] | null {
  const arr: number[] = [];
  for (let i = 0; i < code.length; i++) {
    const n = IDX_REVERSE_MAP[code[i]];
    if (n === undefined) return null; // 잘못된 문자 방어
    arr.push(n);
  }
  return arr;
}

// idx 배열과 question id 배열을 동시에 encode/decode
// 예시: encodeShareCode([1,2,3], ['Q1','Q2','Q3']) => 'NpA:Q1,Q2,Q3'
export function encodeShareCode(idxArr: number[], idArr: string[]): string {
  const code = encodeIdx(idxArr);
  const q = idArr.join(',');
  return `${code}:${q}`;
}

export function decodeShareCode(shareCode: string): { idxArr: number[], idArr: string[] } | null {
  const [code, q] = shareCode.split(':');
  if (!code || !q) return null;
  const idxArr = decodeIdx(code);
  const idArr = q.split(',');
  if (!idxArr || !idArr.length) return null;
  return { idxArr, idArr };
} 