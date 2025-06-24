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