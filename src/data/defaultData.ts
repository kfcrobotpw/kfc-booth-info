import { Festival, Member, Robot, WebAppIdea } from '../types';

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_ROBOTS: Robot[] = [];

export const INITIAL_WEB_APPS: WebAppIdea[] = [];

export const INITIAL_FESTIVALS: Festival[] = [
  {
    id: 'fest-1',
    name: 'K.F.C. 로봇동아리 축제 부스',
    date: '',
    timeRange: '',
    location: '',
    boothNumber: '',
    theme: '',
    status: 'upcoming',
    boothDimensions: {
      widthMeters: 6,
      depthMeters: 4,
    },
    description: '',
    targetAudience: '',
    assignedMemberIds: [],
    assignedRobotIds: [],
    assignedAppIds: [],
    subteams: [],
    layoutItems: [],
    timeline: [],
    safetyRules: [],
  },
];
