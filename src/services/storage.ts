import { Festival, Member, Robot, WebAppIdea, RobotDeploymentRequest, WebAppIdeaRequest } from '../types';
import { INITIAL_FESTIVALS, INITIAL_MEMBERS, INITIAL_ROBOTS, INITIAL_WEB_APPS } from '../data/defaultData';

const STORAGE_KEYS = {
  FESTIVALS: 'kfc_club_festivals_v5',
  ACTIVE_FESTIVAL_ID: 'kfc_club_active_festival_id_v5',
  MEMBERS: 'kfc_club_members_v5',
  ROBOTS: 'kfc_club_robots_v5',
  WEB_APPS: 'kfc_club_webapps_v5',
  ADMIN_AUTH: 'kfc_club_admin_auth_v5',
  ADMIN_VAULT: 'kfc_club_admin_vault_v5',
  OPERATOR_CODE: 'kfc_club_operator_code_v5',
  ROBOT_REQUESTS: 'kfc_club_robot_requests_v5',
  WEBAPP_REQUESTS: 'kfc_club_webapp_requests_v5',
};

// Purge any stale test/demo keys from previous test sessions to ensure clean initialization
try {
  const staleKeywords = ['_clean_v2', '_clean', '_prod_v4', 'kfc_robotics_'];
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && staleKeywords.some(w => k.includes(w))) {
      // Preserve custom admin password if set
      if (k.includes('admin_vault') && !localStorage.getItem(STORAGE_KEYS.ADMIN_VAULT)) {
        const val = localStorage.getItem(k);
        if (val) localStorage.setItem(STORAGE_KEYS.ADMIN_VAULT, val);
      }
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
} catch {
  // Ignore
}

// Simple, memorable operator access code generator (e.g. KFC-72, KFC-85)
export function generateOperatorCode(existingCodes: string[] = []): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let attempt = 0; attempt < 50; attempt++) {
    const num = Math.floor(10 + Math.random() * 90); // 2 digits
    const letter = chars[Math.floor(Math.random() * chars.length)];
    const code = `KFC-${num}${letter}`;
    if (!existingCodes.includes(code)) {
      return code;
    }
  }
  return `KFC-${Math.floor(100 + Math.random() * 900)}`;
}

export const getStoredOperatorCode = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.OPERATOR_CODE);
  } catch {
    return null;
  }
};

export const saveStoredOperatorCode = (code: string | null): void => {
  try {
    if (code) {
      localStorage.setItem(STORAGE_KEYS.OPERATOR_CODE, code.toUpperCase().trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.OPERATOR_CODE);
    }
  } catch (e) {
    console.error('Failed to save operator code', e);
  }
};

export const loadRobotRequests = (): RobotDeploymentRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROBOT_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRobotRequests = (requests: RobotDeploymentRequest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ROBOT_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save robot requests', e);
  }
};

export const loadWebAppRequests = (): WebAppIdeaRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEBAPP_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveWebAppRequests = (requests: WebAppIdeaRequest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEBAPP_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save webapp requests', e);
  }
};

export async function hashPassword(plainText: string): Promise<string> {
  const enc = new TextEncoder().encode(plainText.trim());
  const hash = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface AdminCredentials {
  adminId: string;
  passwordHash: string;
  isConfigured: boolean;
  updatedAt?: string;
}

export const getStoredAdminCredentials = (): AdminCredentials => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_VAULT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.adminId) return parsed;
    }
  } catch {
    // Ignore
  }
  // Default admin credentials: admin / admin (SHA-256)
  return {
    adminId: 'admin',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    isConfigured: false,
  };
};

export const saveAdminCredentials = (adminId: string, passwordHash: string): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_VAULT,
      JSON.stringify({
        adminId: adminId.trim(),
        passwordHash,
        isConfigured: true,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.error('Failed to save admin credentials', e);
  }
};

export const loadFestivals = (): Festival[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FESTIVALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(INITIAL_FESTIVALS));
      return INITIAL_FESTIVALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(INITIAL_FESTIVALS));
    return INITIAL_FESTIVALS;
  } catch {
    return INITIAL_FESTIVALS;
  }
};

export const saveFestivals = (festivals: Festival[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
  } catch (e) {
    console.error('Failed to save festivals', e);
  }
};

export const loadActiveFestivalId = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_FESTIVAL_ID);
    if (stored) return stored;
    return INITIAL_FESTIVALS[0]?.id || '';
  } catch {
    return INITIAL_FESTIVALS[0]?.id || '';
  }
};

export const saveActiveFestivalId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FESTIVAL_ID, id);
  } catch (e) {
    console.error('Failed to save active festival ID', e);
  }
};

export const loadMembers = (): Member[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

export const saveMembers = (members: Member[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members', e);
  }
};

export const loadRobots = (): Robot[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROBOTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveRobots = (robots: Robot[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ROBOTS, JSON.stringify(robots));
  } catch (e) {
    console.error('Failed to save robots', e);
  }
};

export const loadWebApps = (): WebAppIdea[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEB_APPS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveWebApps = (apps: WebAppIdea[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEB_APPS, JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save web apps', e);
  }
};

export const checkIsAdmin = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuth = (isAuth: boolean): void => {
  try {
    if (isAuth) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  } catch {
    // Ignore
  }
};

export const resetAllDataToDefault = (): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(INITIAL_FESTIVALS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FESTIVAL_ID, INITIAL_FESTIVALS[0]?.id || '');
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ROBOTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.WEB_APPS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ROBOT_REQUESTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.WEBAPP_REQUESTS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.OPERATOR_CODE);
  } catch (e) {
    console.error('Failed to reset data', e);
  }
};

export const exportAllDataAsJSON = (): string => {
  return JSON.stringify({
    festivals: loadFestivals(),
    activeFestivalId: loadActiveFestivalId(),
    members: loadMembers(),
    robots: loadRobots(),
    webApps: loadWebApps(),
    exportedAt: new Date().toISOString(),
    club: '용인시청소년수련관 로봇동아리 K.F.C.',
  }, null, 2);
};

export const importAllDataFromJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.festivals && Array.isArray(data.festivals)) {
      saveFestivals(data.festivals);
    }
    if (data.activeFestivalId) {
      saveActiveFestivalId(data.activeFestivalId);
    }
    if (data.members && Array.isArray(data.members)) {
      saveMembers(data.members);
    }
    if (data.robots && Array.isArray(data.robots)) {
      saveRobots(data.robots);
    }
    if (data.webApps && Array.isArray(data.webApps)) {
      saveWebApps(data.webApps);
    }
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
};
