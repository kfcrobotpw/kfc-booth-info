export type FestivalStatus = 'upcoming' | 'ongoing' | 'completed';

export type BoothItemType =
  | 'table_long'       // 긴 테이블 1800x600
  | 'table_short'      // 보조 테이블 1200x600
  | 'table_square'     // 정사각 테이블 900x900
  | 'chair_staff'      // 스태프 의자
  | 'chair_visitor'    // 관람객 체험 의자
  | 'arena_mat'        // 로봇 경기장 / 자율주행 매트 (2x2m)
  | 'robot_dock'       // 로봇 정비 & 거치대
  | 'monitor_display'  // 55인치 모니터 / TV 스탠드 (웹앱/홍보용)
  | 'barrier_stanchion'// 대기열 차단봉 벨트
  | 'power_battery'    // 배터리 충전 & 멀티탭 존
  | 'banner_stand'     // X-배너 / 동아리 현수막
  | 'info_desk'        // 접수처 / 태블릿 거치대
  | 'trash_bin'        // 분리수거 / 쓰레기통
  | 'visitor_arrow'    // 관람객 이동 동선 화살표
  | 'zone_box';        // 구역 표시 박스

export type ZoneCategory = 'experience' | 'queue' | 'control' | 'safety' | 'display';

export interface BoothItem {
  id: string;
  type: BoothItemType;
  label: string;
  x: number; // percentage (0 to 100) or canvas pixel
  y: number; // percentage (0 to 100) or canvas pixel
  width: number; // in relative percentage or px
  height: number;
  rotation: number; // 0, 90, 180, 270
  color?: string;
  zone: ZoneCategory;
  assignedStaff?: string;
  assignedRobotOrApp?: string;
  notes?: string;
}

export interface SubTeam {
  id: string;
  name: string;
  roleTitle: string;
  color: string;
  description: string;
  leaderMemberId?: string;
  memberIds: string[];
  shiftTime: string;
  mainLocation: string; // e.g. "부스 전면 체험 테이블", "후방 관제석"
  checklist: string[];
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  timeRange: string;
  location: string;
  boothNumber: string;
  theme: string;
  status: FestivalStatus;
  boothDimensions: {
    widthMeters: number; // e.g. 5m
    depthMeters: number; // e.g. 5m
  };
  description: string;
  targetAudience: string;
  assignedMemberIds: string[];
  assignedRobotIds: string[];
  assignedAppIds: string[];
  subteams: SubTeam[];
  layoutItems: BoothItem[];
  timeline: Array<{
    time: string;
    title: string;
    subteam: string;
    details: string;
  }>;
  safetyRules: string[];
}

export interface Member {
  id: string;
  name: string;
  grade: string;
  role: string;
  skills: string[];
  phone: string;
  emergencyContact: string;
  bio?: string;
  isLeader?: boolean;
  avatarColor: string;
}

export type RobotCategory = 'quadruped' | 'mobile_wheeled' | 'robotic_arm' | 'autonomous' | 'combat';

export interface Robot {
  id: string;
  name: string;
  codeName: string;
  category: RobotCategory;
  description: string;
  specs: string;
  demonstrationScenario: string;
  batteryType: string;
  operatingVoltage: string;
  controllerMethod: string;
  safetyNotes: string;
  primaryPilotId?: string;
  status: 'ready' | 'maintenance' | 'testing';
  tags: string[];
}

export type WebAppCategory = 'booth_operation' | 'robot_control' | 'visitor_interaction' | 'internal_tool';
export type WebAppDevStatus = 'production' | 'in_development' | 'planned_idea';

export interface WebAppIdea {
  id: string;
  title: string;
  category: WebAppCategory;
  summary: string;
  description: string;
  features: string[];
  devStatus: WebAppDevStatus;
  author: string;
  demoUrl?: string;
  interactiveType?: 'queue' | 'controller' | 'quiz' | 'guestbook';
  likesCount?: number;
  boothBenefit: string;
}
