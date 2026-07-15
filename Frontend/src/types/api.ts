export interface ApiUser {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  role: 'user' | 'admin' | 'parent';
  profilePicture?: string | null;
  level: number;
  xp: number;
  coins: number;
  badges?: ApiBadge[];
  isActive?: boolean;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiBadge {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  rarity?: string;
  criteriaType?: 'xp' | 'missions' | 'streak' | string;
  criteriaValue?: number;
  xpReward?: number;
  isActive?: boolean;
  earned?: boolean;
  eligible?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthSessionPayload {
  user: ApiUser;
  tokens: AuthTokens;
}

export interface RefreshPayload {
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role?: ApiUser['role'];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  phoneNumber?: string;
}

export interface DashboardPayload {
  user: {
    firstName: string;
    level: number;
    xp: number;
    coins: number;
  };
  stats: {
    totalXP: number;
    currentStreak: number;
    missionsCompleted: number;
    badges: ApiBadge[];
  };
  recentActivity: Array<{
    type: string;
    message: string;
    xpEarned?: number;
    createdAt?: string;
  }>;
  recentMissions: unknown[];
}

export interface MissionSubmitPayload {
  passed: boolean;
  correct: boolean;
  isCompleted: boolean;
  xpEarned?: number;
  coinsEarned?: number;
  totalXP?: number;
  level?: number;
  leveledUp?: boolean;
  unlockedBadges?: ApiBadge[];
  testResults?: unknown[];
  error?: string;
}

export interface GameProgressSyncRequest {
  xpEarned: number;
  currentLevel: number;
  unlockedLevel: number;
  selectedDomain: string;
  selectedDifficulty: string;
}

export interface GameProgressSyncPayload {
  user: ApiUser;
  stats: {
    totalXP: number;
    level: number;
    currentLevel: number;
    unlockedLevel: number;
    selectedDomain: string;
    selectedDifficulty: string;
  };
}
