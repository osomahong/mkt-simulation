'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface TagScore {
  score: number;
  level: 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BASIC' | 'MINIMAL';
  rank: number;
  percentage: number;
}

interface RadarChartProps {
  tagScores: { [tagName: string]: TagScore };
}

const ScenarioRadarChart = ({ tagScores }: RadarChartProps) => {
  // 태그명을 축약형으로 변환
  const getShortLabel = (tagName: string) => {
    const shortLabels: { [key: string]: string } = {
      '데이터 기반': '데이터',
      '고객 경험 중시': '고객경험',
      '혁신/실험 선호': '혁신',
      '트렌드 중시': '트렌드',
      '단기 성과 집착': '성과',
      '리스크 회피': '안정성',
      '감성': '감성',
      '콘텐츠 마케팅': '콘텐츠',
      '비용 효율 중시': '효율성',
      '장기 전략': '전략',
      '브랜드 가치 중시': '브랜드'
    };
    return shortLabels[tagName] || tagName;
  };

  // 점수순으로 정렬하여 레이더 차트 데이터 구성
  const sortedEntries = Object.entries(tagScores)
    .sort(([,a], [,b]) => b.score - a.score);

  const labels = sortedEntries.map(([tagName]) => getShortLabel(tagName));
  const scores = sortedEntries.map(([, tagScore]) => tagScore.score);
  
  // 점수 차이를 극대화하기 위한 스케일 조정
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const scoreRange = maxScore - minScore;
  
  // 차이가 클 때는 전체 범위 표시, 차이가 작을 때는 확대
  const dynamicMax = scoreRange > 30 ? 100 : Math.min(maxScore * 1.3, 100);

  // 점수별 극단적 색상 계산
  const getGradientColors = (scores: number[]) => {
    const sortedScores = [...scores].sort((a, b) => b - a);
    
    return scores.map(score => {
      const rank = sortedScores.indexOf(score) + 1;
      
      // 순위별 극단적 색상 분배
      if (rank === 1) return 'rgba(255, 215, 0, 1)'; // 골드 - 1위
      if (rank === 2) return 'rgba(236, 72, 153, 0.9)'; // 핑크 - 2위
      if (rank === 3) return 'rgba(168, 85, 247, 0.8)'; // 퍼플 - 3위
      if (rank <= 6) return 'rgba(59, 130, 246, 0.7)'; // 블루 - 중위
      if (rank <= 9) return 'rgba(156, 163, 175, 0.6)'; // 그레이 - 하위
      return 'rgba(156, 163, 175, 0.3)'; // 연한 그레이 - 최하위
    });
  };

  const borderColors = getGradientColors(scores);
  const backgroundColors = borderColors.map(color => color.replace('0.8', '0.2'));

  const chartData = {
    labels,
    datasets: [
      {
        label: '마케팅 역량 점수',
        data: scores,
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: 'rgba(236, 72, 153, 0.9)',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        tension: 0,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: dynamicMax,
        angleLines: {
          display: true,
          color: 'rgba(156, 163, 175, 0.3)',
          lineWidth: 1,
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          lineWidth: 1,
        },
        pointLabels: {
          font: {
            size: 13,
            weight: 'bold' as const,
            family: 'system-ui'
          },
          color: (context: any) => {
            const score = scores[context.index];
            const maxScore = Math.max(...scores);
            
            if (score === maxScore) return '#ec4899'; // 최고점은 핑크
            if (score >= maxScore * 0.8) return '#a855f7'; // 상위권은 퍼플
            if (score >= maxScore * 0.6) return '#3b82f6'; // 중위권은 블루
            return '#6b7280'; // 나머지는 그레이
          },
          padding: 25,
        },
        ticks: {
          display: false, // 점수 범례 완전 제거
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: 'rgba(236, 72, 153, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const tagName = Object.keys(tagScores)[context.dataIndex];
            const tagScore = Object.values(tagScores)[context.dataIndex];
            const maxScore = Math.max(...scores);
            const isTop = context.raw === maxScore;
            
            return [
              `🎯 점수: ${context.raw.toFixed(1)}점 ${isTop ? '⭐ 최고!' : ''}`,
              `📊 레벨: ${tagScore.level}`,
              `🏆 순위: ${tagScore.rank}위`,
              `📈 상위 ${(100 - tagScore.percentage).toFixed(1)}%`
            ];
          },
          title: function(context: any) {
            const fullTagName = sortedEntries[context[0].dataIndex][0];
            return `💎 ${fullTagName}`;
          },
          afterBody: function(context: any) {
            const score = context[0].raw;
            const maxScore = Math.max(...scores);
            const percentage = ((score / maxScore) * 100).toFixed(0);
            
            return `최고점 대비 ${percentage}% 수준`;
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.1,
      }
    }
  };

  return (
    <div className="relative w-full h-80">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default ScenarioRadarChart; 