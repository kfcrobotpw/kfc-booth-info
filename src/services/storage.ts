import { Festival, Member, Robot, WebAppIdea } from '../types';
import { INITIAL_FESTIVALS, INITIAL_MEMBERS, INITIAL_ROBOTS, INITIAL_WEB_APPS } from '../data/defaultData';

const STORAGE_KEYS = {
  FESTIVALS: 'kfc_robotics_festivals_v1',
  ACTIVE_FESTIVAL_ID: 'kfc_robotics_active_festival_id_v1',
  MEMBERS: 'kfc_robotics_members_v1',
  ROBOTS: 'kfc_robotics_robots_v1',
  WEB_APPS: 'kfc_robotics_webapps_v1',
  ADMIN_AUTH: 'kfc_robotics_admin_auth_v1',
};

export const loadFestivals = (): Festival[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FESTIVALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(INITIAL_FESTIVALS));
      return INITIAL_FESTIVALS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FESTIVALS;
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
    return INITIAL_FESTIVALS[0].id;
  } catch {
    return INITIAL_FESTIVALS[0].id;
  }
};

export const saveActiveFestivalId = (id: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_FESTIVAL_ID, id);
};

export const loadMembers = (): Member[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEMBERS;
  } catch {
    return INITIAL_MEMBERS;
  }
};

export const saveMembers = (members: Member[]): void => {
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
};

export const loadRobots = (): Robot[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROBOTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROBOTS, JSON.stringify(INITIAL_ROBOTS));
      return INITIAL_ROBOTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ROBOTS;
  } catch {
    return INITIAL_ROBOTS;
  }
};

export const saveRobots = (robots: Robot[]): void => {
  localStorage.setItem(STORAGE_KEYS.ROBOTS, JSON.stringify(robots));
};

export const loadWebApps = (): WebAppIdea[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEB_APPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WEB_APPS, JSON.stringify(INITIAL_WEB_APPS));
      return INITIAL_WEB_APPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WEB_APPS;
  } catch {
    return INITIAL_WEB_APPS;
  }
};

export const saveWebApps = (apps: WebAppIdea[]): void => {
  localStorage.setItem(STORAGE_KEYS.WEB_APPS, JSON.stringify(apps));
};

export const checkIsAdmin = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
};

export const setAdminAuth = (isAuth: boolean): void => {
  if (isAuth) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};

export const resetAllDataToDefault = (): void => {
  localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(INITIAL_FESTIVALS));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_FESTIVAL_ID, INITIAL_FESTIVALS[0].id);
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
  localStorage.setItem(STORAGE_KEYS.ROBOTS, JSON.stringify(INITIAL_ROBOTS));
  localStorage.setItem(STORAGE_KEYS.WEB_APPS, JSON.stringify(INITIAL_WEB_APPS));
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
