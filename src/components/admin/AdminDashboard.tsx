import React, { useState } from 'react';
import { Festival, Member, Robot, WebAppIdea, BoothItem, SubTeam } from '../../types';
import { BoothSimulator } from './BoothSimulator';
import { AdminFestivals } from './AdminFestivals';
import { AdminMembers } from './AdminMembers';
import { AdminWebApps } from './AdminWebApps';
import { AdminRobots } from './AdminRobots';
import { 
  Move, Calendar, Users, Smartphone, Bot, Database, 
  LogOut, ArrowLeft, ShieldCheck, Download, Upload, RefreshCw, Check
} from 'lucide-react';
import { exportAllDataAsJSON, importAllDataFromJSON, resetAllDataToDefault } from '../../services/storage';

interface AdminDashboardProps {
  festivals: Festival[];
  activeFestival: Festival;
  members: Member[];
  robots: Robot[];
  webApps: WebAppIdea[];
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
  onLaunchInteractive: (type: 'queue' | 'controller' | 'quiz' | 'guestbook') => void;
  onExitAdmin: () => void;
  onLogoutAdmin: () => void;
  onReloadAllData: () => void;
}

type AdminTab = 'simulator' | 'festivals' | 'members' | 'webapps' | 'robots' | 'backup';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  festivals,
  activeFestival,
  members,
  robots,
  webApps,
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
  onLaunchInteractive,
  onExitAdmin,
  onLogoutAdmin,
  onReloadAllData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('simulator');
  const [importStatus, setImportStatus] = useState<string | null>(null);

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
    if (confirm('정말로 모든 설정을 용인청소년수련관 K.F.C. 기본 데이터로 복원하시겠습니까?')) {
      resetAllDataToDefault();
      onReloadAllData();
      alert('초기 기본값으로 복원되었습니다.');
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
                  ADMIN AUTHORIZED
                </span>
              </div>
              <p className="text-xs text-slate-400">용인시청소년수련관 로봇동아리 K.F.C. 부스 관제실</p>
            </div>
          </div>

          {/* Active festival quick switch & Exit */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 hidden sm:inline">현재 편집 축제:</span>
              <select
                value={activeFestival.id}
                onChange={e => onSelectActiveFestival(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none"
              >
                {festivals.map(f => (
                  <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                    {f.name} ({f.boothNumber})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onExitAdmin}
              className="py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">부스 안내 뷰로 보기</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition"
              title="관리자 로그아웃"
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
            { id: 'members', label: '부원 명단 & 소팀 배정', icon: Users },
            { id: 'webapps', label: '웹앱 & 아이디어 관리', icon: Smartphone },
            { id: 'robots', label: '출전 로봇 & 하드웨어', icon: Bot },
            { id: 'backup', label: '데이터 백업 / 복원', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`py-2 px-3.5 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && (
          <BoothSimulator
            festival={activeFestival}
            onSaveLayout={onSaveBoothLayout}
          />
        )}

        {activeTab === 'festivals' && (
          <AdminFestivals
            festivals={festivals}
            activeFestivalId={activeFestival.id}
            onSelectActive={onSelectActiveFestival}
            onAddFestival={onAddFestival}
            onUpdateFestival={onUpdateFestival}
            onDeleteFestival={onDeleteFestival}
          />
        )}

        {activeTab === 'members' && (
          <AdminMembers
            members={members}
            activeFestival={activeFestival}
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
            onLaunchInteractive={onLaunchInteractive}
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
                부스 운영 데이터 백업 및 복원
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                작성한 부스 배치도, 인원 배치표, 로봇 스펙, 웹앱 아이디어 데이터를 안전하게 보관하거나 다른 팀원과 공유할 수 있습니다.
              </p>
            </div>

            {importStatus && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                {importStatus}
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">데이터 파일 다운로드 (JSON)</div>
                  <div className="text-xs text-slate-400 mt-0.5">현재 모든 설정과 부스 배치도를 파일로 저장합니다.</div>
                </div>
                <button
                  onClick={handleDownloadJSON}
                  className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow"
                >
                  <Download className="w-4 h-4" /> 내보내기
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">데이터 파일 불러오기 (JSON)</div>
                  <div className="text-xs text-slate-400 mt-0.5">저장해 둔 백업 JSON 파일을 업로드하여 복원합니다.</div>
                </div>
                <label className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                  <Upload className="w-4 h-4" /> 불러오기
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-rose-300">초기 기본 데이터로 리셋</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    용인시청소년수련관 로봇동아리 K.F.C.의 공식 기본 프리셋으로 초기화합니다.
                  </div>
                </div>
                <button
                  onClick={handleResetDefaults}
                  className="py-2 px-3.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-4 h-4" /> 기본값 복원
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
