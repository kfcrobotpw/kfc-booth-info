import React, { useState } from 'react';
import { Member } from '../../types';
import { Key, User, CheckCircle2, AlertCircle, X, Sparkles, Shield } from 'lucide-react';

interface OperatorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onLoginSuccess: (member: Member) => void;
}

export const OperatorLoginModal: React.FC<OperatorLoginModalProps> = ({
  isOpen,
  onClose,
  members,
  onLoginSuccess,
}) => {
  const [code, setCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setErrorMsg('운영자 접속 코드를 입력해 주세요.');
      return;
    }

    const matched = members.find(m => (m.accessCode || '').toUpperCase() === trimmed);
    if (matched) {
      onLoginSuccess(matched);
      onClose();
    } else {
      setErrorMsg('일치하는 운영자 접속 코드가 없습니다. 관리자에게 발급받은 코드를 다시 확인해 주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header decoration */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-lg">
              <Key className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                  STAFF AUTHENTICATION
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">부스 운영자 전용 로그인</h2>
              <p className="text-xs text-slate-400">발급받은 접속 코드로 개인 맞춤 운영 화면을 시작합니다.</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>운영자 접속 코드 (Access Code)</span>
                <span className="text-[11px] text-indigo-400 font-normal">관리자가 발급한 고유 코드</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="예: KFC-72B"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-indigo-500 text-lg font-mono font-black text-amber-300 rounded-2xl px-4 py-3 tracking-widest uppercase focus:outline-none transition shadow-inner placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                * 관리자에게 전달받은 짧은 코드를 입력하세요. 로그인하면 본인의 부스 소팀 배치, 교대 시간 및 투입 로봇 승인 신청 기능을 이용할 수 있습니다.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>운영자 모드로 시작하기</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
