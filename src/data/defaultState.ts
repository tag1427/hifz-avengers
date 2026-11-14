import type { AppState, DailyLogEntry, TreatItem } from '../types/hifz';

export const STORAGE_KEY = 'hifz_avengers_state_v1';

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysAgoDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return getLocalDateString(d);
}

export const DEFAULT_TREATS: TreatItem[] = [
  { id: 'treat-1', label: 'Ice Cream Sundae', emoji: '🍦', color: '#f97316' },
  { id: 'treat-2', label: '30m Extra Gaming', emoji: '🎮', color: '#3b82f6' },
  { id: 'treat-3', label: 'Marvel Comic / Toy', emoji: '🦸‍♂️', color: '#dc2626' },
  { id: 'treat-4', label: 'Pick Dinner Menu', emoji: '🍕', color: '#eab308' },
  { id: 'treat-5', label: 'Movie Night Choice', emoji: '🍿', color: '#8b5cf6' },
  { id: 'treat-6', label: 'Stay Up 30m Late', emoji: '🌙', color: '#10b981' },
];

export function createDemoLogs(): DailyLogEntry[] {
  const samples = [
    { daysAgo: 6, murajaatPages: 10, murajaatMark: 8, juzHaliPages: 4, juzHaliMark: 9, jadeedAyats: 5, jadeedMark: 9, jadeedNote: 'Surah Al-Mulk' },
    { daysAgo: 5, murajaatPages: 10, murajaatMark: 9, juzHaliPages: 3, juzHaliMark: 8, jadeedAyats: 6, jadeedMark: 10, jadeedNote: 'Surah Al-Mulk' },
    { daysAgo: 4, murajaatPages: 10, murajaatMark: 9, juzHaliPages: 4, juzHaliMark: 9, jadeedAyats: 5, jadeedMark: 8, jadeedNote: 'Surah Al-Mulk' },
    { daysAgo: 3, murajaatPages: 10, murajaatMark: 10, juzHaliPages: 4, juzHaliMark: 10, jadeedAyats: 7, jadeedMark: 9, jadeedNote: 'Surah Al-Qalam' },
    { daysAgo: 2, murajaatPages: 10, murajaatMark: 8, juzHaliPages: 3, juzHaliMark: 9, jadeedAyats: 5, jadeedMark: 9, jadeedNote: 'Surah Al-Qalam' },
    { daysAgo: 1, murajaatPages: 10, murajaatMark: 10, juzHaliPages: 4, juzHaliMark: 9, jadeedAyats: 6, jadeedMark: 10, jadeedNote: 'Surah Al-Qalam' },
  ];

  return samples.map((s, idx) => {
    const dStr = daysAgoDateString(s.daysAgo);
    const xpEarned =
      s.murajaatMark * 8 +
      s.juzHaliMark * 8 +
      s.jadeedMark * 10 +
      s.jadeedAyats * 12;
    return {
      id: `demo-log-${idx + 1}`,
      date: dStr,
      createdAt: `${dStr}T17:30:00`,
      murajaatPages: s.murajaatPages,
      murajaatMark: s.murajaatMark,
      juzHaliPages: s.juzHaliPages,
      juzHaliMark: s.juzHaliMark,
      jadeedAyats: s.jadeedAyats,
      jadeedMark: s.jadeedMark,
      jadeedNote: s.jadeedNote,
      xpEarned,
    };
  });
}

export function createDemoState(): AppState {
  const logs = createDemoLogs();
  const totalXp = logs.reduce((sum, l) => sum + l.xpEarned, 0);

  return {
    settings: {
      childName: 'Little Champion',
      heroId: 'iron-hafiz',
      parentPin: '1234',
      soundEnabled: true,
      defaultMurajaatPages: 10,
      defaultJuzHaliPages: 4,
      ayatsPerPage: 15,
      pagesPerSipara: 20,
    },
    xp: totalXp,
    shortTermGoal: {
      title: "This Week's Jadeed Target",
      targetAyats: 20,
      currentAyats: 16,
      bonusSpins: 0,
    },
    longTermGoal: {
      title: 'Conquer Juz 29 (Sipara Mission)',
      unit: 'ayats',
      targetValue: 300,
      currentValue: 135,
      grandTreatLabel: 'LEGO Marvel Avengers Quinjet',
      grandTreatEmoji: '🚀',
      claimed: false,
    },
    treats: DEFAULT_TREATS.map((t) => ({ ...t })),
    wonTreats: [
      {
        id: 'won-demo-1',
        treatId: 'treat-1',
        label: 'Ice Cream Sundae',
        emoji: '🍦',
        wonAt: `${daysAgoDateString(3)}T19:00:00`,
        source: 'short-term-wheel',
        delivered: true,
      },
    ],
    logs,
  };
}

export function createFreshState(): AppState {
  return {
    settings: {
      childName: 'Little Champion',
      heroId: 'iron-hafiz',
      parentPin: '1234',
      soundEnabled: true,
      defaultMurajaatPages: 10,
      defaultJuzHaliPages: 4,
      ayatsPerPage: 15,
      pagesPerSipara: 20,
    },
    xp: 0,
    shortTermGoal: {
      title: "This Week's Jadeed Target",
      targetAyats: 20,
      currentAyats: 0,
      bonusSpins: 0,
    },
    longTermGoal: {
      title: 'Complete 1 Full Sipara (Juz)',
      unit: 'ayats',
      targetValue: 300,
      currentValue: 0,
      grandTreatLabel: 'Special Family Outing & Marvel Gift',
      grandTreatEmoji: '🏆',
      claimed: false,
    },
    treats: DEFAULT_TREATS.map((t) => ({ ...t })),
    wonTreats: [],
    logs: [],
  };
}

export function normalizeAppState(parsed: Partial<AppState>): AppState {
  const fallback = createDemoState();
  return {
    settings: { ...fallback.settings, ...(parsed.settings ?? {}) },
    xp: typeof parsed.xp === 'number' ? parsed.xp : fallback.xp,
    shortTermGoal: { ...fallback.shortTermGoal, ...(parsed.shortTermGoal ?? {}) },
    longTermGoal: { ...fallback.longTermGoal, ...(parsed.longTermGoal ?? {}) },
    treats: Array.isArray(parsed.treats) && parsed.treats.length > 0 ? parsed.treats : fallback.treats,
    wonTreats: Array.isArray(parsed.wonTreats) ? parsed.wonTreats : fallback.wonTreats,
    logs: Array.isArray(parsed.logs) ? parsed.logs : fallback.logs,
  };
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDemoState();
    }
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return normalizeAppState(parsed);
  } catch {
    return createDemoState();
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export type ServerFetchResult =
  | { reachable: true; state: AppState | null }
  | { reachable: false };

export async function fetchServerState(): Promise<ServerFetchResult> {
  try {
    const res = await fetch('/api/state', {
      method: 'GET',
      cache: 'no-store',
    });
    if (!res.ok) return { reachable: false };
    const data = (await res.json()) as { state?: Partial<AppState> | null };
    if (!data || !('state' in data)) return { reachable: false };
    return {
      reachable: true,
      state: data.state ? normalizeAppState(data.state) : null,
    };
  } catch {
    return { reachable: false };
  }
}

export async function saveServerState(state: AppState): Promise<boolean> {
  try {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
