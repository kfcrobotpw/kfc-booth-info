import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, KeyRound, User } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [adminId, setAdminId] = useState<string>('');
  const [adminPw, setAdminPw] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // User requested: id: admin, pw: 1234
    if (adminId.trim() === 'admin' && adminPw.trim() === '1234') {
      setErrorMsg(null);
      onSuccess();
    } else {
      setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다. (안내: id: admin / pw: 1234)');
    }
  };

  const fillQuick = () => {
    setAdminId('admin');
    setAdminPw('1234');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                K.F.C. 부스 관리자 모드
              </h2>
              <p className="text-xs text-slate-400">용인청소년수련관 로봇동아리 운영진 전용</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">로그인 안내:</span>
              <button
                type="button"
                onClick={fillQuick}
                className="text-indigo-400 hover:text-indigo-300 underline font-medium text-[11px]"
              >
                테스트 계정 자동 입력
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              아이디: <strong className="text-white font-bold">admin</strong> / 비밀번호: <strong className="text-white font-bold">1234</strong>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              관리자 아이디 (ID)
            </label>
            <input
              type="text"
              autoFocus
              placeholder="admin"
              value={adminId}
              onChange={e => setAdminId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              비밀번호 (PW)
            </label>
            <input
              type="password"
              placeholder="••••"
              value={adminPw}
              onChange={e => setAdminPw(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              관리자 콘솔 접속
            </button>
          </div>
        </form>

        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          URL 뒤에 <code className="text-indigo-400">/admin</code>을 입력하셔도 바로 관리자 화면으로 진입할 수 있습니다.
        </div>
      </div>
    </div>
  );
};
