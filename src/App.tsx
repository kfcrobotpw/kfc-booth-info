import React, { useState, useEffect } from 'react';
import { Festival, Member, Robot, WebAppIdea, BoothItem, SubTeam } from './types';
import { 
  loadFestivals, saveFestivals, loadActiveFestivalId, saveActiveFestivalId,
  loadMembers, saveMembers, loadRobots, saveRobots,
  loadWebApps, saveWebApps, checkIsAdmin, setAdminAuth
} from './services/storage';

// Public Components
import { Navbar } from './components/Navbar';
import { PublicOverview } from './components/public/PublicOverview';
import { SubteamsView } from './components/public/SubteamsView';
import { BoothFloorPlanViewer } from './components/public/BoothFloorPlanViewer';
import { RobotsGallery } from './components/public/RobotsGallery';
import { WebAppsShowcase } from './components/public/WebAppsShowcase';
import { FestivalsCalendar } from './components/public/FestivalsCalendar';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

// Interactive Web Apps Modals
import { QueueAppModal } from './components/apps/QueueAppModal';
import { ControllerAppModal } from './components/apps/ControllerAppModal';
import { QuizAppModal } from './components/apps/QuizAppModal';
import { CheersAppModal } from './components/apps/CheersAppModal';
import { Shield, Sparkles } from 'lucide-react';

export default function App() {
  // Master Data State
  const [festivals, setFestivals] = useState<Festival[]>(() => loadFestivals());
  const [activeFestivalId, setActiveFestivalId] = useState<string>(() => loadActiveFestivalId());
  const [members, setMembers] = useState<Member[]>(() => loadMembers());
  const [robots, setRobots] = useState<Robot[]>(() => loadRobots());
  const [webApps, setWebApps] = useState<WebAppIdea[]>(() => loadWebApps());

  // UI States
  const [isAdmin, setIsAdmin] = useState<boolean>(() => checkIsAdmin());
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activePublicTab, setActivePublicTab] = useState<string>('overview');
  const [interactiveModal, setInteractiveModal] = useState<'queue' | 'controller' | 'quiz' | 'guestbook' | null>(null);

  // Active Festival Reference
  const activeFestival = festivals.find(f => f.id === activeFestivalId) || festivals[0];

  // Sync /admin URL path checking
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAdminUrl = path.endsWith('/admin') || hash === '#admin';

      if (isAdminUrl) {
        if (checkIsAdmin()) {
          setIsAdmin(true);
          setIsAdminView(true);
        } else {
          setIsLoginModalOpen(true);
        }
      } else {
        setIsAdminView(false);
      }
    };

    // Check on mount
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const refreshAllData = () => {
    setFestivals(loadFestivals());
    setActiveFestivalId(loadActiveFestivalId());
    setMembers(loadMembers());
    setRobots(loadRobots());
    setWebApps(loadWebApps());
  };

  // Switch Active Festival
  const handleSelectActiveFestival = (id: string) => {
    setActiveFestivalId(id);
    saveActiveFestivalId(id);
  };

  // Festival CRUD
  const handleAddFestival = (newFest: Festival) => {
    const updated = [newFest, ...festivals];
    setFestivals(updated);
    saveFestivals(updated);
    handleSelectActiveFestival(newFest.id);
  };

  const handleUpdateFestival = (updatedFest: Festival) => {
    const updated = festivals.map(f => (f.id === updatedFest.id ? updatedFest : f));
    setFestivals(updated);
    saveFestivals(updated);
  };

  const handleDeleteFestival = (id: string) => {
    const updated = festivals.filter(f => f.id !== id);
    setFestivals(updated);
    saveFestivals(updated);
    if (activeFestivalId === id && updated.length > 0) {
      handleSelectActiveFestival(updated[0].id);
    }
  };

  // Save Booth Simulator Layout
  const handleSaveBoothLayout = (items: BoothItem[]) => {
    const updatedFest: Festival = {
      ...activeFestival,
      layoutItems: items,
    };
    handleUpdateFestival(updatedFest);
  };

  // Subteams Update
  const handleUpdateSubteams = (subteams: SubTeam[]) => {
    const updatedFest: Festival = {
      ...activeFestival,
      subteams,
    };
    handleUpdateFestival(updatedFest);
  };

  // Member CRUD
  const handleAddMember = (newMem: Member) => {
    const updated = [...members, newMem];
    setMembers(updated);
    saveMembers(updated);
  };

  const handleUpdateMember = (updatedMem: Member) => {
    const updated = members.map(m => (m.id === updatedMem.id ? updatedMem : m));
    setMembers(updated);
    saveMembers(updated);
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveMembers(updated);
  };

  // Robot CRUD
  const handleAddRobot = (newRobot: Robot) => {
    const updated = [...robots, newRobot];
    setRobots(updated);
    saveRobots(updated);
  };

  const handleUpdateRobot = (updatedRobot: Robot) => {
    const updated = robots.map(r => (r.id === updatedRobot.id ? updatedRobot : r));
    setRobots(updated);
    saveRobots(updated);
  };

  const handleDeleteRobot = (id: string) => {
    const updated = robots.filter(r => r.id !== id);
    setRobots(updated);
    saveRobots(updated);
  };

  // WebApp CRUD
  const handleAddWebApp = (newApp: WebAppIdea) => {
    const updated = [newApp, ...webApps];
    setWebApps(updated);
    saveWebApps(updated);
  };

  const handleUpdateWebApp = (updatedApp: WebAppIdea) => {
    const updated = webApps.map(w => (w.id === updatedApp.id ? updatedApp : w));
    setWebApps(updated);
    saveWebApps(updated);
  };

  const handleDeleteWebApp = (id: string) => {
    const updated = webApps.filter(w => w.id !== id);
    setWebApps(updated);
    saveWebApps(updated);
  };

  // Admin Flow
  const handleOpenAdmin = () => {
    if (isAdmin) {
      setIsAdminView(true);
      window.history.pushState(null, '', '/admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setAdminAuth(true);
    setIsAdmin(true);
    setIsLoginModalOpen(false);
    setIsAdminView(true);
    window.history.pushState(null, '', '/admin');
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    window.history.pushState(null, '', '/');
  };

  const handleLogoutAdmin = () => {
    setAdminAuth(false);
    setIsAdmin(false);
    setIsAdminView(false);
    window.history.pushState(null, '', '/');
  };

  // If in Admin Mode, show the Admin Dashboard
  if (isAdminView) {
    return (
      <>
        <AdminDashboard
          festivals={festivals}
          activeFestival={activeFestival}
          members={members}
          robots={robots}
          webApps={webApps}
          onSelectActiveFestival={handleSelectActiveFestival}
          onAddFestival={handleAddFestival}
          onUpdateFestival={handleUpdateFestival}
          onDeleteFestival={handleDeleteFestival}
          onSaveBoothLayout={handleSaveBoothLayout}
          onAddMember={handleAddMember}
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
          onUpdateSubteams={handleUpdateSubteams}
          onAddRobot={handleAddRobot}
          onUpdateRobot={handleUpdateRobot}
          onDeleteRobot={handleDeleteRobot}
          onAddWebApp={handleAddWebApp}
          onUpdateWebApp={handleUpdateWebApp}
          onDeleteWebApp={handleDeleteWebApp}
          onLaunchInteractive={type => setInteractiveModal(type)}
          onExitAdmin={handleExitAdmin}
          onLogoutAdmin={handleLogoutAdmin}
          onReloadAllData={refreshAllData}
        />

        {/* Interactive Modals */}
        <QueueAppModal
          isOpen={interactiveModal === 'queue'}
          onClose={() => setInteractiveModal(null)}
        />
        <ControllerAppModal
          isOpen={interactiveModal === 'controller'}
          onClose={() => setInteractiveModal(null)}
        />
        <QuizAppModal
          isOpen={interactiveModal === 'quiz'}
          onClose={() => setInteractiveModal(null)}
        />
        <CheersAppModal
          isOpen={interactiveModal === 'guestbook'}
          onClose={() => setInteractiveModal(null)}
        />
      </>
    );
  }

  // Public / Member View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={activePublicTab}
        onSelectTab={setActivePublicTab}
        festivals={festivals}
        activeFestival={activeFestival}
        onSelectActiveFestival={handleSelectActiveFestival}
        isAdmin={isAdmin}
        onOpenAdminLogin={handleOpenAdmin}
      />

      {/* Main Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activePublicTab === 'overview' && (
          <PublicOverview
            festival={activeFestival}
            members={members}
            robots={robots}
            webApps={webApps}
            onNavigateTab={setActivePublicTab}
            onLaunchInteractive={type => setInteractiveModal(type)}
          />
        )}

        {activePublicTab === 'subteams' && (
          <SubteamsView
            festival={activeFestival}
            members={members}
          />
        )}

        {activePublicTab === 'floorplan' && (
          <BoothFloorPlanViewer
            festival={activeFestival}
            onOpenAdminMode={handleOpenAdmin}
          />
        )}

        {activePublicTab === 'robots' && (
          <RobotsGallery
            robots={robots}
            members={members}
            onLaunchController={() => setInteractiveModal('controller')}
          />
        )}

        {activePublicTab === 'webapps' && (
          <WebAppsShowcase
            webApps={webApps}
            onLaunchInteractive={type => setInteractiveModal(type)}
            onOpenAdminMode={handleOpenAdmin}
          />
        )}

        {activePublicTab === 'festivals' && (
          <FestivalsCalendar
            festivals={festivals}
            activeFestivalId={activeFestival.id}
            onSelectActiveFestival={handleSelectActiveFestival}
            onNavigateTab={setActivePublicTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-bold text-slate-300">
              용인시청소년수련관 소속 로봇동아리 K.F.C. (Korea Fantastic Creators)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              청소년 메이커스 & 로보틱스 엔지니어링 동아리 부스 통합 운영 시스템
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdmin}
              className="hover:text-slate-300 transition flex items-center gap-1 text-[11px] bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>관리자 모드 (/admin · id: admin, pw: 1234)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal (Triggered by /admin or button) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Interactive Web Apps Modals */}
      <QueueAppModal
        isOpen={interactiveModal === 'queue'}
        onClose={() => setInteractiveModal(null)}
      />
      <ControllerAppModal
        isOpen={interactiveModal === 'controller'}
        onClose={() => setInteractiveModal(null)}
      />
      <QuizAppModal
        isOpen={interactiveModal === 'quiz'}
        onClose={() => setInteractiveModal(null)}
      />
      <CheersAppModal
        isOpen={interactiveModal === 'guestbook'}
        onClose={() => setInteractiveModal(null)}
      />
    </div>
  );
}
