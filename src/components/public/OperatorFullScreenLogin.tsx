import React, { useState } from 'react';
import { Member } from '../../types';
import { Key, Bot, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface OperatorFullScreenLoginProps {
  members: Member[];
  onLoginSuccess: (member: Member) => void;
  onAdminRouteRequested?: () => void;
}

export const OperatorFullScreenLogin: React.FC<OperatorFullScreenLoginProps> = ({
  members,
  onLoginSuccess,
  onAdminRouteRequested,
}) => {
  const [code, setCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shake, setShake] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setErrorMsg('운영자 고유 코드를 입력해 주세요.');
      triggerShake();
      return;
    }

    if (members.length === 0) {
      setErrorMsg('현재 등록된 부스 운영자 정보가 없습니다. 관리자 모드에서 운영진을 먼저 등록해 주세요.');
      triggerShake();
      return;
    }

    const matched = members.find(m => (m.accessCode || '').toUpperCase() === trimmed);
    if (matched) {
      onLoginSuccess(matched);
    } else {
      setErrorMsg('일치하는 운영자 고유 코드가 없습니다. 관리자에게 발급받은 코드를 확인해 주세요.');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleHeaderSecretClick = () => {
    if (onAdminRouteRequested) {
      onAdminRouteRequested();
    } else {
      window.location.hash = 'admin';
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-900/30 via-cyan-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-900/15 blur-3xl pointer-events-none" />

      {/* Top Bar: Clean and minimal */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div 
          onClick={handleHeaderSecretClick}
          className="flex items-center gap-3 cursor-pointer group"
          title="용인시청소년수련관 로봇동아리 K.F.C."
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black group-hover:scale-105 transition">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-400 tracking-wider">용인시청소년수련관 로봇동아리</div>
            <div className="text-base font-black tracking-tight text-white">K.F.C. (Korea Fun Club)</div>
          </div>
        </div>

        {/* Empty right area */}
        <div />
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className={`w-full max-w-md transition-transform duration-200 ${shake ? 'animate-bounce' : ''}`}>
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 p-6 sm:p-7 border-b border-slate-800 text-center relative">
              <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-amber-400 shadow-xl shadow-indigo-950">
                <Key className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold tracking-wider mb-2">
                STAFF ACCESS
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                부스 운영자 전용 로그인
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                관리자가 발급한 부스 운영자 고유 코드를 입력해 주세요.
              </p>
            </div>

            {/* Login Form */}
            <div className="p-6 sm:p-7 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-bold">접속 실패: </span>
                      {errorMsg}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>운영자 고유 코드 (Access Code)</span>
                    <span className="text-[11px] text-indigo-400 font-mono">영문+숫자</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      placeholder="발급받은 코드 입력"
                      value={code}
                      onChange={e => {
                        setCode(e.target.value.toUpperCase());
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="w-full bg-slate-950 border-2 border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-center text-xl font-mono font-black text-amber-300 rounded-2xl py-3.5 tracking-widest uppercase focus:outline-none transition shadow-inner placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed text-center">
                    * 코드를 입력하시면 본인 전용 부스 운영 관제 및 승인 화면으로 진입합니다.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 active:scale-98 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>부스 관제 시스템 접속하기</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        <p>
          용인시청소년수련관 소속 로봇동아리 K.F.C. &bull; Korea Fun Club Booth Operation Control
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          * 비인가 접근 시도가 제한되며, 발급된 고유 코드는 타인에게 양도할 수 없습니다.
        </p>
      </footer>
    </div>
  );
};
