export type HeroId = 'iron-hafiz' | 'captain-noor' | 'spidey-reciter' | 'wakanda-guardian' | 'thunder-qari';

export interface HeroTheme {
  id: HeroId;
  name: string;
  alias: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientClass: string;
  badgeBg: string;
}

export interface DailyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
  murajaatPages: number;
  murajaatMark: number; // 1-10
  juzHaliPages: number;
  juzHaliMark: number; // 1-10
  jadeedAyats: number;
  jadeedMark: number; // 1-10
  jadeedNote?: string;
  xpEarned: number;
}

export interface TreatItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface WonTreatRecord {
  id: string;
  treatId: string;
  label: string;
  emoji: string;
  wonAt: string; // ISO timestamp
  source: 'short-term-wheel' | 'long-term-grand' | 'parent-bonus';
  delivered: boolean;
}

export interface ShortTermGoal {
  title: string;
  targetAyats: number;
  currentAyats: number;
  bonusSpins: number;
}

export interface LongTermGoal {
  title: string;
  unit: 'ayats' | 'pages';
  targetValue: number;
  currentValue: number;
  grandTreatLabel: string;
  grandTreatEmoji: string;
  claimed: boolean;
}

export interface AppSettings {
  childName: string;
  heroId: HeroId;
  parentPin: string;
  soundEnabled: boolean;
  defaultMurajaatPages: number;
  defaultJuzHaliPages: number;
  ayatsPerPage: number;
  pagesPerSipara: number;
}

export interface AppState {
  settings: AppSettings;
  xp: number;
  shortTermGoal: ShortTermGoal;
  longTermGoal: LongTermGoal;
  treats: TreatItem[];
  wonTreats: WonTreatRecord[];
  logs: DailyLogEntry[];
}

export type AppTab = 'home' | 'trends' | 'vault' | 'parent';
