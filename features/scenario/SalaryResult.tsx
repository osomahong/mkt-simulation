import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useScenarioStore from '@/stores/scenarioStore';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface SalaryStats {
  averageSalary: number;
  totalCount: number;
  myRank: number;
  percentile: number;
}

interface PerQuestionSalary {
  questionId: string;
  question: string;
  myChoice: string;
  averageSalary: number | null;
  count: number;
}

const SalaryResult = () => {
  const { marketerType, answers, salaryInfo, reset, questions } = useScenarioStore();
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perQuestionSalaries, setPerQuestionSalaries] = useState<PerQuestionSalary[]>([]);
  const router = useRouter();

  // 연차 구간 계산 함수 추가
  const getExperienceGroup = (years: number | null): string => {
    if (years === null || years === undefined) return 'unknown';
    if (years <= 2) return 'junior'; // 0-2년
    if (years <= 5) return 'mid'; // 3-5년
    if (years <= 10) return 'senior'; // 6-10년
    return 'lead'; // 11년+
  };

  // 답변 텍스트 가져오기 함수
  const getChoiceText = (questionId: string, tags: string[]): string => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return tags.join(', ');
    
    const choice = question.choices.find(c => 
      c.tags.length === tags.length && 
      c.tags.every(tag => tags.includes(tag))
    );
    
    return choice ? choice.text : tags.join(', ');
  };

  useEffect(() => {
    if (!salaryInfo?.salary) {
      setLoading(false);
      return;
    }

    const fetchSalaryStats = async () => {
      try {
        const db = getFirestore(app);
        const resultsRef = collection(db, 'results');
        
        // 연봉을 입력한 사람들만 필터링
        const q = query(
          resultsRef,
          where('hasSalary', '==', true)
        );

        const querySnapshot = await getDocs(q);
        const salaries: number[] = [];
        const myYears = salaryInfo.yearsOfExperience;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // 내 연차와 정확히 같은 사용자만 포함
          if (data.salary && data.yearsOfExperience === myYears) {
            salaries.push(data.salary);
          }
        });

        // 상위/하위 5% 제외한 평균 계산
        const sortedSalaries = salaries.sort((a, b) => a - b);
        const totalCount = sortedSalaries.length;
        const excludeCount = Math.ceil(totalCount * 0.05); // 5%
        const filteredSalaries = sortedSalaries.slice(excludeCount, totalCount - excludeCount);
        
        // 필터링 후 배열이 비어있으면 에러 처리
        // if (filteredSalaries.length === 0) {
        //   setError('충분한 데이터가 없어 통계를 계산할 수 없습니다.');
        //   setLoading(false);
        //   return;
        // }
        
        const averageSalary = filteredSalaries.reduce((sum, salary) => sum + salary, 0) / filteredSalaries.length;
        
        // 내 순위 계산
        const mySalary = salaryInfo.salary!;
        const myRank = sortedSalaries.filter(salary => salary > mySalary).length + 1;
        const percentile = ((totalCount - myRank + 1) / totalCount) * 100;

        setStats({
          averageSalary: Math.round(averageSalary),
          totalCount,
          myRank,
          percentile: Math.round(percentile * 10) / 10,
        });

      } catch (err) {
        console.error('Error fetching salary stats:', err);
        setError('통계를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryStats();
  }, [marketerType, answers, salaryInfo]);

  // 문항별 같은 선택의 평균 연봉 계산
  useEffect(() => {
    if (!salaryInfo?.salary || !answers || answers.length === 0) return;
    const fetchPerQuestionSalaries = async () => {
      try {
        const db = getFirestore(app);
        const resultsRef = collection(db, 'results');
        const q = query(
          resultsRef,
          where('hasSalary', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const myExperienceGroup = getExperienceGroup(salaryInfo.yearsOfExperience);
        const perQuestion: PerQuestionSalary[] = await Promise.all(
          answers.map(async (answer, idx) => {
            const salaries: number[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.salary && data.yearsOfExperience && data.answers && Array.isArray(data.answers)) {
                // 연차 구간이 같은 사용자만 포함
                const otherExperienceGroup = getExperienceGroup(data.yearsOfExperience);
                if (otherExperienceGroup === myExperienceGroup) {
                  const otherAnswer = data.answers[idx];
                  if (otherAnswer && otherAnswer.tags.join(',') === answer.tags.join(',')) {
                    salaries.push(data.salary);
                  }
                }
              }
            });
            if (salaries.length === 0) {
              return {
                questionId: answer.questionId,
                question: questions.find(q => q.id === answer.questionId)?.question || '',
                myChoice: getChoiceText(answer.questionId, answer.tags),
                averageSalary: null,
                count: 0,
              };
            }
            const sorted = salaries.sort((a, b) => a - b);
            const total = sorted.length;
            const exclude = Math.ceil(total * 0.05);
            const filtered = sorted.slice(exclude, total - exclude);
            
            // 필터링 후 배열이 비어있으면 null 반환
            // if (filtered.length === 0) {
            //   return {
            //     questionId: answer.questionId,
            //     question: questions.find(q => q.id === answer.questionId)?.question || '',
            //     myChoice: getChoiceText(answer.questionId, answer.tags),
            //     averageSalary: null,
            //     count: total,
            //   };
            // }
            
            const avg = filtered.reduce((sum, s) => sum + s, 0) / filtered.length;
            return {
              questionId: answer.questionId,
              question: questions.find(q => q.id === answer.questionId)?.question || '',
              myChoice: getChoiceText(answer.questionId, answer.tags),
              averageSalary: Math.round(avg),
              count: total,
            };
          })
        );
        setPerQuestionSalaries(perQuestion);
      } catch (e) {
        // 무시 (에러시 빈 배열)
        setPerQuestionSalaries([]);
      }
    };
    fetchPerQuestionSalaries();
  }, [marketerType, answers, salaryInfo]);

  const getMarketerTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      b2c: 'B2C 전문 마케터',
      b2b: 'B2B 전략 마케터',
      ecommerce: 'E-Commerce 성장 마케터',
    };
    return types[type] || type;
  };

  const getExperienceGroupName = (years: number | null): string => {
    if (years === null || years === undefined) return '미입력';
    if (years <= 2) return '신입/주니어 (0-2년)';
    if (years <= 5) return '미드레벨 (3-5년)';
    if (years <= 10) return '시니어 (6-10년)';
    return '리드/이상 (11년+)';
  };

  const getPercentileText = (percentile: number) => {
    if (percentile >= 90) return '최상위권';
    if (percentile >= 75) return '상위권';
    if (percentile >= 50) return '중상위권';
    if (percentile >= 25) return '중위권';
    return '중하위권';
  };

  const handleReset = () => {
    reset();
    router.push('/scenarios');
  };

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      try {
        // 카카오 SDK 초기화 확인
        if (!(window as any).Kakao.isInitialized()) {
          console.log('카카오 SDK 초기화 중...');
          // 임시로 초기화 시도 (실제 앱 키가 필요함)
          (window as any).Kakao.init('f265d81144e358dad13c422075f42c62');
        }
        
        (window as any).Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `💰 ${getMarketerTypeName(marketerType || '')} 연봉 통계 결과`,
            description: `${getExperienceGroupName(salaryInfo?.yearsOfExperience)} | ${stats?.percentile}% (${getPercentileText(stats?.percentile || 0)})`,
            imageUrl: `${window.location.origin}/og-images/result.png`,
            link: {
              mobileWebUrl: window.location.origin,
              webUrl: window.location.origin,
            },
          },
        });
      } catch (error) {
        console.error('카카오 공유 오류:', error);
        // 카카오 공유 실패 시 링크 복사로 대체
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('카카오 공유에 실패했습니다. 대신 링크가 복사되었습니다!');
        });
      }
    } else {
      console.log('카카오 SDK가 로드되지 않았습니다. 링크 복사로 대체합니다.');
      // 카카오 SDK가 없으면 링크 복사로 대체
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('카카오 공유를 사용할 수 없습니다. 대신 링크가 복사되었습니다!');
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        {/* 배경 패턴 */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-yellow-400/5 to-orange-400/5"></div>
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.06) 0%, transparent 50%)
              `
            }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/60 backdrop-blur-sm border border-amber-200/60 rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              <div className="text-3xl">💰</div>
            </div>
            <h2 className="text-lg font-bold text-amber-900 mb-4">연봉 통계 분석 중</h2>
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        {/* 배경 패턴 */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-yellow-400/5 to-orange-400/5"></div>
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.06) 0%, transparent 50%)
              `
            }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl shadow-xl p-8 text-center max-w-lg w-full">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
              <div className="text-3xl">⚠️</div>
            </div>
            <h2 className="text-xl font-bold text-amber-900 mb-4">데이터 부족</h2>
            <p className="text-amber-700 mb-6 leading-relaxed">
              {error || '아직 충분한 연봉 데이터가 수집되지 않았습니다. 더 많은 사용자가 참여하면 정확한 통계를 제공할 수 있습니다.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-amber-400/20 transition-all duration-300 hover:scale-105"
              >
                다시 진단하기
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full text-amber-700 hover:text-amber-900 px-6 py-3 rounded-xl font-medium transition-colors duration-300"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* 배경 패턴 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-yellow-400/5 to-orange-400/5"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.06) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="relative z-10 py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* 헤더 */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-amber-200/60 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-amber-800">연봉 통계 분석 완료</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 mb-3">
              💰 <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">연봉 통계</span> 결과
            </h1>
            
            <p className="text-amber-700 text-sm sm:text-base max-w-2xl mx-auto">
              같은 성향의 마케터들과 연봉을 비교해보세요
            </p>
          </div>

          {/* 핵심 통계 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 내 연봉 */}
            <div className="bg-gradient-to-br from-white/80 via-amber-50/30 to-orange-50/30 backdrop-blur-xl border-2 border-amber-200/60 rounded-3xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-6 h-6 border-2 border-amber-300 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-amber-300 rounded-full"></div>
              </div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">내 연봉</h3>
                <div className="text-3xl font-bold text-amber-600 mb-1">{salaryInfo?.salary?.toLocaleString()}</div>
                <div className="text-sm text-amber-700">만원</div>
              </div>
            </div>

            {/* 평균 연봉 */}
            <div className="bg-gradient-to-br from-white/80 via-emerald-50/30 to-green-50/30 backdrop-blur-xl border-2 border-emerald-200/60 rounded-3xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-6 h-6 border-2 border-emerald-300 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-emerald-300 rounded-full"></div>
              </div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">평균 연봉</h3>
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {stats && (isNaN(stats.averageSalary) ? '데이터 없음' : `${stats.averageSalary.toLocaleString()}만원`)}
                </div>
                <div className="text-sm text-emerald-700">만원</div>
              </div>
            </div>

            {/* 내 순위 */}
            <div className="bg-gradient-to-br from-white/80 via-purple-50/30 to-pink-50/30 backdrop-blur-xl border-2 border-purple-200/60 rounded-3xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-6 h-6 border-2 border-purple-300 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-purple-300 rounded-full"></div>
              </div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">내 순위</h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {stats && (isNaN(stats.percentile) ? '데이터 없음' : `${stats.percentile}%`)}
                </div>
                <div className="text-sm text-purple-700 font-medium">{getPercentileText(stats.percentile)}</div>
              </div>
            </div>
          </div>

          {/* 상세 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* 연봉 비교 차트 */}
            <div className="bg-gradient-to-br from-white/80 via-amber-50/30 to-orange-50/30 backdrop-blur-xl border-2 border-amber-200/60 rounded-3xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-amber-300 rounded-full"></div>
                <div className="absolute top-12 right-8 w-4 h-4 border border-amber-300 rounded-full"></div>
                <div className="absolute bottom-8 left-12 w-6 h-6 border border-amber-300 transform rotate-45"></div>
                <div className="absolute bottom-16 right-4 w-3 h-3 bg-amber-300 rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-lg">📈</span>
                  </div>
                  연봉 비교 분석
                </h3>
                
                {/* 시각적 차트 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-amber-700">평균 연봉</span>
                    <span className="text-sm font-medium text-amber-700">내 연봉</span>
                  </div>
                  <div className="relative h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((stats.averageSalary / (salaryInfo?.salary || 1)) * 100, 100)}%` }}
                    ></div>
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((salaryInfo?.salary || 0) / (stats.averageSalary || 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>{stats.averageSalary.toLocaleString()}만원</span>
                    <span>{salaryInfo?.salary?.toLocaleString()}만원</span>
                  </div>
                </div>
                
                {/* 차이 분석 */}
                {salaryInfo?.salary && stats.averageSalary && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
                    <div className="text-center">
                      {salaryInfo.salary > stats.averageSalary ? (
                        <div>
                          <div className="text-2xl mb-2">🎉</div>
                          <p className="text-emerald-600 font-semibold text-lg">
                            평균보다 <span className="font-bold">
                              {((salaryInfo.salary - stats.averageSalary) / stats.averageSalary * 100).toFixed(1)}%
                            </span> 높습니다!
                          </p>
                          <p className="text-emerald-700 text-sm mt-1">
                            월 {Math.round((salaryInfo.salary - stats.averageSalary) / 12)}만원 더 받고 있어요
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl mb-2">📊</div>
                          <p className="text-amber-600 font-semibold text-lg">
                            평균보다 <span className="font-bold">
                              {((stats.averageSalary - salaryInfo.salary) / stats.averageSalary * 100).toFixed(1)}%
                            </span> 낮습니다
                          </p>
                          <p className="text-amber-700 text-sm mt-1">
                            월 {Math.round((stats.averageSalary - salaryInfo.salary) / 12)}만원 차이
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 내 정보 상세 */}
            <div className="bg-gradient-to-br from-white/80 via-blue-50/30 to-cyan-50/30 backdrop-blur-xl border-2 border-blue-200/60 rounded-3xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-6 left-6 w-5 h-5 border-2 border-blue-400 rounded-full"></div>
                <div className="absolute top-16 right-10 w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-4 h-4 border border-blue-400 transform rotate-45"></div>
                <div className="absolute bottom-20 right-6 w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-lg">👤</span>
                  </div>
                  내 프로필 정보
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-600">🎯</span>
                      <span className="font-semibold text-blue-900">마케터 유형</span>
                    </div>
                    <p className="text-blue-800 font-medium">{getMarketerTypeName(marketerType || '')}</p>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-600">📅</span>
                      <span className="font-semibold text-blue-900">경력</span>
                    </div>
                    <p className="text-blue-800 font-medium">{getExperienceGroupName(salaryInfo?.yearsOfExperience)}</p>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-600">💰</span>
                      <span className="font-semibold text-blue-900">연봉</span>
                    </div>
                    <p className="text-blue-800 font-bold text-xl">{salaryInfo?.salary?.toLocaleString()}만원</p>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-600">📊</span>
                      <span className="font-semibold text-blue-900">비교 대상</span>
                    </div>
                    <p className="text-blue-800 font-medium">{stats.totalCount}명의 {getExperienceGroupName(salaryInfo?.yearsOfExperience)} 마케터</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 문항별 분석 */}
          {perQuestionSalaries.length > 0 && (
            <div className="bg-gradient-to-br from-white/80 via-purple-50/30 to-pink-50/30 backdrop-blur-xl border-2 border-purple-200/60 rounded-3xl shadow-xl p-6 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
              {/* 문항별 분석 배경 패턴 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-6 left-6 w-5 h-5 border-2 border-purple-400 rounded-full"></div>
                <div className="absolute top-16 right-10 w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-4 h-4 border border-purple-400 transform rotate-45"></div>
                <div className="absolute bottom-20 right-6 w-3 h-3 bg-purple-400 rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-lg">🔍</span>
                  </div>
                  답변별 연봉 분석
                </h3>
                
                <div className="space-y-6">
                  {perQuestionSalaries.map((item, index) => (
                    <div key={item.questionId} className="group">
                      {/* 문항 헤더 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                              Q{index + 1}
                            </span>
                            <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full border border-purple-200">
                              총 {stats?.totalCount || 0}명 중 {item.count}명 응답 {stats?.totalCount ? Math.round((item.count / stats.totalCount) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                        {item.averageSalary && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">
                              {item.averageSalary.toLocaleString()}만원
                            </div>
                            <div className="text-xs text-purple-500 font-medium">평균 연봉</div>
                          </div>
                        )}
                      </div>
                      
                      {/* 문항 내용 */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200/50 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-purple-300/70">
                        <div className="space-y-4">
                          {/* 질문 */}
                          <div>
                            <div className="text-xs text-purple-600 font-medium mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                              질문
                            </div>
                            <p className="text-sm text-purple-800 leading-relaxed font-medium">
                              {item.question.length > 80 ? `${item.question.substring(0, 80)}...` : item.question}
                            </p>
                          </div>
                          
                          {/* 내 선택 */}
                          <div>
                            <div className="text-xs text-purple-600 font-medium mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                              내 선택
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200/50">
                              <span className="text-sm text-purple-800 font-semibold">
                                {item.myChoice}
                              </span>
                            </div>
                          </div>
                          
                          {/* 연봉 정보 */}
                          <div className="flex items-center justify-between pt-2 border-t border-purple-200/30">
                            {item.averageSalary ? (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">💰</span>
                                  <span className="text-sm text-purple-700">평균 연봉</span>
                                </div>
                                <div className="text-lg font-bold text-purple-600">
                                  {item.averageSalary.toLocaleString()}만원
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-purple-500">
                                <span className="text-lg">📊</span>
                                <span className="text-sm font-medium">데이터 부족</span>
                              </div>
                            )}
                            
                            {/* 내 연봉과 비교 */}
                            {item.averageSalary && salaryInfo?.salary && (
                              <div className="text-right">
                                {salaryInfo.salary > item.averageSalary ? (
                                  <div className="text-xs text-emerald-600 font-medium">
                                    +{((salaryInfo.salary - item.averageSalary) / item.averageSalary * 100).toFixed(1)}%
                                  </div>
                                ) : (
                                  <div className="text-xs text-amber-600 font-medium">
                                    {((item.averageSalary - salaryInfo.salary) / item.averageSalary * 100).toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/scenarios/result')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 text-base"
            >
              📋 퍼스널컬러 결과 보기
            </button>
            
            <button
              onClick={() => router.push('/scenarios')}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 text-base"
            >
              🔄 다시 진단하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryResult; 