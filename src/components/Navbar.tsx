import React from 'react';
import { Festival } from '../types';
import { Bot, Shield, ChevronDown, Sparkles, ExternalLink, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  festivals: Festival[];
  activeFestival: Festival;
  onSelectActiveFestival: (id: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  festivals,
  activeFestival,
  onSelectActiveFestival,
  isAdmin,
  onOpenAdminLogin,
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
              className="flex items-center gap-2.5 text-left group"
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
                  로봇동아리 축제 부스 관제 안내 시스템
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
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition ${
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

          {/* Right Action: Active Festival Selector + Admin Mode Gateway */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Festival Selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400">행사:</span>
              <select
                value={activeFestival.id}
                onChange={e => onSelectActiveFestival(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                {festivals.map(f => (
                  <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Access Button */}
            <button
              onClick={onOpenAdminLogin}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                isAdmin
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title="관리자 모드 접속 (URL: /admin, id: admin / pw: 1234)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdmin ? '관리자 대시보드' : '관리자 모드 (/admin)'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
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

          <div className="pt-2 border-t border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">축제 선택:</label>
            <select
              value={activeFestival.id}
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
        </div>
      )}
    </header>
  );
};
