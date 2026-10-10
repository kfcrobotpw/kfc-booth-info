import React, { useState } from 'react';
import { X, Users, Bell, Clock, Ticket, CheckCircle2, Volume2, ShieldAlert } from 'lucide-react';

interface QueueAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueAppModal: React.FC<QueueAppModalProps> = ({ isOpen, onClose }) => {
  const [currentCalling, setCurrentCalling] = useState<number>(14);
  const [waitingList, setWaitingList] = useState<number[]>([15, 16, 17, 18, 19]);
  const [myTicket, setMyTicket] = useState<number | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string>('메카넘 슈팅 챌린지');
  const [staffMode, setStaffMode] = useState<boolean>(false);
  const [calledAlert, setCalledAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIssueTicket = () => {
    const nextTicketNum = waitingList.length > 0 ? Math.max(...waitingList, currentCalling) + 1 : currentCalling + 1;
    setWaitingList(prev => [...prev, nextTicketNum]);
    setMyTicket(nextTicketNum);
  };

  const handleCallNext = () => {
    if (waitingList.length === 0) return;
    const next = waitingList[0];
    setWaitingList(prev => prev.slice(1));
    setCurrentCalling(next);
    setCalledAlert(`[띵동!] 대기번호 ${next}번 관람객님! 부스 체험대로 입장해 주세요.`);
    setTimeout(() => setCalledAlert(null), 4000);
  };

  const myWaitCount = myTicket ? waitingList.indexOf(myTicket) : -1;
  const estimatedWaitMinutes = myWaitCount >= 0 ? (myWaitCount + 1) * 3 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                K.F.C. 스마트 대기열 시스템
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE 데모
                </span>
              </h2>
              <p className="text-xs text-slate-400">용인청소년수련관 부스 실시간 번호표 & 모니터 호출기</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {calledAlert && (
            <div className="p-4 rounded-xl bg-indigo-600/30 border border-indigo-500 text-indigo-200 flex items-center gap-3 animate-bounce">
              <Volume2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="font-semibold text-sm">{calledAlert}</div>
            </div>
          )}

          {/* Electronic Display Board Simulation */}
          <div className="bg-slate-950 border-2 border-indigo-500/50 rounded-xl p-5 text-center relative overflow-hidden shadow-inner">
            <div className="text-xs tracking-widest uppercase font-semibold text-indigo-400 mb-1">
              NOW SERVING · 현재 호출 번호
            </div>
            <div className="text-5xl font-black text-amber-400 tracking-wider font-mono my-2 animate-pulse">
              #{String(currentCalling).padStart(3, '0')}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                대기 중: <strong className="text-white">{waitingList.length}팀</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                예상 대기: <strong className="text-white">{waitingList.length * 3}분</strong>
              </span>
            </div>
          </div>

          {/* Visitor Ticket Section */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">관람객 모바일 발권기</span>
              <span className="text-xs text-slate-400">현장 QR코드 스캔 연동</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['메카넘 슈팅 챌린지', '4족 로봇 조종', '협동 로봇팔 블록'].map(exp => (
                <button
                  key={exp}
                  onClick={() => setSelectedExperience(exp)}
                  className={`text-xs p-2.5 rounded-lg border text-left transition ${
                    selectedExperience === exp
                      ? 'border-indigo-500 bg-indigo-500/20 text-white font-medium'
                      : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>

            {myTicket === null ? (
              <button
                onClick={handleIssueTicket}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <Ticket className="w-4 h-4" />
                [{selectedExperience}] 모바일 번호표 뽑기
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  번호표 발권 완료!
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  #{String(myTicket).padStart(3, '0')}
                </div>
                <p className="text-xs text-emerald-300">
                  {myWaitCount >= 0 ? (
                    <>내 앞 대기 <strong className="text-white">{myWaitCount}팀</strong> (예상 {estimatedWaitMinutes}분 소요)</>
                  ) : myTicket === currentCalling ? (
                    <strong className="text-amber-400 font-bold">지금 부스 체험대로 오세요!</strong>
                  ) : (
                    '체험 완료되었습니다.'
                  )}
                </p>
                <button
                  onClick={() => setMyTicket(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline mt-2"
                >
                  새 번호표 재발급
                </button>
              </div>
            )}
          </div>

          {/* Staff Control Box */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setStaffMode(!staffMode)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
              >
                <span>{staffMode ? '스태프 호출 리모컨 닫기 ▲' : '부스 스태프용 호출 컨트롤러 열기 ▼'}</span>
              </button>
            </div>

            {staffMode && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  부스 현장 스태프 관제 도구 (박서연 / 웹앱팀)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCallNext}
                    disabled={waitingList.length === 0}
                    className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    다음 번호 호출 #{waitingList[0] || '-'}
                  </button>
                  <button
                    onClick={() => {
                      setWaitingList([currentCalling + 1, currentCalling + 2, currentCalling + 3]);
                    }}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                  >
                    대기열 리셋 (+3명)
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">
                  * 55인치 TV 모니터 전광판 및 스피커 안내 음성과 실시간 웹소켓 동기화됩니다.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>개발자: 박서연 (K.F.C. 부기장 / SW 리드)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
