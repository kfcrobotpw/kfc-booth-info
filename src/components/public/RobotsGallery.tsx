import React, { useState } from 'react';
import { Robot, Member, RobotDeploymentRequest, RobotCategory } from '../../types';
import { 
  Bot, Cpu, Battery, ShieldAlert, CheckCircle2, User, Plus, 
  Send, Clock, XCircle, AlertCircle, Key, Check, ChevronRight
} from 'lucide-react';

interface RobotsGalleryProps {
  robots: Robot[];
  members: Member[];
  currentOperator?: Member | null;
  robotRequests: RobotDeploymentRequest[];
  onSubmitRobotRequest: (req: RobotDeploymentRequest) => void;
  onOpenOperatorLogin?: () => void;
}

export const RobotsGallery: React.FC<RobotsGalleryProps> = ({
  robots,
  members,
  currentOperator,
  robotRequests,
  onSubmitRobotRequest,
  onOpenOperatorLogin,
}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'lineup' | 'requests'>('lineup');

  // Form State
  const [robotName, setRobotName] = useState('');
  const [category, setCategory] = useState<RobotCategory>('quadruped');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState('');
  const [batteryType, setBatteryType] = useState('Li-Po 3S 11.1V 2200mAh');
  const [controllerMethod, setControllerMethod] = useState('2.4GHz 무선 조종기 + 블루투스 앱');
  const [demonstrationScenario, setDemonstrationScenario] = useState('관람객 타깃 장애물 주행 및 시연');
  const [safetyNotes, setSafetyNotes] = useState('비상 정지 킬스위치 구비, 펜스 내 운행 준수');
  const [applicantName, setApplicantName] = useState(currentOperator?.name || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const openModal = () => {
    if (currentOperator) {
      setApplicantName(currentOperator.name);
    }
    setFormError(null);
    setSubmitSuccess(false);
    setIsRequestModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!robotName.trim()) {
      setFormError('투입할 로봇 이름을 입력해 주세요.');
      return;
    }
    const finalApplicantName = (currentOperator?.name || applicantName).trim();
    if (!finalApplicantName) {
      setFormError('신청자(운영자) 이름을 입력해 주세요.');
      return;
    }

    const newRequest: RobotDeploymentRequest = {
      id: 'req-' + Date.now(),
      applicantMemberId: currentOperator?.id || 'guest-' + Date.now(),
      applicantName: finalApplicantName,
      applicantCode: currentOperator?.accessCode || '',
      robotName: robotName.trim(),
      category,
      description: description.trim(),
      specs: specs.trim() || '하드웨어 스펙 등록',
      batteryType: batteryType.trim(),
      controllerMethod: controllerMethod.trim(),
      demonstrationScenario: demonstrationScenario.trim(),
      safetyNotes: safetyNotes.trim() || '현장 안전 수칙 준수',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onSubmitRobotRequest(newRequest);
    setSubmitSuccess(true);
    setTimeout(() => {
      setIsRequestModalOpen(false);
      setSubmitSuccess(false);
      setActiveTab('requests');
      // Reset form
      setRobotName('');
      setDescription('');
      setSpecs('');
    }, 1200);
  };

  const pendingCount = robotRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
              ROBOT LINEUP & DEPLOYMENT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-400" />
            부스 투입 로봇 라인업 & 승인 신청
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            K.F.C. 학생들이 직접 제작한 출전 로봇 제원이며, 운영진이 투입할 로봇을 제안하고 관리자의 승인을 받을 수 있습니다.
          </p>
        </div>

        {/* Action Button: Propose Robot */}
        <div className="flex items-center gap-2">
          <button
            onClick={openModal}
            className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            내가 투입할 로봇 입력 & 승인 받기
          </button>
        </div>
      </div>

      {/* Tabs: Lineup vs Approval Requests */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('lineup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'lineup'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          공식 투입 로봇 목록 ({robots.length}대)
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
          투입 승인 신청 현황 ({robotRequests.length}건)
          {pendingCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: Official Robot Lineup */}
      {activeTab === 'lineup' && (
        <>
          {robots.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 p-8 space-y-3">
              <Bot className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">현재 등록된 출전 로봇이 없습니다</h3>
              <p className="text-xs text-slate-400">
                상단의 <strong>[내가 투입할 로봇 입력 & 승인 받기]</strong> 버튼을 눌러 부스에 투입할 로봇을 신청해 보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {robots.map(robot => {
                const pilot = members.find(m => m.id === robot.primaryPilotId);

                return (
                  <div
                    key={robot.id}
                    className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-5 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                          {robot.codeName || robot.name}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                            robot.status === 'ready'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : robot.status === 'maintenance'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {robot.status === 'ready' ? '출전 준비 완료' : robot.status === 'maintenance' ? '정비/수리 중' : '테스트 주행'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{robot.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{robot.description}</p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {robot.tags?.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* Spec Highlights */}
                      <div className="mt-4 space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-start gap-2 text-slate-300">
                          <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-400">하드웨어/제어 스펙:</strong> {robot.specs || '스펙 등록 완료'}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-slate-300">
                          <Battery className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-400">배터리 사양:</strong> {robot.batteryType || 'Li-Po 3S'} ({robot.operatingVoltage || '11.1V'})
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-slate-300">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-400">안전 유의사항:</strong> {robot.safetyNotes || '안전거리 유지'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>담당 파일럿: <strong>{pilot?.name || '부스 파일럿'}</strong> ({pilot?.grade || 'K.F.C.'})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        제어: {robot.controllerMethod || '자체 컨트롤러'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: Approval Requests List */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              부스 운영진이 등록한 로봇 투입 신청서 목록입니다. 관리자가 검토 후 <strong>[승인]</strong> 처리하면 공식 라인업에 즉시 투입됩니다.
            </div>
            <button
              onClick={openModal}
              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
            >
              + 새 로봇 신청하기
            </button>
          </div>

          {robotRequests.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-8 space-y-2">
              <Clock className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">아직 신청된 로봇이 없습니다</h3>
              <p className="text-xs text-slate-400">내가 제작한 로봇을 부스에 투입하고 싶다면 승인 신청서를 작성해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {robotRequests.map(req => {
                const isMine = currentOperator && req.applicantMemberId === currentOperator.id;

                return (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl bg-slate-900/90 border transition space-y-3 ${
                      req.status === 'pending'
                        ? 'border-amber-500/40 shadow-amber-500/10'
                        : req.status === 'approved'
                        ? 'border-emerald-500/40 shadow-emerald-500/10'
                        : 'border-rose-500/40 shadow-rose-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{req.robotName}</span>
                        {isMine && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                            내 신청
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      {req.status === 'pending' ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          관리자 승인 대기 중
                        </span>
                      ) : req.status === 'approved' ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          승인 완료 (투입 확정)
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          반려됨
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{req.description}</p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <div className="text-slate-400">
                        <strong>신청자:</strong> {req.applicantName} {req.applicantCode && `(코드: ${req.applicantCode})`}
                      </div>
                      <div className="text-slate-400">
                        <strong>제어 방식:</strong> {req.controllerMethod || '자체 제어'}
                      </div>
                      <div className="text-slate-400">
                        <strong>현장 안전 점검:</strong> {req.safetyNotes}
                      </div>
                      {req.status === 'rejected' && req.rejectionReason && (
                        <div className="mt-2 p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300 font-medium">
                          ⚠️ <strong>반려 사유:</strong> {req.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>신청일시: {new Date(req.createdAt).toLocaleString()}</span>
                      {req.status === 'approved' && <span className="text-emerald-400 font-semibold">부스 배치 완료</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REQUEST MODAL: 투입할 로봇 입력해서 관리자에게 승인 받기 */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                  <Bot className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    부스 투입 로봇 승인 신청서
                  </h3>
                  <p className="text-xs text-slate-400">
                    내가 투입할 로봇 정보를 입력하고 관리자에게 승인을 요청합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
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
                  <span>관리자에게 승인 요청이 성공적으로 전송되었습니다! 검토 후 승인 처리됩니다.</span>
                </div>
              )}

              {/* Applicant Info */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>신청 운영자 (본인 이름) *</span>
                  {currentOperator ? (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      ✓ {currentOperator.name} ({currentOperator.accessCode})
                    </span>
                  ) : (
                    onOpenOperatorLogin && (
                      <button
                        type="button"
                        onClick={onOpenOperatorLogin}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        운영자 코드로 자동 채우기
                      </button>
                    )
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

              {/* Robot Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">투입할 로봇 이름 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 4족 보행 쿼드러페드"
                    value={robotName}
                    onChange={e => setRobotName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">로봇 분류 카테고리</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as RobotCategory)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="quadruped">사족보행 로봇 (Quadruped)</option>
                    <option value="mobile_wheeled">메카넘/휠 주행 로봇 (Wheeled)</option>
                    <option value="robotic_arm">다관절 로봇암 (Robotic Arm)</option>
                    <option value="autonomous">자율주행/비전 로봇 (Autonomous)</option>
                    <option value="combat">배틀/격투 로봇 (Combat)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">로봇 설명 및 특징</label>
                <textarea
                  rows={2}
                  placeholder="로봇의 주요 동작 및 특징을 입력해 주세요."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Specs & Controller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">하드웨어/제어 사양</label>
                  <input
                    type="text"
                    placeholder="예: ESP32 + 서보 12개, 3D프린팅 바디"
                    value={specs}
                    onChange={e => setSpecs(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">조종/제어 방식</label>
                  <input
                    type="text"
                    placeholder="예: 2.4GHz 무선 조종기"
                    value={controllerMethod}
                    onChange={e => setControllerMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Battery & Safety */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">배터리 사양</label>
                <input
                  type="text"
                  placeholder="예: Li-Po 3S 11.1V"
                  value={batteryType}
                  onChange={e => setBatteryType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 text-amber-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  현장 필수 안전 점검 및 주의사항 *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="예: 비상 전원 차단 스위치 확인 완료, 경기장 펜스 내에서만 운용, 관람객 직접 접촉 금지"
                  value={safetyNotes}
                  onChange={e => setSafetyNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
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
