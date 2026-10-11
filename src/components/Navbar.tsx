import React from 'react';
import { Festival, Member } from '../types';
import { Bot, RefreshCw, Menu, X, Key, LogOut, User } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  festivals: Festival[];
  activeFestival?: Festival;
  onSelectActiveFestival: (id: string) => void;
  cloudSyncStatus?: 'connected' | 'syncing' | 'error' | 'offline';
  currentOperator?: Member | null;
  onOpenOperatorLogin?: () => void;
  onOperatorLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  festivals,
  activeFestival,
  onSelectActiveFestival,
  cloudSyncStatus = 'connected',
  currentOperator,
  onOpenOperatorLogin,
  onOperatorLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'overview', label: '부스 운영 종합' },
    { id: 'subteams', label: '소팀 편성 & 교대표' },
    { id: 'floorplan', label: '부스 배치도' },
    { id: 'robots', label: '투입 로봇' },
    { id: 'webapps', label: '웹앱 & 아이디어' },
    { id: 'festivals', label: '참여 축제 목록' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('overview')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg text-white tracking-wider font-mono">
                    K.F.C.
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    용인시청소년수련관
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  로봇동아리 축제 부스 운영 관제 시스템
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Cloud Sync Indicator + Operator Badge / Login + Festival Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Operator Auth State */}
            {currentOperator ? (
              <div className="flex items-center gap-2 bg-indigo-950/70 border border-indigo-500/40 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div className="flex flex-col text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{currentOperator.name}님</span>
                    <span className="text-[10px] text-amber-300 font-mono hidden sm:inline">
                      ({currentOperator.accessCode})
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-300 truncate max-w-[100px] hidden sm:inline">
                    {currentOperator.role || '운영진'}
                  </span>
                </div>
                {onOperatorLogout && (
                  <button
                    onClick={onOperatorLogout}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition cursor-pointer ml-1"
                    title="운영자 계정 전환 / 로그아웃"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              onOpenOperatorLogin && (
                <button
                  onClick={onOpenOperatorLogin}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">운영자 로그인</span>
                  <span className="sm:hidden">로그인</span>
                </button>
              )
            )}

            {/* Real-time Cloud Sync Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition ${
                cloudSyncStatus === 'connected'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                  : cloudSyncStatus === 'syncing'
                  ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
              }`}
              title="Firebase Firestore 실시간 데이터베이스 연동 상태"
            >
              {cloudSyncStatus === 'syncing' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span className="hidden lg:inline">실시간 연동</span>
            </div>

            {/* Festival Selector */}
            {festivals.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">행사:</span>
                <select
                  value={activeFestival?.id || festivals[0]?.id || ''}
                  onChange={e => onSelectActiveFestival(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer max-w-[130px] truncate"
                >
                  {festivals.map(f => (
                    <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          {currentOperator && (
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-white">
                    {currentOperator.name}님 ({currentOperator.accessCode})
                  </div>
                  <div className="text-[10px] text-indigo-300">
                    {currentOperator.role || '부스 운영진'}
                  </div>
                </div>
              </div>
              {onOperatorLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOperatorLogout();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>로그아웃</span>
                </button>
              )}
            </div>
          )}

          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  currentTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {festivals.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[11px] text-slate-400 block mb-1">축제 선택:</label>
              <select
                value={activeFestival?.id || festivals[0]?.id || ''}
                onChange={e => onSelectActiveFestival(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2 rounded-lg border border-slate-800"
              >
                {festivals.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
