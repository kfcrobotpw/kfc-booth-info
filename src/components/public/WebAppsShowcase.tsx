import React, { useState } from 'react';
import { WebAppIdea, WebAppCategory, Member, WebAppIdeaRequest } from '../../types';
import { 
  Smartphone, CheckCircle2, Clock, Plus, Send, XCircle, 
  AlertCircle, Key, Lightbulb, Sparkles 
} from 'lucide-react';

interface WebAppsShowcaseProps {
  webApps: WebAppIdea[];
  currentOperator?: Member | null;
  webAppRequests?: WebAppIdeaRequest[];
  onSubmitWebAppRequest?: (req: WebAppIdeaRequest) => void;
  onOpenOperatorLogin?: () => void;
}

export const WebAppsShowcase: React.FC<WebAppsShowcaseProps> = ({ 
  webApps,
  currentOperator,
  webAppRequests = [],
  onSubmitWebAppRequest,
  onOpenOperatorLogin,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'apps' | 'requests'>('apps');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WebAppCategory>('booth_operation');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [boothBenefit, setBoothBenefit] = useState('');
  const [applicantName, setApplicantName] = useState(currentOperator?.name || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredApps = filter === 'all'
    ? webApps
    : webApps.filter(w => w.devStatus === filter);

  const openModal = () => {
    if (currentOperator) {
      setApplicantName(currentOperator.name);
    }
    setFormError(null);
    setSubmitSuccess(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('웹앱/아이디어 제목을 입력해 주세요.');
      return;
    }
    const finalApplicantName = (currentOperator?.name || applicantName).trim();
    if (!finalApplicantName) {
      setFormError('신청자(운영자) 이름을 입력해 주세요.');
      return;
    }

    const newRequest: WebAppIdeaRequest = {
      id: 'webapp-req-' + Date.now(),
      applicantMemberId: currentOperator?.id || 'guest-' + Date.now(),
      applicantName: finalApplicantName,
      applicantCode: currentOperator?.accessCode || '',
      title: title.trim(),
      category,
      summary: summary.trim(),
      description: description.trim(),
      features: ['실시간 운영 동기화', '부스 현장 지원'],
      boothBenefit: boothBenefit.trim() || '부스 운영 효율 극대화',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onSubmitWebAppRequest?.(newRequest);
    setSubmitSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitSuccess(false);
      setActiveTab('requests');
      setTitle('');
      setSummary('');
      setDescription('');
      setBoothBenefit('');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
              SOFTWARE & IDEAS HUB
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-indigo-400" />
            K.F.C. 웹앱 & 운영 아이디어 제안
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            부스 운영을 지원하기 위해 K.F.C. 동아리원들이 직접 개발/기획한 웹앱이며, 새 아이디어를 등록하여 관리자에게 승인을 요청할 수 있습니다.
          </p>
        </div>

        {/* Action Button: Propose Idea */}
        {onSubmitWebAppRequest && (
          <button
            onClick={openModal}
            className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-300" />
            새 웹앱/아이디어 등록 & 승인 받기
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'apps'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            등록 웹앱 목록 ({webApps.length}개)
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            아이디어 승인 신청 현황 ({webAppRequests.length}건)
          </button>
        </div>

        {activeTab === 'apps' && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: '전체 보기' },
              { id: 'production', label: '실전 운영 중' },
              { id: 'in_development', label: '개발 중' },
              { id: 'planned_idea', label: '기획 아이디어' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  filter === f.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Registered WebApps */}
      {activeTab === 'apps' && (
        <>
          {filteredApps.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 p-8 space-y-3">
              <Smartphone className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">등록된 웹앱이 없습니다</h3>
              <p className="text-xs text-slate-400">
                상단의 <strong>[새 웹앱/아이디어 등록 & 승인 받기]</strong> 버튼을 통해 새로운 소프트웨어를 제안해 보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApps.map(app => (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {app.devStatus === 'production' ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          부스 실전 운영 중
                        </span>
                      ) : app.devStatus === 'in_development' ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          프로토타입 개발 중
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                          기획 제안 아이디어
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">제작: {app.author || 'K.F.C.'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{app.title}</h3>
                    {app.summary && <p className="text-xs text-indigo-300 font-medium mb-3">{app.summary}</p>}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{app.description}</p>

                    {/* Features List */}
                    {app.features && app.features.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs mb-3">
                        <span className="font-semibold text-slate-400 block text-[11px]">핵심 기능 및 특징:</span>
                        {app.features.map((feat, idx) => (
                          <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {app.boothBenefit && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                        🎯 <strong>운영 효과:</strong> {app.boothBenefit}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: Ideas Approval Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              부스 운영진이 등록한 웹앱 및 아이디어 신청서 목록입니다. 관리자가 검토 후 승인하면 공식 웹앱 목록에 추가됩니다.
            </div>
            <button
              onClick={openModal}
              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
            >
              + 새 아이디어 제안하기
            </button>
          </div>

          {webAppRequests.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-8 space-y-2">
              <Lightbulb className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">아직 신청된 아이디어가 없습니다</h3>
              <p className="text-xs text-slate-400">부스 운영을 개선할 웹앱이나 아이디어를 제안해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {webAppRequests.map(req => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl bg-slate-900/90 border transition space-y-3 ${
                    req.status === 'pending'
                      ? 'border-amber-500/40'
                      : req.status === 'approved'
                      ? 'border-emerald-500/40'
                      : 'border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white">{req.title}</span>
                    {req.status === 'pending' ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        승인 대기 중
                      </span>
                    ) : req.status === 'approved' ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        승인 완료
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        반려됨
                      </span>
                    )}
                  </div>

                  {req.summary && <p className="text-xs text-indigo-300">{req.summary}</p>}
                  <p className="text-xs text-slate-300 leading-relaxed">{req.description}</p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400">
                      <strong>제안자:</strong> {req.applicantName} {req.applicantCode && `(코드: ${req.applicantCode})`}
                    </div>
                    {req.boothBenefit && (
                      <div className="text-emerald-300">
                        🎯 <strong>기대 효과:</strong> {req.boothBenefit}
                      </div>
                    )}
                    {req.status === 'rejected' && req.rejectionReason && (
                      <div className="mt-2 p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300 font-medium">
                        ⚠️ <strong>반려 사유:</strong> {req.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1">
                    신청일시: {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: 웹앱/아이디어 등록 및 관리자 승인 받기 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                  <Lightbulb className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    웹앱 & 부스 운영 아이디어 승인 신청서
                  </h3>
                  <p className="text-xs text-slate-400">
                    부스에 적용할 소프트웨어/아이디어를 입력하고 관리자에게 승인을 요청합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>관리자에게 승인 요청이 성공적으로 전송되었습니다!</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>신청 운영자 이름 *</span>
                  {currentOperator && (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      ✓ {currentOperator.name} ({currentOperator.accessCode})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder="홍길동"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">웹앱/아이디어 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 부스 실시간 로봇 배터리 잔량 모니터"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">카테고리</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as WebAppCategory)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="booth_operation">부스 현장 운영 지원</option>
                  <option value="robot_control">로봇 원격 제어 및 모니터링</option>
                  <option value="visitor_interaction">관람객 인터랙션</option>
                  <option value="internal_tool">동아리 내부 도구</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">한 줄 요약</label>
                <input
                  type="text"
                  placeholder="예: 경기장 내 로봇들의 전압을 블루투스로 실시간 표시"
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">상세 내용 및 기능</label>
                <textarea
                  rows={3}
                  placeholder="아이디어의 구체적인 내용 및 활용 방안을 작성해 주세요."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">부스 운영 기대 효과</label>
                <input
                  type="text"
                  placeholder="예: 배터리 방전 사고 사전 방지"
                  value={boothBenefit}
                  onChange={e => setBoothBenefit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitSuccess}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>관리자에게 승인 받기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
