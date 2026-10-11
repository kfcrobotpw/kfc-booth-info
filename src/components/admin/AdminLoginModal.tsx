import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, AlertCircle, KeyRound, User } from 'lucide-react';
import { getStoredAdminCredentials, hashPassword, AdminCredentials } from '../../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);
  const [adminId, setAdminId] = useState<string>('admin');
  const [adminPw, setAdminPw] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredAdminCredentials();
      setCredentials(stored);
      setAdminId(stored.adminId || 'admin');
      setAdminPw('');
      setErrorMsg(null);
      setSuccessNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedId = adminId.trim();
    const trimmedPw = adminPw.trim();

    if (!trimmedId) {
      setErrorMsg('관리자 아이디를 입력해 주세요.');
      return;
    }
    if (!trimmedPw) {
      setErrorMsg('비밀번호를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const enteredHash = await hashPassword(trimmedPw);

      // Verify credentials: admin / 1234
      const stored = credentials || getStoredAdminCredentials();
      const isDefaultMatch = trimmedId.toLowerCase() === 'admin' && trimmedPw === '1234';

      if (
        (trimmedId === stored.adminId && enteredHash === stored.passwordHash) ||
        isDefaultMatch
      ) {
        onSuccess();
        return;
      }

      setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
    } catch {
      setErrorMsg('인증 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
              <Lock className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                K.F.C. 부스 관리자 모드
              </h2>
              <p className="text-xs text-slate-400">용인시청소년수련관 로봇동아리 K.F.C. (Korea Fun Club)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="leading-relaxed">{successNotice}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                관리자 아이디 (ID)
              </label>
              <input
                type="text"
                autoFocus
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                placeholder="관리자 아이디 입력"
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-sm text-white rounded-xl px-3.5 py-3 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                비밀번호 (PW)
              </label>
              <input
                type="password"
                value={adminPw}
                onChange={e => setAdminPw(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-sm text-white rounded-xl px-3.5 py-3 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-98 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{isSubmitting ? '인증 처리 중...' : '관리자 모드로 접속'}</span>
            </button>
          </form>

          {/* Secure note without exposing credentials */}
          <div className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
            🔒 관리자 권한 인증 후 부스 설정 및 운영진을 관리할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
};
