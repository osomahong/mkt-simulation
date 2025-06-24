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

interface RadarChartProps {
  data: {
    [tag: string]: number;
  };
}

const ScenarioRadarChart = ({ data }: RadarChartProps) => {
  // 최대 점수(문항 수) 계산
  const maxScore = Math.max(...Object.values(data), 1);
  // 퍼센트 변환
  const percentData = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, Math.round((v / maxScore) * 100)])
  );

  const chartData = {
    labels: Object.keys(percentData),
    datasets: [
      {
        label: '나의 마케팅 성향',
        data: Object.values(percentData),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 100, // 퍼센트 기준
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#333',
        },
        ticks: {
          display: false,
          backdropColor: 'transparent',
          stepSize: 20,
        }
      },
    },
    plugins: {
      legend: {
        display: false, // 범례는 숨김
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}%`
          }
        }
      }
    },
    maintainAspectRatio: false, // 컨테이너에 맞게 비율 조정
  };

  return (
    <div className="relative w-full h-80 md:h-96">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default ScenarioRadarChart; 