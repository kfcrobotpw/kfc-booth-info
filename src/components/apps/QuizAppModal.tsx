import React, { useState } from 'react';
import { X, Award, CheckCircle, HelpCircle, RefreshCcw, Sparkles } from 'lucide-react';

interface QuizAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: 'K.F.C.의 4족 보행 로봇(CyberHound)은 다리당 3개씩, 총 몇 개의 서보모터(관절)를 사용할까요?',
    options: ['6개', '8개', '12개', '16개'],
    correctIndex: 2,
    explanation: '4개의 다리가 각각 3자유도(엉덩이 요/피치, 무릎 굽힘)를 가져 총 12개의 모터로 유연하게 보행합니다.',
  },
  {
    id: 2,
    question: '메카넘 휠(Mecanum Wheel)이 일반 바퀴와 다른 가장 핵심적인 특징은 무엇일까요?',
    options: [
      '타이어에 공기를 주입해야 한다',
      '차체를 회전하지 않고도 360도 전방향 및 대각선 주행이 가능하다',
      '물 위에서만 달릴 수 있다',
      '속도가 무조건 시속 100km 이상이다',
    ],
    correctIndex: 1,
    explanation: '45도 각도의 롤러들이 서로 다른 방향의 분력을 만들어 제자리 회전 없이 옆으로 게걸음 주행할 수 있습니다.',
  },
  {
    id: 3,
    question: '축제 부스 운영 중 LiPo(리튬 폴리머) 배터리를 다룰 때 반드시 지켜야 할 안전 수칙은?',
    options: [
      '햇빛이 강한 바닥에 방치한다',
      '배터리가 부풀어도 계속 충전한다',
      '내화성 배터리 안전 파우치 안에서 충전하고 전압을 수시로 체크한다',
      '물에 담가서 식힌다',
    ],
    correctIndex: 2,
    explanation: 'LiPo 배터리는 에너지 밀도가 높아 반드시 방화 안전백 안에서 정격 전압(셀당 3.7~4.2V)으로 충전해야 안전합니다.',
  },
];

export const QuizAppModal: React.FC<QuizAppModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('청소년 탐험가');

  if (!isOpen) return null;

  const currentQ = QUESTIONS[currentStep];

  const handleSelect = (idx: number) => {
    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentStep] = idx;
    setSelectedAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 400);
    } else {
      setTimeout(() => setIsCompleted(true), 400);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };

  const correctCount = selectedAnswers.reduce((acc, ans, idx) => {
    return ans === QUESTIONS[idx].correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                로봇 퀴즈 & 디지털 스탬프 투어
              </h2>
              <p className="text-xs text-slate-400">용인청소년수련관 K.F.C. 인터랙티브 미션</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isCompleted ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>미션 퀴즈 {currentStep + 1} / {QUESTIONS.length}</span>
                  <span>정답 시 K.F.C. 3D 키링 기념품 증정</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <h3 className="text-sm font-semibold text-white leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>

                <div className="space-y-2 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentStep] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`w-full p-3 rounded-lg text-left text-xs transition border flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/20 text-white font-medium'
                            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        <span>{idx + 1}. {opt}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Certificate & Stamp Stamp Completion Screen */
            <div className="space-y-5 text-center">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-950 border-2 border-indigo-500/40 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-indigo-500/10 font-black text-7xl select-none">
                  K.F.C.
                </div>
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
                <div className="text-xs uppercase font-mono tracking-widest text-indigo-400">
                  수료 인증서 (CERTIFICATE OF ROBOTICS)
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  K.F.C. 주니어 엔지니어
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  위 사람은 용인시청소년수련관 로봇동아리 K.F.C. 부스에서 로봇 원리 퀴즈({correctCount}/{QUESTIONS.length}점) 및 안전 미션을 우수하게 이수하였음을 인증합니다.
                </p>

                {/* Stamp visual */}
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-rose-500 text-rose-400 font-black text-sm rotate-[-4deg] shadow-lg bg-rose-950/30">
                  <Award className="w-5 h-5" />
                  용인청소년수련관 K.F.C. 확인필
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  선물 수령 바코드: <span className="font-mono text-white font-bold">#KFC-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                  <div className="text-[11px] text-amber-300 mt-1">
                    부스 접수처(한수아 부원)에 보여주시면 3D 프린터 로봇 키링을 드립니다!
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> 퀴즈 다시 풀기
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>지도 부원: 최예은 (멘토링 팀장)</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
