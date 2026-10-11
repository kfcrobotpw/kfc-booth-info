import React, { useState } from 'react';
import { Festival, Member, Robot, WebAppIdea, BoothItem, SubTeam } from '../../types';
import { BoothSimulator } from './BoothSimulator';
import { AdminFestivals } from './AdminFestivals';
import { AdminMembers } from './AdminMembers';
import { AdminWebApps } from './AdminWebApps';
import { AdminRobots } from './AdminRobots';
import { AdminSafetyRules } from './AdminSafetyRules';
import { AdminApprovals } from './AdminApprovals';
import { 
  Move, Calendar, Users, Smartphone, Bot, Database, 
  LogOut, ArrowLeft, ShieldCheck, Download, Upload, RefreshCw, Check, Sparkles,
  ShieldAlert, KeyRound, Lock, X, CheckCircle2, ClipboardCheck
} from 'lucide-react';
import { 
  exportAllDataAsJSON, importAllDataFromJSON, resetAllDataToDefault,
  getStoredAdminCredentials, saveAdminCredentials, hashPassword
} from '../../services/storage';
import { RobotDeploymentRequest, WebAppIdeaRequest } from '../../types';

interface AdminDashboardProps {
  festivals: Festival[];
  activeFestival?: Festival;
  members: Member[];
  robots: Robot[];
  webApps: WebAppIdea[];
  robotRequests?: RobotDeploymentRequest[];
  webAppRequests?: WebAppIdeaRequest[];
  onApproveRobotRequest?: (id: string) => void;
  onRejectRobotRequest?: (id: string, reason: string) => void;
  onApproveWebAppRequest?: (id: string) => void;
  onRejectWebAppRequest?: (id: string, reason: string) => void;
  onSelectActiveFestival: (id: string) => void;
  onAddFestival: (fest: Festival) => void;
  onUpdateFestival: (fest: Festival) => void;
  onDeleteFestival: (id: string) => void;
  onSaveBoothLayout: (items: BoothItem[]) => void;
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onUpdateSubteams: (subteams: SubTeam[]) => void;
  onAddRobot: (robot: Robot) => void;
  onUpdateRobot: (robot: Robot) => void;
  onDeleteRobot: (id: string) => void;
  onAddWebApp: (app: WebAppIdea) => void;
  onUpdateWebApp: (app: WebAppIdea) => void;
  onDeleteWebApp: (id: string) => void;
  onExitAdmin: () => void;
  onLogoutAdmin: () => void;
  onReloadAllData: () => void;
  cloudSyncStatus?: 'connected' | 'syncing' | 'error' | 'offline';
}

type AdminTab = 'simulator' | 'festivals' | 'safety' | 'approvals' | 'members' | 'webapps' | 'robots' | 'backup';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  festivals,
  activeFestival,
  members,
  robots,
  webApps,
  robotRequests = [],
  webAppRequests = [],
  onApproveRobotRequest,
  onRejectRobotRequest,
  onApproveWebAppRequest,
  onRejectWebAppRequest,
  onSelectActiveFestival,
  onAddFestival,
  onUpdateFestival,
  onDeleteFestival,
  onSaveBoothLayout,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onUpdateSubteams,
  onAddRobot,
  onUpdateRobot,
  onDeleteRobot,
  onAddWebApp,
  onUpdateWebApp,
  onDeleteWebApp,
  onExitAdmin,
  onLogoutAdmin,
  onReloadAllData,
  cloudSyncStatus = 'connected',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('simulator');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [newAdminId, setNewAdminId] = useState<string>('');
  const [newAdminPw, setNewAdminPw] = useState<string>('');
  const [newConfirmPw, setNewConfirmPw] = useState<string>('');
  const [securityStatusMsg, setSecurityStatusMsg] = useState<string | null>(null);

  const openSecurityModal = () => {
    const creds = getStoredAdminCredentials();
    setNewAdminId(creds?.adminId || '');
    setNewAdminPw('');
    setNewConfirmPw('');
    setSecurityStatusMsg(null);
    setIsSecurityModalOpen(true);
  };

  const handleSaveSecurityCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId.trim()) {
      setSecurityStatusMsg('아이디를 입력해 주세요.');
      return;
    }
    if (!newAdminPw.trim() || newAdminPw.trim().length < 4) {
      setSecurityStatusMsg('비밀번호는 최소 4자 이상 입력해 주세요.');
      return;
    }
    if (newAdminPw.trim() !== newConfirmPw.trim()) {
      setSecurityStatusMsg('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const hashed = await hashPassword(newAdminPw.trim());
      saveAdminCredentials(newAdminId.trim(), hashed);
      setSecurityStatusMsg('관리자 보안 계정이 성공적으로 변경되었습니다!');
      setTimeout(() => {
        setIsSecurityModalOpen(false);
      }, 1500);
    } catch {
      setSecurityStatusMsg('비밀번호 암호화 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kfc_booth_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content && importAllDataFromJSON(content)) {
        onReloadAllData();
        setImportStatus('데이터를 성공적으로 복원했습니다!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        alert('올바른 JSON 파일 형식이 아닙니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
      resetAllDataToDefault();
      onReloadAllData();
      alert('초기값으로 초기화되었습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="관람객 / 팀원 안내 화면으로 전환"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  K.F.C. 관리자 모드
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  ADMIN
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                    cloudSyncStatus === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}
                  title="다른 기기에서도 동일하게 실시간 반영됩니다"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  Firebase 실시간 동기화
                </span>
              </div>
              <p className="text-xs text-slate-400">용인시청소년수련관 로봇동아리 K.F.C. 부스 관제실</p>
            </div>
          </div>

          {/* Active festival quick switch & Auth & Exit */}
          <div className="flex items-center gap-2 sm:gap-3">
            {festivals.length > 0 && activeFestival && (
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 hidden sm:inline">현재 편집 축제:</span>
                <select
                  value={activeFestival.id}
                  onChange={e => onSelectActiveFestival(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none max-w-[140px] truncate"
                >
                  {festivals.map(f => (
                    <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Change Admin Password / Security Settings */}
            <button
              onClick={openSecurityModal}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="관리자 계정 ID / 비밀번호 변경"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">보안 설정</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">부스 안내 뷰로 보기</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition cursor-pointer"
              title="관리자 모드 닫기"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-1.5 border-t border-slate-800/60 no-scrollbar">
          {[
            { id: 'simulator', label: '부스 배치도 시뮬레이터 (드래그앤드롭)', icon: Move },
            { id: 'festivals', label: '축제 & 행사 관리', icon: Calendar },
            { id: 'safety', label: '현장 필수 안전 수칙', icon: ShieldAlert },
            { 
              id: 'approvals', 
              label: '투입 로봇 & 아이디어 승인 관리', 
              icon: ClipboardCheck,
              badge: robotRequests.filter(r => r.status === 'pending').length + webAppRequests.filter(w => w.status === 'pending').length
            },
            { id: 'members', label: '부원 명단 & 소팀 배정', icon: Users },
            { id: 'webapps', label: '웹앱 & 아이디어 관리', icon: Smartphone },
            { id: 'robots', label: '출전 로봇 & 하드웨어', icon: Bot },
            { id: 'backup', label: '데이터 백업 / 초기화', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`py-2 px-3.5 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && (
          activeFestival ? (
            <BoothSimulator
              festival={activeFestival}
              onSaveLayout={onSaveBoothLayout}
            />
          ) : (
            <div className="text-center py-20 rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-3">
              <Move className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">선택된 축제가 없습니다</h3>
              <p className="text-xs text-slate-400">'축제 & 행사 관리' 탭에서 축제를 먼저 생성해 주세요.</p>
              <button
                onClick={() => setActiveTab('festivals')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                축제 관리 탭으로 이동
              </button>
            </div>
          )
        )}

        {activeTab === 'festivals' && (
          <AdminFestivals
            festivals={festivals}
            activeFestivalId={activeFestival?.id || ''}
            onSelectActive={onSelectActiveFestival}
            onAddFestival={onAddFestival}
            onUpdateFestival={onUpdateFestival}
            onDeleteFestival={onDeleteFestival}
          />
        )}

        {activeTab === 'safety' && (
          <AdminSafetyRules
            festival={activeFestival}
            onUpdateFestival={onUpdateFestival}
          />
        )}

        {activeTab === 'approvals' && (
          <AdminApprovals
            robotRequests={robotRequests}
            webAppRequests={webAppRequests}
            onApproveRobotRequest={onApproveRobotRequest || (() => {})}
            onRejectRobotRequest={onRejectRobotRequest || (() => {})}
            onApproveWebAppRequest={onApproveWebAppRequest || (() => {})}
            onRejectWebAppRequest={onRejectWebAppRequest || (() => {})}
          />
        )}

        {activeTab === 'members' && (
          <AdminMembers
            members={members}
            activeFestival={activeFestival || {
              id: 'none',
              name: '',
              date: '',
              timeRange: '',
              location: '',
              boothNumber: '',
              theme: '',
              status: 'upcoming',
              boothDimensions: { widthMeters: 5, depthMeters: 5 },
              description: '',
              targetAudience: '',
              assignedMemberIds: [],
              assignedRobotIds: [],
              assignedAppIds: [],
              subteams: [],
              layoutItems: [],
              timeline: [],
              safetyRules: [],
            }}
            onAddMember={onAddMember}
            onUpdateMember={onUpdateMember}
            onDeleteMember={onDeleteMember}
            onUpdateFestivalSubteams={onUpdateSubteams}
          />
        )}

        {activeTab === 'webapps' && (
          <AdminWebApps
            webApps={webApps}
            onAddWebApp={onAddWebApp}
            onUpdateWebApp={onUpdateWebApp}
            onDeleteWebApp={onDeleteWebApp}
          />
        )}

        {activeTab === 'robots' && (
          <AdminRobots
            robots={robots}
            members={members}
            onAddRobot={onAddRobot}
            onUpdateRobot={onUpdateRobot}
            onDeleteRobot={onDeleteRobot}
          />
        )}

        {activeTab === 'backup' && (
          <div className="max-w-2xl mx-auto space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                부스 운영 데이터 백업 및 관리
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                작성한 부스 배치도, 인원 배치표, 로봇 스펙, 웹앱 데이터를 파일로 내보내거나 백업할 수 있습니다.
              </p>
            </div>

            {importStatus && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{importStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  JSON 파일로 전체 내보내기
                </div>
                <p className="text-[11px] text-slate-400">
                  현재 등록된 축제, 부원, 로봇, 웹앱 배치도 데이터를 다운로드합니다.
                </p>
                <button
                  onClick={handleDownloadJSON}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition"
                >
                  데이터 백업 다운로드
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  JSON 파일 불러오기
                </div>
                <p className="text-[11px] text-slate-400">
                  이전에 저장해 둔 JSON 백업 파일을 업로드하여 데이터를 복원합니다.
                </p>
                <label className="block w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg text-center cursor-pointer transition">
                  파일 선택 및 복원
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 block">데이터 초기화</span>
                <span className="text-[11px] text-slate-500">모든 로컬 저장 데이터를 빈 상태로 초기화합니다.</span>
              </div>
              <button
                onClick={handleResetDefaults}
                className="py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs rounded-lg transition"
              >
                전체 초기화
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Security Credentials Change Modal */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">관리자 보안 계정 변경</h3>
                  <p className="text-[11px] text-slate-400">아이디 및 비밀번호를 비공개로 직접 재설정합니다</p>
                </div>
              </div>
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSecurityCredentials} className="p-6 space-y-4">
              {securityStatusMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  securityStatusMsg.includes('성공')
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{securityStatusMsg}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                🔒 <strong>보안 수칙:</strong> 설정한 비밀번호는 SHA-256 일방향 해시로 암호화되며, 공용 코드나 외부 문서에 절대 노출 및 공유되지 않습니다.
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">새 관리자 아이디 (ID)</label>
                <input
                  type="text"
                  value={newAdminId}
                  onChange={e => setNewAdminId(e.target.value)}
                  placeholder="관리자 아이디 입력"
                  className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">새 비밀번호 (PW, 4자 이상)</label>
                <input
                  type="password"
                  value={newAdminPw}
                  onChange={e => setNewAdminPw(e.target.value)}
                  placeholder="새 비밀번호 입력"
                  className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={newConfirmPw}
                  onChange={e => setNewConfirmPw(e.target.value)}
                  placeholder="비밀번호 다시 입력"
                  className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  보안 계정 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
