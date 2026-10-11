import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, KeyRound, User, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getStoredAdminCredentials, saveAdminCredentials, hashPassword, AdminCredentials } from '../../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);
  const [adminId, setAdminId] = useState<string>('');
  const [adminPw, setAdminPw] = useState<string>('');
  const [confirmPw, setConfirmPw] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredAdminCredentials();
      setCredentials(stored);
      setAdminId(stored?.adminId || '');
      setAdminPw('');
      setConfirmPw('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSetupMode = !credentials || !credentials.isConfigured;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedId = adminId.trim();
    const trimmedPw = adminPw.trim();

    if (!trimmedId) {
      setErrorMsg('관리자 아이디를 입력해 주세요.');
      return;
    }
    if (!trimmedPw || trimmedPw.length < 4) {
      setErrorMsg('비밀번호는 최소 4자 이상 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSetupMode) {
        // Initial Admin Setup Mode
        if (trimmedPw !== confirmPw.trim()) {
          setErrorMsg('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
          setIsSubmitting(false);
          return;
        }

        const hashed = await hashPassword(trimmedPw);
        saveAdminCredentials(trimmedId, hashed);
        onSuccess();
      } else {
        // Login Verification Mode
        if (trimmedId !== credentials.adminId) {
          setErrorMsg('등록된 관리자 아이디와 일치하지 않습니다.');
          setIsSubmitting(false);
          return;
        }

        const enteredHash = await hashPassword(trimmedPw);
        if (enteredHash === credentials.passwordHash) {
          onSuccess();
        } else {
          setErrorMsg('비밀번호가 올바르지 않습니다.');
        }
      }
    } catch {
      setErrorMsg('보안 검증 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="text-xs text-slate-400">용인시청소년수련관 로봇동아리 운영진 전용 관제실</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Banner: Zero Shared Credentials */}
        <div className="bg-slate-950/60 px-6 py-2.5 border-b border-slate-800/80 flex items-center gap-2 text-[11px] text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            {isSetupMode
              ? '보안 정책: 공용 비밀번호 없이, 본인만의 관리자 계정을 직접 설정합니다.'
              : '보안 정책: 관리자 계정은 암호화(SHA-256)되어 타인과 절대 공유되지 않습니다.'}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {isSetupMode ? '설정할 관리자 아이디 (ID)' : '관리자 아이디 (ID)'}
                </span>
                {isSetupMode && (
                  <span className="text-[10px] text-cyan-400 font-normal">본인만의 아이디 지정</span>
                )}
              </label>
              <input
                type="text"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                placeholder={isSetupMode ? '예: kfc_admin 또는 운영진명' : '관리자 아이디 입력'}
                className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  {isSetupMode ? '설정할 비밀번호 (PW)' : '비밀번호 (PW)'}
                </span>
                {isSetupMode && (
                  <span className="text-[10px] text-slate-500 font-normal">4자 이상</span>
                )}
              </label>
              <input
                type="password"
                value={adminPw}
                onChange={e => setAdminPw(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {isSetupMode && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="비밀번호 다시 입력"
                  className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              {isSetupMode ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-cyan-200" />
                  <span>{isSubmitting ? '계정 암호화 설정 중...' : '관리자 계정 안전하게 생성 & 로그인'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>{isSubmitting ? '인증 중...' : '관리자 모드로 접속'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
