import React, { useState, useEffect } from 'react';
import { 
  Festival, Member, Robot, WebAppIdea, BoothItem, SubTeam, 
  RobotDeploymentRequest, WebAppIdeaRequest 
} from './types';
import { 
  loadFestivals, saveFestivals, loadActiveFestivalId, saveActiveFestivalId,
  loadMembers, saveMembers, loadRobots, saveRobots,
  loadWebApps, saveWebApps, checkIsAdmin, setAdminAuth,
  getStoredOperatorCode, saveStoredOperatorCode,
  loadRobotRequests, saveRobotRequests,
  loadWebAppRequests, saveWebAppRequests
} from './services/storage';
import { 
  subscribeToFirestoreSync,
  syncFestivalToFirestore,
  deleteFestivalFromFirestore,
  syncMemberToFirestore,
  deleteMemberFromFirestore,
  syncRobotToFirestore,
  deleteRobotFromFirestore,
  syncWebAppToFirestore,
  deleteWebAppFromFirestore,
  syncActiveFestivalIdToFirestore,
  syncRobotRequestToFirestore,
  deleteRobotRequestFromFirestore,
  syncWebAppRequestToFirestore,
  deleteWebAppRequestFromFirestore,
  purgeFirestoreDummyTestData
} from './services/firestoreSync';

// Public Components
import { Navbar } from './components/Navbar';
import { PublicOverview } from './components/public/PublicOverview';
import { SubteamsView } from './components/public/SubteamsView';
import { BoothFloorPlanViewer } from './components/public/BoothFloorPlanViewer';
import { RobotsGallery } from './components/public/RobotsGallery';
import { WebAppsShowcase } from './components/public/WebAppsShowcase';
import { FestivalsCalendar } from './components/public/FestivalsCalendar';
import { OperatorLoginModal } from './components/public/OperatorLoginModal';
import { OperatorFullScreenLogin } from './components/public/OperatorFullScreenLogin';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

export default function App() {
  // Master Data State
  const [festivals, setFestivals] = useState<Festival[]>(() => loadFestivals());
  const [activeFestivalId, setActiveFestivalId] = useState<string>(() => loadActiveFestivalId());
  const [members, setMembers] = useState<Member[]>(() => loadMembers());
  const [robots, setRobots] = useState<Robot[]>(() => loadRobots());
  const [webApps, setWebApps] = useState<WebAppIdea[]>(() => loadWebApps());

  // Deployment Requests State (Pending / Approved / Rejected)
  const [robotRequests, setRobotRequests] = useState<RobotDeploymentRequest[]>(() => loadRobotRequests());
  const [webAppRequests, setWebAppRequests] = useState<WebAppIdeaRequest[]>(() => loadWebAppRequests());

  // Booth Operator Session (Personalized experience)
  const [currentOperator, setCurrentOperator] = useState<Member | null>(null);
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState<boolean>(false);

  // Cloud Sync State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'connected' | 'syncing' | 'error' | 'offline'>('connected');

  // UI States
  const [isAdmin, setIsAdmin] = useState<boolean>(() => checkIsAdmin());
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activePublicTab, setActivePublicTab] = useState<string>('overview');

  // Active Festival Reference
  const activeFestival = festivals.find(f => f.id === activeFestivalId) || festivals[0];

  // 1. Sync operator from stored code
  useEffect(() => {
    purgeFirestoreDummyTestData().catch(console.warn);
  }, []);

  useEffect(() => {
    const storedCode = getStoredOperatorCode();
    if (storedCode && members.length > 0) {
      const matched = members.find(m => (m.accessCode || '').toUpperCase() === storedCode.toUpperCase());
      if (matched) {
        setCurrentOperator(matched);
      }
    }
  }, [members]);

  // 2. Firebase Real-time Firestore Sync (Cross-Device Sync)
  useEffect(() => {
    const unsub = subscribeToFirestoreSync({
      onFestivals: serverFestivals => {
        setFestivals(serverFestivals);
        saveFestivals(serverFestivals);
      },
      onMembers: serverMembers => {
        setMembers(serverMembers);
        saveMembers(serverMembers);
      },
      onRobots: serverRobots => {
        setRobots(serverRobots);
        saveRobots(serverRobots);
      },
      onWebApps: serverWebApps => {
        setWebApps(serverWebApps);
        saveWebApps(serverWebApps);
      },
      onRobotRequests: serverRequests => {
        setRobotRequests(serverRequests);
        saveRobotRequests(serverRequests);
      },
      onWebAppRequests: serverRequests => {
        setWebAppRequests(serverRequests);
        saveWebAppRequests(serverRequests);
      },
      onActiveFestivalId: serverActiveId => {
        if (serverActiveId) {
          setActiveFestivalId(serverActiveId);
          saveActiveFestivalId(serverActiveId);
        }
      },
      onStatusChange: status => {
        setCloudSyncStatus(status);
      },
    });

    return () => unsub();
  }, []);

  // 3. Admin Access: Strictly triggered ONLY via URL path /admin or hash #/admin
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isAdminUrl =
        path === '/admin' ||
        path === '/admin/' ||
        path.endsWith('/admin') ||
        path.endsWith('/admin/') ||
        path.includes('/admin') ||
        hash === '#admin' ||
        hash === '#/admin' ||
        hash.includes('admin');

      if (isAdminUrl) {
        if (checkIsAdmin()) {
          setIsAdmin(true);
          setIsAdminView(true);
          setIsLoginModalOpen(false);
        } else {
          setIsAdminView(false);
          setIsLoginModalOpen(true);
        }
      } else {
        setIsAdminView(false);
        setIsLoginModalOpen(false);
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // 4. Secret Admin Shortcut: Ctrl+Shift+A or Alt+A (Invisible to regular users)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        if (checkIsAdmin()) {
          setIsAdmin(true);
          setIsAdminView(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshAllData = () => {
    setFestivals(loadFestivals());
    setActiveFestivalId(loadActiveFestivalId());
    setMembers(loadMembers());
    setRobots(loadRobots());
    setWebApps(loadWebApps());
    setRobotRequests(loadRobotRequests());
    setWebAppRequests(loadWebAppRequests());
  };

  // Switch Active Festival (Syncs to Cloud)
  const handleSelectActiveFestival = (id: string) => {
    setActiveFestivalId(id);
    saveActiveFestivalId(id);
    syncActiveFestivalIdToFirestore(id).catch(err => {
      console.warn('Sync active fest fallback', err);
    });
  };

  // Festival CRUD
  const handleAddFestival = (newFest: Festival) => {
    const updated = [newFest, ...festivals];
    setFestivals(updated);
    saveFestivals(updated);
    handleSelectActiveFestival(newFest.id);
    syncFestivalToFirestore(newFest).catch(err => {
      console.warn('Sync add festival fallback', err);
    });
  };

  const handleUpdateFestival = (updatedFest: Festival) => {
    const updated = festivals.map(f => (f.id === updatedFest.id ? updatedFest : f));
    setFestivals(updated);
    saveFestivals(updated);
    syncFestivalToFirestore(updatedFest).catch(err => {
      console.warn('Sync update festival fallback', err);
    });
  };

  const handleDeleteFestival = (id: string) => {
    const updated = festivals.filter(f => f.id !== id);
    setFestivals(updated);
    saveFestivals(updated);
    if (activeFestivalId === id && updated.length > 0) {
      handleSelectActiveFestival(updated[0].id);
    }
    deleteFestivalFromFirestore(id).catch(err => {
      console.warn('Sync delete festival fallback', err);
    });
  };

  // Save Booth Simulator Layout
  const handleSaveBoothLayout = (items: BoothItem[]) => {
    if (!activeFestival) return;
    const updatedFest: Festival = {
      ...activeFestival,
      layoutItems: items,
    };
    handleUpdateFestival(updatedFest);
  };

  // Subteams Update
  const handleUpdateSubteams = (subteams: SubTeam[]) => {
    if (!activeFestival) return;
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
    syncMemberToFirestore(newMem).catch(err => {
      console.warn('Sync add member fallback', err);
    });
  };

  const handleUpdateMember = (updatedMem: Member) => {
    const updated = members.map(m => (m.id === updatedMem.id ? updatedMem : m));
    setMembers(updated);
    saveMembers(updated);
    syncMemberToFirestore(updatedMem).catch(err => {
      console.warn('Sync update member fallback', err);
    });
    // If current operator was updated, refresh
    if (currentOperator?.id === updatedMem.id) {
      setCurrentOperator(updatedMem);
    }
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveMembers(updated);
    deleteMemberFromFirestore(id).catch(err => {
      console.warn('Sync delete member fallback', err);
    });
    if (currentOperator?.id === id) {
      setCurrentOperator(null);
      saveStoredOperatorCode(null);
    }
  };

  // Robot CRUD
  const handleAddRobot = (newRobot: Robot) => {
    const updated = [...robots, newRobot];
    setRobots(updated);
    saveRobots(updated);
    syncRobotToFirestore(newRobot).catch(err => {
      console.warn('Sync add robot fallback', err);
    });
  };

  const handleUpdateRobot = (updatedRobot: Robot) => {
    const updated = robots.map(r => (r.id === updatedRobot.id ? updatedRobot : r));
    setRobots(updated);
    saveRobots(updated);
    syncRobotToFirestore(updatedRobot).catch(err => {
      console.warn('Sync update robot fallback', err);
    });
  };

  const handleDeleteRobot = (id: string) => {
    const updated = robots.filter(r => r.id !== id);
    setRobots(updated);
    saveRobots(updated);
    deleteRobotFromFirestore(id).catch(err => {
      console.warn('Sync delete robot fallback', err);
    });
  };

  // WebApp CRUD
  const handleAddWebApp = (newApp: WebAppIdea) => {
    const updated = [newApp, ...webApps];
    setWebApps(updated);
    saveWebApps(updated);
    syncWebAppToFirestore(newApp).catch(err => {
      console.warn('Sync add web app fallback', err);
    });
  };

  const handleUpdateWebApp = (updatedApp: WebAppIdea) => {
    const updated = webApps.map(w => (w.id === updatedApp.id ? updatedApp : w));
    setWebApps(updated);
    saveWebApps(updated);
    syncWebAppToFirestore(updatedApp).catch(err => {
      console.warn('Sync update web app fallback', err);
    });
  };

  const handleDeleteWebApp = (id: string) => {
    const updated = webApps.filter(w => w.id !== id);
    setWebApps(updated);
    saveWebApps(updated);
    deleteWebAppFromFirestore(id).catch(err => {
      console.warn('Sync delete web app fallback', err);
    });
  };

  // Operator Actions
  const handleOperatorLoginSuccess = (operator: Member) => {
    saveStoredOperatorCode(operator.accessCode);
    setCurrentOperator(operator);
  };

  const handleOperatorLogout = () => {
    saveStoredOperatorCode(null);
    setCurrentOperator(null);
  };

  // Request Submission Actions
  const handleSubmitRobotRequest = (req: RobotDeploymentRequest) => {
    const updated = [req, ...robotRequests];
    setRobotRequests(updated);
    saveRobotRequests(updated);
    syncRobotRequestToFirestore(req).catch(console.warn);
  };

  const handleSubmitWebAppRequest = (req: WebAppIdeaRequest) => {
    const updated = [req, ...webAppRequests];
    setWebAppRequests(updated);
    saveWebAppRequests(updated);
    syncWebAppRequestToFirestore(req).catch(console.warn);
  };

  // Admin Approval / Rejection Actions
  const handleApproveRobotRequest = (reqId: string) => {
    const req = robotRequests.find(r => r.id === reqId);
    if (!req) return;
    const updatedReq: RobotDeploymentRequest = {
      ...req,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
    };
    const updatedRequests = robotRequests.map(r => r.id === reqId ? updatedReq : r);
    setRobotRequests(updatedRequests);
    saveRobotRequests(updatedRequests);
    syncRobotRequestToFirestore(updatedReq).catch(console.warn);

    // Add to robots list if not present
    const alreadyExists = robots.some(r => r.name.toLowerCase() === req.robotName.toLowerCase());
    if (!alreadyExists) {
      const newRobot: Robot = {
        id: 'r-' + Date.now(),
        name: req.robotName,
        codeName: req.robotName,
        category: req.category,
        description: req.description,
        specs: req.specs,
        demonstrationScenario: req.demonstrationScenario || '관람객 시연 주행',
        batteryType: req.batteryType || 'Li-Po 3S 11.1V',
        operatingVoltage: '11.1V',
        controllerMethod: req.controllerMethod || '2.4GHz 무선 조종기',
        safetyNotes: req.safetyNotes,
        primaryPilotId: req.applicantMemberId?.startsWith('m-') ? req.applicantMemberId : undefined,
        status: 'ready',
        tags: [req.category, '부스투입'],
      };
      handleAddRobot(newRobot);

      if (activeFestival && !activeFestival.assignedRobotIds?.includes(newRobot.id)) {
        const updatedFest = {
          ...activeFestival,
          assignedRobotIds: [...(activeFestival.assignedRobotIds || []), newRobot.id],
        };
        handleUpdateFestival(updatedFest);
      }
    }
  };

  const handleRejectRobotRequest = (reqId: string, reason: string) => {
    const req = robotRequests.find(r => r.id === reqId);
    if (!req) return;
    const updatedReq: RobotDeploymentRequest = {
      ...req,
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: new Date().toISOString(),
    };
    const updatedRequests = robotRequests.map(r => r.id === reqId ? updatedReq : r);
    setRobotRequests(updatedRequests);
    saveRobotRequests(updatedRequests);
    syncRobotRequestToFirestore(updatedReq).catch(console.warn);
  };

  const handleApproveWebAppRequest = (reqId: string) => {
    const req = webAppRequests.find(r => r.id === reqId);
    if (!req) return;
    const updatedReq: WebAppIdeaRequest = {
      ...req,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
    };
    const updatedRequests = webAppRequests.map(r => r.id === reqId ? updatedReq : r);
    setWebAppRequests(updatedRequests);
    saveWebAppRequests(updatedRequests);
    syncWebAppRequestToFirestore(updatedReq).catch(console.warn);

    const alreadyExists = webApps.some(w => w.title.toLowerCase() === req.title.toLowerCase());
    if (!alreadyExists) {
      const newApp: WebAppIdea = {
        id: 'app-' + Date.now(),
        title: req.title,
        category: req.category,
        summary: req.summary,
        description: req.description,
        features: req.features || ['실시간 연동', '부스 지원'],
        devStatus: 'production',
        author: req.applicantName,
        boothBenefit: req.boothBenefit,
      };
      handleAddWebApp(newApp);
    }
  };

  const handleRejectWebAppRequest = (reqId: string, reason: string) => {
    const req = webAppRequests.find(r => r.id === reqId);
    if (!req) return;
    const updatedReq: WebAppIdeaRequest = {
      ...req,
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: new Date().toISOString(),
    };
    const updatedRequests = webAppRequests.map(r => r.id === reqId ? updatedReq : r);
    setWebAppRequests(updatedRequests);
    saveWebAppRequests(updatedRequests);
    syncWebAppRequestToFirestore(updatedReq).catch(console.warn);
  };

  const handleLoginSuccess = () => {
    setAdminAuth(true);
    setIsAdmin(true);
    setIsLoginModalOpen(false);
    setIsAdminView(true);
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    setIsLoginModalOpen(false);
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  const handleLogoutAdmin = () => {
    setAdminAuth(false);
    setIsAdmin(false);
    setIsAdminView(false);
    setIsLoginModalOpen(false);
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  // If in Admin Mode, show the Admin Dashboard
  if (isAdminView) {
    return (
      <AdminDashboard
        festivals={festivals}
        activeFestival={activeFestival}
        members={members}
        robots={robots}
        webApps={webApps}
        robotRequests={robotRequests}
        webAppRequests={webAppRequests}
        onApproveRobotRequest={handleApproveRobotRequest}
        onRejectRobotRequest={handleRejectRobotRequest}
        onApproveWebAppRequest={handleApproveWebAppRequest}
        onRejectWebAppRequest={handleRejectWebAppRequest}
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
        onExitAdmin={handleExitAdmin}
        onLogoutAdmin={handleLogoutAdmin}
        onReloadAllData={refreshAllData}
        cloudSyncStatus={cloudSyncStatus}
      />
    );
  }

  // 5. Strict Gatekeeper: When first accessing, show Full-Screen Login (NO Guest Mode!)
  if (!currentOperator) {
    return (
      <>
        <OperatorFullScreenLogin
          members={members}
          onLoginSuccess={handleOperatorLoginSuccess}
          onAdminRouteRequested={() => setIsLoginModalOpen(true)}
        />
        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => {
            setIsLoginModalOpen(false);
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // Public / Booth Staff View (Authenticated Operator Session)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar: Shows Operator Status, NO admin indicator */}
      <Navbar
        currentTab={activePublicTab}
        onSelectTab={setActivePublicTab}
        festivals={festivals}
        activeFestival={activeFestival}
        onSelectActiveFestival={handleSelectActiveFestival}
        cloudSyncStatus={cloudSyncStatus}
        currentOperator={currentOperator}
        onOpenOperatorLogin={() => setIsOperatorModalOpen(true)}
        onOperatorLogout={handleOperatorLogout}
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
            currentOperator={currentOperator}
            onOpenOperatorLogin={() => setIsOperatorModalOpen(true)}
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
          />
        )}

        {activePublicTab === 'robots' && (
          <RobotsGallery
            robots={robots}
            members={members}
            currentOperator={currentOperator}
            robotRequests={robotRequests}
            onSubmitRobotRequest={handleSubmitRobotRequest}
            onOpenOperatorLogin={() => setIsOperatorModalOpen(true)}
          />
        )}

        {activePublicTab === 'webapps' && (
          <WebAppsShowcase
            webApps={webApps}
            currentOperator={currentOperator}
            webAppRequests={webAppRequests}
            onSubmitWebAppRequest={handleSubmitWebAppRequest}
            onOpenOperatorLogin={() => setIsOperatorModalOpen(true)}
          />
        )}

        {activePublicTab === 'festivals' && (
          <FestivalsCalendar
            festivals={festivals}
            activeFestivalId={activeFestival?.id || ''}
            onSelectActiveFestival={handleSelectActiveFestival}
            onNavigateTab={setActivePublicTab}
          />
        )}
      </main>

      {/* Clean Footer (No public admin access link) */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-bold text-slate-300">
              용인시청소년수련관 소속 로봇동아리 K.F.C. (Korea Fun Club)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              청소년 메이커스 & 로보틱스 엔지니어링 동아리 부스 운영 관제 시스템
            </div>
          </div>
        </div>
      </footer>

      {/* Operator Login Modal (For Booth Staff) */}
      <OperatorLoginModal
        isOpen={isOperatorModalOpen}
        onClose={() => setIsOperatorModalOpen(false)}
        members={members}
        onLoginSuccess={handleOperatorLoginSuccess}
      />

      {/* Admin Login Modal (Triggered ONLY when user visits /admin in URL) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          window.history.pushState(null, '', '/');
          window.dispatchEvent(new Event('popstate'));
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
