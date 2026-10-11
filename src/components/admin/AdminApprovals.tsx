import React, { useState } from 'react';
import { RobotDeploymentRequest, WebAppIdeaRequest } from '../../types';
import { 
  Bot, Smartphone, CheckCircle2, XCircle, Clock, Check, X, 
  AlertCircle, ShieldAlert, Cpu, Battery, User, MessageSquare, Sparkles 
} from 'lucide-react';

interface AdminApprovalsProps {
  robotRequests: RobotDeploymentRequest[];
  webAppRequests: WebAppIdeaRequest[];
  onApproveRobotRequest: (requestId: string) => void;
  onRejectRobotRequest: (requestId: string, reason: string) => void;
  onApproveWebAppRequest: (requestId: string) => void;
  onRejectWebAppRequest: (requestId: string, reason: string) => void;
}

export const AdminApprovals: React.FC<AdminApprovalsProps> = ({
  robotRequests,
  webAppRequests,
  onApproveRobotRequest,
  onRejectRobotRequest,
  onApproveWebAppRequest,
  onRejectWebAppRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'robots' | 'webapps'>('robots');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Reject modal state
  const [rejectingItem, setRejectingItem] = useState<{ id: string; type: 'robot' | 'webapp'; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const pendingRobotsCount = robotRequests.filter(r => r.status === 'pending').length;
  const pendingWebAppsCount = webAppRequests.filter(w => w.status === 'pending').length;

  const filteredRobots = robotRequests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const filteredWebApps = webAppRequests.filter(w => {
    if (filter === 'all') return true;
    return w.status === filter;
  });

  const handleOpenReject = (id: string, type: 'robot' | 'webapp', name: string) => {
    setRejectingItem({ id, type, name });
    setRejectReason('현장 안전 요건 또는 부스 공간 제약으로 인해 반려되었습니다.');
  };

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    if (rejectingItem.type === 'robot') {
      onRejectRobotRequest(rejectingItem.id, rejectReason.trim());
    } else {
      onRejectWebAppRequest(rejectingItem.id, rejectReason.trim());
    }
    setRejectingItem(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              APPROVAL MANAGEMENT
            </span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            부스 투입 로봇 & 아이디어 승인/반려 관제
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            부스 운영진이 신청한 투입 로봇과 제안 아이디어를 관리자가 직접 검토하여 승인하거나 반려 처리합니다.
          </p>
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2">
            <span className="text-slate-400">총 미승인 대기:</span>
            <span className="font-mono font-bold text-amber-300">
              {pendingRobotsCount + pendingWebAppsCount}건
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('robots')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'robots'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            투입 로봇 승인 관리 ({robotRequests.length}건)
            {pendingRobotsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {pendingRobotsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('webapps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'webapps'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            웹앱/아이디어 승인 관리 ({webAppRequests.length}건)
            {pendingWebAppsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {pendingWebAppsCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: '전체' },
            { id: 'pending', label: '대기 중' },
            { id: 'approved', label: '승인 완료' },
            { id: 'rejected', label: '반려됨' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                filter === f.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Robot Deployment Requests */}
      {activeTab === 'robots' && (
        <div className="space-y-4">
          {filteredRobots.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-8 space-y-2">
              <Bot className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">해당 조건의 로봇 투입 신청서가 없습니다</h4>
              <p className="text-xs text-slate-400">부스 운영진이 등록한 신청서가 실시간으로 이곳에 표시됩니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRobots.map(req => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl bg-slate-900/90 border transition flex flex-col justify-between space-y-4 shadow-lg ${
                    req.status === 'pending'
                      ? 'border-amber-500/50 ring-1 ring-amber-500/30'
                      : req.status === 'approved'
                      ? 'border-emerald-500/40'
                      : 'border-rose-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{req.robotName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {req.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span>신청 운영자: <strong className="text-slate-200">{req.applicantName}</strong> {req.applicantCode && `(${req.applicantCode})`}</span>
                        </div>
                      </div>

                      {/* Status */}
                      {req.status === 'pending' ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          승인 대기
                        </span>
                      ) : req.status === 'approved' ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          승인 완료
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" />
                          반려 처리됨
                        </span>
                      )}
                    </div>

                    {req.description && (
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        "{req.description}"
                      </p>
                    )}

                    {/* Detailed Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">하드웨어/제어</span>
                        <span className="text-slate-300">{req.specs || '미지정'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">배터리 사양</span>
                        <span className="text-slate-300">{req.batteryType || '미지정'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
                      <div className="flex items-center gap-1.5 font-bold mb-0.5">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        현장 안전 점검 사항:
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-200/90">{req.safetyNotes}</p>
                    </div>

                    {req.status === 'rejected' && req.rejectionReason && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
                        <strong>반려 사유:</strong> {req.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Admin Actions Bar */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">
                      신청: {new Date(req.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleOpenReject(req.id, 'robot', req.robotName)}
                            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 active:scale-95 text-rose-300 font-bold rounded-lg border border-rose-800 transition cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            반려
                          </button>
                          <button
                            onClick={() => onApproveRobotRequest(req.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            승인 및 공식 투입
                          </button>
                        </>
                      ) : req.status === 'approved' ? (
                        <button
                          onClick={() => handleOpenReject(req.id, 'robot', req.robotName)}
                          className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                        >
                          승인 취소 / 반려로 변경
                        </button>
                      ) : (
                        <button
                          onClick={() => onApproveRobotRequest(req.id)}
                          className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          재승인 처리
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WebApp Idea Requests */}
      {activeTab === 'webapps' && (
        <div className="space-y-4">
          {filteredWebApps.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-8 space-y-2">
              <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">해당 조건의 웹앱 아이디어 신청서가 없습니다</h4>
              <p className="text-xs text-slate-400">부스 운영진이 등록한 아이디어가 실시간으로 이곳에 표시됩니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredWebApps.map(req => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl bg-slate-900/90 border transition flex flex-col justify-between space-y-4 shadow-lg ${
                    req.status === 'pending'
                      ? 'border-amber-500/50'
                      : req.status === 'approved'
                      ? 'border-emerald-500/40'
                      : 'border-rose-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{req.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {req.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span>제안자: <strong className="text-slate-200">{req.applicantName}</strong> {req.applicantCode && `(${req.applicantCode})`}</span>
                        </div>
                      </div>

                      {req.status === 'pending' ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          승인 대기
                        </span>
                      ) : req.status === 'approved' ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          승인 완료
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" />
                          반려됨
                        </span>
                      )}
                    </div>

                    {req.summary && (
                      <p className="text-xs font-semibold text-indigo-300">{req.summary}</p>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      {req.description}
                    </p>

                    {req.boothBenefit && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                        🎯 <strong>기대 효과:</strong> {req.boothBenefit}
                      </div>
                    )}

                    {req.status === 'rejected' && req.rejectionReason && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
                        <strong>반려 사유:</strong> {req.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">
                      신청: {new Date(req.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleOpenReject(req.id, 'webapp', req.title)}
                            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 active:scale-95 text-rose-300 font-bold rounded-lg border border-rose-800 transition cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            반려
                          </button>
                          <button
                            onClick={() => onApproveWebAppRequest(req.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            승인 및 공식 등록
                          </button>
                        </>
                      ) : req.status === 'approved' ? (
                        <button
                          onClick={() => handleOpenReject(req.id, 'webapp', req.title)}
                          className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                        >
                          승인 취소 / 반려로 변경
                        </button>
                      ) : (
                        <button
                          onClick={() => onApproveWebAppRequest(req.id)}
                          className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          재승인 처리
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                신청서 반려 사유 작성
              </h4>
              <button
                onClick={() => setRejectingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              [<strong>{rejectingItem.name}</strong>] 신청을 반려합니다. 신청자가 확인할 수 있도록 사유를 입력해 주세요.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">반려 사유 입력 *</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                반려 처리 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
