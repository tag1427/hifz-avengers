import confetti from 'canvas-confetti';
import type { AppSettings, DailyLogEntry } from '../types/hifz';
import { getLocalDateString } from '../data/defaultState';

export interface HeroRankInfo {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

const RANK_TITLES = [
  'Cadet Reciter',
  'Shield Apprentice',
  'Ayat Defender',
  'Guardians of the Juz',
  'Surah Striker',
  'Mushaf Avenger',
  'Vibranium Hafiz',
  'Cosmic Qari',
  'Grand Master of Hifz',
];

export function getHeroRank(xp: number): HeroRankInfo {
  const xpPerLevel = 450;
  const level = Math.max(1, Math.floor(xp / xpPerLevel) + 1);
  const currentLevelXp = xp % xpPerLevel;
  const titleIndex = Math.min(level - 1, RANK_TITLES.length - 1);
  return {
    level,
    title: RANK_TITLES[titleIndex],
    currentLevelXp,
    nextLevelXp: xpPerLevel,
    progressPercent: Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100)),
  };
}

export function calculateStreak(logs: DailyLogEntry[]): number {
  if (logs.length === 0) return 0;

  const uniqueDates = new Set(logs.map((l) => l.date));
  const today = new Date();
  const todayStr = getLocalDateString(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // Start counting from today if logged today, else from yesterday if logged yesterday
  let cursor: Date;
  if (uniqueDates.has(todayStr)) {
    cursor = new Date(today);
  } else if (uniqueDates.has(yesterdayStr)) {
    cursor = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;
  while (true) {
    const dateKey = getLocalDateString(cursor);
    if (uniqueDates.has(dateKey)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export interface MarkFeedback {
  label: string;
  badgeColor: string;
  textColor: string;
  emoji: string;
}

export function getMarkFeedback(mark: number): MarkFeedback {
  if (mark === 10) {
    return {
      label: 'AVENGERS PERFECT 10!',
      badgeColor: 'bg-amber-300 border-slate-900',
      textColor: 'text-slate-900',
      emoji: '⚡',
    };
  }
  if (mark >= 8) {
    return {
      label: 'Super Strike!',
      badgeColor: 'bg-emerald-400 border-slate-900',
      textColor: 'text-slate-950',
      emoji: '💥',
    };
  }
  if (mark >= 6) {
    return {
      label: 'Hero Effort!',
      badgeColor: 'bg-sky-300 border-slate-900',
      textColor: 'text-slate-900',
      emoji: '🛡️',
    };
  }
  return {
    label: 'Keep Training!',
    badgeColor: 'bg-orange-300 border-slate-900',
    textColor: 'text-slate-900',
    emoji: '💪',
  };
}

export interface PaceMetrics {
  avgJadeedAyatsPerDay: number;
  avgMurajaatMark: number;
  avgJuzHaliMark: number;
  avgJadeedMark: number;
  overallAvgMark: number;
  totalJadeedAyats: number;
  totalMurajaatPages: number;
  totalJuzHaliPages: number;
}

export function computePaceMetrics(logs: DailyLogEntry[]): PaceMetrics {
  if (logs.length === 0) {
    return {
      avgJadeedAyatsPerDay: 0,
      avgMurajaatMark: 0,
      avgJuzHaliMark: 0,
      avgJadeedMark: 0,
      overallAvgMark: 0,
      totalJadeedAyats: 0,
      totalMurajaatPages: 0,
      totalJuzHaliPages: 0,
    };
  }

  // Group logs by date in case multiple logs happen on one day, take recent up to 14 active days
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const recentWindow = sorted.slice(-14);

  const dayMap = new Map<string, number>();
  for (const entry of recentWindow) {
    dayMap.set(entry.date, (dayMap.get(entry.date) ?? 0) + entry.jadeedAyats);
  }
  const activeDays = Math.max(1, dayMap.size);
  const windowJadeed = recentWindow.reduce((sum, l) => sum + l.jadeedAyats, 0);

  const count = logs.length;
  const avgMurajaatMark = logs.reduce((s, l) => s + l.murajaatMark, 0) / count;
  const avgJuzHaliMark = logs.reduce((s, l) => s + l.juzHaliMark, 0) / count;
  const avgJadeedMark = logs.reduce((s, l) => s + l.jadeedMark, 0) / count;
  const overallAvgMark = (avgMurajaatMark + avgJuzHaliMark + avgJadeedMark) / 3;

  return {
    avgJadeedAyatsPerDay: Number((windowJadeed / activeDays).toFixed(1)),
    avgMurajaatMark: Number(avgMurajaatMark.toFixed(1)),
    avgJuzHaliMark: Number(avgJuzHaliMark.toFixed(1)),
    avgJadeedMark: Number(avgJadeedMark.toFixed(1)),
    overallAvgMark: Number(overallAvgMark.toFixed(1)),
    totalJadeedAyats: logs.reduce((s, l) => s + l.jadeedAyats, 0),
    totalMurajaatPages: logs.reduce((s, l) => s + l.murajaatPages, 0),
    totalJuzHaliPages: logs.reduce((s, l) => s + l.juzHaliPages, 0),
  };
}

export interface PaceForecast {
  ayatsPerDay: number;
  monthAyats: number;
  monthPages: number;
  yearAyats: number;
  yearPages: number;
  yearSiparas: number;
  daysPerSipara: number | null;
  yearsForFullQuran: number | null;
}

export function calculateForecast(ayatsPerDay: number, settings: AppSettings): PaceForecast {
  const safeAyatsPerPage = Math.max(1, settings.ayatsPerPage);
  const safePagesPerSipara = Math.max(1, settings.pagesPerSipara);
  const ayatsPerSipara = safeAyatsPerPage * safePagesPerSipara;
  const totalQuranPages = 30 * safePagesPerSipara;

  const monthAyats = Math.round(ayatsPerDay * 30);
  const monthPages = Number((monthAyats / safeAyatsPerPage).toFixed(1));

  const yearAyats = Math.round(ayatsPerDay * 365);
  const yearPages = Number((yearAyats / safeAyatsPerPage).toFixed(1));
  const yearSiparas = Number((yearPages / safePagesPerSipara).toFixed(1));

  const daysPerSipara = ayatsPerDay > 0 ? Math.ceil(ayatsPerSipara / ayatsPerDay) : null;
  const yearsForFullQuran =
    yearPages > 0 ? Number((totalQuranPages / yearPages).toFixed(1)) : null;

  return {
    ayatsPerDay,
    monthAyats,
    monthPages,
    yearAyats,
    yearPages,
    yearSiparas,
    daysPerSipara,
    yearsForFullQuran,
  };
}

export function fireHeroConfetti(intensity: 'normal' | 'grand' = 'normal'): void {
  const colors = ['#dc2626', '#facc15', '#2563eb', '#22c55e', '#a855f7'];
  if (intensity === 'grand') {
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.55 },
      colors,
    });
    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.65 },
        colors,
      });
    }, 220);
  } else {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.62 },
      colors,
    });
  }
}
