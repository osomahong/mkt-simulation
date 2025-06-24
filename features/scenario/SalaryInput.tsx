import React, { useState } from 'react';
import useScenarioStore from '@/stores/scenarioStore';

const SalaryInput = () => {
  const { marketerType, setSalaryInfo, salaryInfo, setSalaryInputSkipped } = useScenarioStore();
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [errors, setErrors] = useState<{ years?: string; salary?: string; general?: string }>({});

  const getMarketerTypeName = (type: string) => {
    const typeNames = {
      'B2C': 'B2C 마케터',
      'B2B': 'B2B 마케터',
      '이커머스': '이커머스 마케터',
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  // 이미 연봉 정보가 있는 경우 수정 페이지 표시
  if (salaryInfo?.salary || salaryInfo?.yearsOfExperience) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
            📝 추가 정보 입력
          </h1>
          <p className="text-base text-slate-600 mb-6 leading-relaxed">
            선택하신 유형: <span className="font-semibold text-blue-600">{getMarketerTypeName(marketerType!)}</span>
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 mb-6 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2">
              ✏️ 경력과 연봉을 수정하시겠어요?
            </h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              현재 입력된 정보:
              {salaryInfo.yearsOfExperience && ` 연차 ${salaryInfo.yearsOfExperience}년,`}
              {salaryInfo.salary && ` 연봉 ${salaryInfo.salary.toLocaleString()}만원`}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setSalaryInputSkipped(true)}
              className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              ⏭️ 다시보지않기
            </button>
            <button
              onClick={() => {
                setYearsOfExperience(salaryInfo.yearsOfExperience?.toString() || '');
                setSalary(salaryInfo.salary?.toString() || '');
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              ✅ 네
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateInputs = () => {
    const newErrors: { years?: string; salary?: string; general?: string } = {};

    // 연차 검증
    if (yearsOfExperience) {
      const years = parseFloat(yearsOfExperience);
      if (isNaN(years) || years < 0 || years > 50) {
        newErrors.years = '연차는 0-50년 사이의 숫자를 입력해주세요.';
      }
    }

    // 연봉 검증
    if (salary) {
      const salaryNum = parseFloat(salary);
      if (isNaN(salaryNum) || salaryNum < 1000 || salaryNum > 100000) {
        newErrors.salary = '연봉은 1,000만원-100,000만원 사이를 입력해주세요.';
      } else if (salaryNum % 100 !== 0) {
        newErrors.salary = '연봉은 100만원 단위로 입력해주세요. (예: 4200, 3900)';
      }
    }

    // 둘 중 하나만 입력한 경우 경고
    const hasYears = yearsOfExperience.trim() !== '';
    const hasSalary = salary.trim() !== '';
    
    if ((hasYears && !hasSalary) || (!hasYears && hasSalary)) {
      newErrors.general = '경력과 연봉을 모두 입력하거나 모두 건너뛰어주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateInputs()) return;

    const years = yearsOfExperience ? parseFloat(yearsOfExperience) : null;
    const salaryNum = salary ? parseFloat(salary) : null;

    // 연봉이 올바른 범위인지 한 번 더 확인
    if (salaryNum && (salaryNum < 1000 || salaryNum > 100000)) {
      setErrors({ salary: '연봉은 1,000만원-100,000만원 사이를 입력해주세요.' });
      return;
    }

    // 100단위 검증
    if (salaryNum && salaryNum % 100 !== 0) {
      setErrors({ salary: '연봉은 100만원 단위로 입력해주세요. (예: 4200, 3900)' });
      return;
    }

    setSalaryInfo(years, salaryNum);
  };

  const handleSkip = () => {
    setSalaryInfo(null, null);
    setSalaryInputSkipped(true);
  };

  // 연봉 입력 시 100단위로 자동 조정
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalary(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          📝 추가 정보 입력
        </h1>
        <p className="text-base text-slate-600 mb-6 leading-relaxed">
          선택하신 유형: <span className="font-semibold text-blue-600">{getMarketerTypeName(marketerType!)}</span>
        </p>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 mb-6 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2">
            💼 당신의 연차와 연봉을 입력해주세요
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            이 정보는 익명으로 처리되며, 동료 마케터들과의 비교 통계에만 사용됩니다.
          </p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* 연차 입력 */}
            <div>
              <label htmlFor="years" className="block text-sm font-medium text-slate-700 mb-2">
                연차 (년)
              </label>
              <input
                type="number"
                id="years"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="예: 3"
                min="0"
                max="50"
                step="0.5"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.years ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.years && (
                <p className="text-red-500 text-xs mt-1">{errors.years}</p>
              )}
            </div>

            {/* 연봉 입력 */}
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-2">
                연봉 (만원)
              </label>
              <input
                type="number"
                id="salary"
                value={salary}
                onChange={handleSalaryChange}
                placeholder="예: 4200"
                min="1000"
                max="100000"
                step="100"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.salary ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.salary && (
                <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                연봉은 1,000만원-100,000만원 사이를 입력해주세요. (100만원 단위)
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            🚀 진단 시작하기
          </button>
          <button
            onClick={handleSkip}
            className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            ⏭️ 연봉 입력 건너뛰기
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          * 경력과 연봉을 모두 입력하거나 모두 건너뛰어주세요.<br />하나만 입력하면 진행할 수 없습니다.
        </p>
      </div>
    </div>
  );
};

export default SalaryInput;