import {
  calculateSiparaProgress,
  getAyatFromSurahLine,
  getSurahInfo,
  getSurahLineFromPosition,
} from './quranMetadata';
import type {
  AppState,
  DailyLogEntry,
  HeroId,
  HifzMultiStore,
  QuranPosition,
  StudentProfile,
  SurahDirection,
  TreatItem,
  WonTreatRecord,
} from '../types/hifz';

export const STORAGE_KEY = 'hifz_avengers_state_v1';
export const STORE_STORAGE_KEY = 'hifz_avengers_store_v2';

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
    { daysAgo: 6, murajaatJuz: 30, murajaatPages: 10, murajaatMark: 8, juzHaliPages: 4, juzHaliMark: 9, jadeedAyats: 5, jadeedMark: 9, jadeedNote: 'Surah Al-Mulk (Ayats 1–5)', jadeedJuz: 29, jadeedSurahNumber: 67, jadeedStartAyat: 1, jadeedEndAyat: 5 },
    { daysAgo: 5, murajaatJuz: 29, murajaatPages: 10, murajaatMark: 9, juzHaliPages: 3, juzHaliMark: 8, jadeedAyats: 6, jadeedMark: 10, jadeedNote: 'Surah Al-Mulk (Ayats 6–11)', jadeedJuz: 29, jadeedSurahNumber: 67, jadeedStartAyat: 6, jadeedEndAyat: 11 },
    { daysAgo: 4, murajaatJuz: 30, murajaatPages: 10, murajaatMark: 9, juzHaliPages: 4, juzHaliMark: 9, jadeedAyats: 5, jadeedMark: 8, jadeedNote: 'Surah Al-Mulk (Ayats 12–16)', jadeedJuz: 29, jadeedSurahNumber: 67, jadeedStartAyat: 12, jadeedEndAyat: 16 },
    { daysAgo: 3, murajaatJuz: 28, murajaatPages: 10, murajaatMark: 10, juzHaliPages: 4, juzHaliMark: 10, jadeedAyats: 7, jadeedMark: 9, jadeedNote: 'Surah Al-Mulk (Ayats 17–23)', jadeedJuz: 29, jadeedSurahNumber: 67, jadeedStartAyat: 17, jadeedEndAyat: 23 },
    { daysAgo: 2, murajaatJuz: 29, murajaatPages: 10, murajaatMark: 8, juzHaliPages: 3, juzHaliMark: 9, jadeedAyats: 5, jadeedMark: 9, jadeedNote: 'Surah Al-Mulk (Ayats 24–28)', jadeedJuz: 29, jadeedSurahNumber: 67, jadeedStartAyat: 24, jadeedEndAyat: 28 },
    { daysAgo: 1, murajaatJuz: 30, murajaatPages: 10, murajaatMark: 10, juzHaliPages: 4, juzHaliMark: 9, jadeedAyats: 6, jadeedMark: 10, jadeedNote: 'Surah Al-Mulk (29–30) → Al-Qalam (1–4)', jadeedJuz: 29, jadeedSurahNumber: 68, jadeedStartAyat: 1, jadeedEndAyat: 4 },
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
      murajaatJuz: s.murajaatJuz,
      murajaatPages: s.murajaatPages,
      murajaatMark: s.murajaatMark,
      juzHaliPages: s.juzHaliPages,
      juzHaliMark: s.juzHaliMark,
      jadeedAyats: s.jadeedAyats,
      jadeedMark: s.jadeedMark,
      jadeedNote: s.jadeedNote,
      jadeedJuz: s.jadeedJuz,
      jadeedSurahNumber: s.jadeedSurahNumber,
      jadeedStartAyat: s.jadeedStartAyat,
      jadeedEndAyat: s.jadeedEndAyat,
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
    quranPosition: {
      juz: 26,
      surahNumber: 50,
      ayatNumber: 17,
      lineNumber: 15,
      surahDirection: 'reverse',
    },
    xp: totalXp,
    shortTermGoal: {
      title: "This Week's Jadeed Target (Lines)",
      targetAyats: 30,
      currentAyats: 21,
      bonusSpins: 0,
    },
    longTermGoal: {
      title: 'Complete Juz 26 (Ha Meem)',
      mode: 'sipara',
      targetJuz: 26,
      surahDirection: 'reverse',
      unit: 'lines',
      targetValue: 300,
      currentValue: 56,
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
    quranPosition: {
      juz: 30,
      surahNumber: 114,
      ayatNumber: 0,
      lineNumber: 0,
      surahDirection: 'reverse',
    },
    xp: 0,
    shortTermGoal: {
      title: "This Week's Jadeed Target (Lines)",
      targetAyats: 30,
      currentAyats: 0,
      bonusSpins: 0,
    },
    longTermGoal: {
      title: 'Complete Juz 30 (Amma)',
      mode: 'sipara',
      targetJuz: 30,
      surahDirection: 'reverse',
      unit: 'lines',
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
  const basePosition = {
    ...fallback.quranPosition,
    ...(parsed.quranPosition ?? {}),
    surahDirection: parsed.quranPosition?.surahDirection ?? 'reverse',
  };
  const resolvedSurah = getSurahInfo(basePosition.surahNumber);
  const resolvedLine =
    parsed.quranPosition && typeof parsed.quranPosition.lineNumber !== 'number'
      ? getSurahLineFromPosition(
          {
            juz: basePosition.juz,
            surahNumber: basePosition.surahNumber,
            ayatNumber: basePosition.ayatNumber,
            surahDirection: basePosition.surahDirection,
          },
          resolvedSurah
        )
      : getSurahLineFromPosition(basePosition, resolvedSurah);

  const mergedPosition = {
    ...basePosition,
    lineNumber: resolvedLine,
  };

  let mergedLongTerm = {
    ...fallback.longTermGoal,
    ...(parsed.longTermGoal ?? {}),
    mode: parsed.longTermGoal?.mode ?? 'sipara',
    targetJuz: parsed.longTermGoal?.targetJuz ?? mergedPosition.juz,
    surahDirection: parsed.longTermGoal?.surahDirection ?? mergedPosition.surahDirection,
  };
  if (mergedLongTerm.mode !== 'custom') {
    const siparaCalc = calculateSiparaProgress(
      mergedLongTerm.targetJuz ?? mergedPosition.juz,
      mergedPosition,
      mergedLongTerm.surahDirection ?? mergedPosition.surahDirection
    );
    mergedLongTerm = {
      ...mergedLongTerm,
      unit: 'lines',
      targetValue: siparaCalc.totalLines,
      currentValue: siparaCalc.completedLines,
    };
  }

  return {
    settings: { ...fallback.settings, ...(parsed.settings ?? {}) },
    quranPosition: mergedPosition,
    xp: typeof parsed.xp === 'number' ? parsed.xp : fallback.xp,
    shortTermGoal: { ...fallback.shortTermGoal, ...(parsed.shortTermGoal ?? {}) },
    longTermGoal: mergedLongTerm,
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

export function saveServerState(state: AppState): Promise<boolean> {
  return saveServerStore(normalizeMultiStore(state));
}

export interface CreateStudentParams {
  name: string;
  heroId: HeroId;
  juz: number;
  surahNumber: number;
  ayatNumber: number;
  lineNumber?: number;
  surahDirection: SurahDirection;
  weeklyTargetAyats: number;
  parentPin?: string;
}

export function isStockDemoStudent(student: AppState): boolean {
  const allDemoLogs = student.logs.every((l) => l.id.startsWith('demo-log-'));
  const defaultPos =
    (student.quranPosition.juz === 26 &&
      student.quranPosition.surahNumber === 50 &&
      (student.quranPosition.ayatNumber === 17 || student.quranPosition.ayatNumber === 15)) ||
    (student.quranPosition.juz === 29 &&
      student.quranPosition.surahNumber === 68 &&
      student.quranPosition.ayatNumber === 4);
  const defaultWon = student.wonTreats.every((w) => w.id === 'won-demo-1');
  const defaultSettings =
    student.settings.childName === 'Little Champion' &&
    student.settings.heroId === 'iron-hafiz' &&
    student.settings.parentPin === '1234';
  const defaultShort =
    (student.shortTermGoal.targetAyats === 30 && student.shortTermGoal.currentAyats === 21) ||
    (student.shortTermGoal.targetAyats === 20 && student.shortTermGoal.currentAyats === 16);
  const defaultGoals =
    defaultShort &&
    student.treats.length === DEFAULT_TREATS.length &&
    (student.longTermGoal.title === 'Complete Juz 26 (Ha Meem)' ||
      student.longTermGoal.title === 'Conquer Juz 29 (Sipara Mission)');
  return allDemoLogs && defaultPos && defaultWon && defaultSettings && defaultGoals;
}

export function isStoreStockDemo(store: HifzMultiStore): boolean {
  return store.students.length === 1 && isStockDemoStudent(store.students[0]);
}

export function syncStoreMirrors(store: HifzMultiStore): HifzMultiStore {
  const primary =
    store.students.find((s) => s.id === store.activeStudentId) ?? store.students[0];
  return {
    ...store,
    version: 2,
    settings: primary.settings,
    shortTermGoal: primary.shortTermGoal,
    longTermGoal: primary.longTermGoal,
  };
}

export function createNewStudentProfile(params: CreateStudentParams): StudentProfile {
  const surah = getSurahInfo(params.surahNumber);
  const clampedJuz = Math.max(1, Math.min(30, params.juz));
  const clampedLine =
    typeof params.lineNumber === 'number'
      ? Math.max(0, Math.min(surah.totalLines, params.lineNumber))
      : undefined;
  const clampedAyat = Math.max(
    0,
    Math.min(
      surah.totalAyats,
      clampedLine !== undefined && params.ayatNumber === 0
        ? getAyatFromSurahLine(clampedLine, surah)
        : params.ayatNumber
    )
  );
  const quranPosition: QuranPosition = {
    juz: clampedJuz,
    surahNumber: surah.number,
    ayatNumber: clampedAyat,
    lineNumber: clampedLine,
    surahDirection: params.surahDirection,
  };
  const sipara = calculateSiparaProgress(clampedJuz, quranPosition, params.surahDirection);
  const nowIso = new Date().toISOString();
  const weeklyTarget = Math.max(1, params.weeklyTargetAyats || 30);

  return {
    id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: nowIso,
    updatedAt: nowIso,
    settings: {
      childName: params.name.trim() || 'Hero Student',
      heroId: params.heroId,
      parentPin: /^\d{4}$/.test(params.parentPin ?? '') ? (params.parentPin as string) : '1234',
      soundEnabled: true,
      defaultMurajaatPages: 10,
      defaultJuzHaliPages: 4,
      ayatsPerPage: 15,
      pagesPerSipara: 20,
    },
    quranPosition,
    xp: 0,
    shortTermGoal: {
      title: "This Week's Jadeed Target (Lines)",
      targetAyats: weeklyTarget,
      currentAyats: 0,
      bonusSpins: 0,
    },
    longTermGoal: {
      title: `Complete Juz ${clampedJuz} (${sipara.juzInfo.name})`,
      mode: 'sipara',
      targetJuz: clampedJuz,
      surahDirection: params.surahDirection,
      unit: 'lines',
      targetValue: sipara.totalLines,
      currentValue: sipara.completedLines,
      grandTreatLabel: 'Special Grand Prize',
      grandTreatEmoji: '🏆',
      claimed: false,
    },
    treats: DEFAULT_TREATS.map((t) => ({ ...t })),
    wonTreats: [],
    logs: [],
  };
}

export function normalizeMultiStore(raw: unknown): HifzMultiStore {
  const nowIso = new Date().toISOString();

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;

    if (Array.isArray(obj.students) && obj.students.length > 0) {
      const seenIds = new Set<string>();
      const students: StudentProfile[] = obj.students.map((item, idx) => {
        const record = (item && typeof item === 'object' ? item : {}) as Partial<StudentProfile>;
        const normalized = normalizeAppState(record);
        let id =
          typeof record.id === 'string' && record.id.trim().length > 0
            ? record.id.trim()
            : `student-${idx + 1}`;
        while (seenIds.has(id)) {
          id = `${id}-${idx + 1}`;
        }
        seenIds.add(id);

        return {
          ...normalized,
          id,
          createdAt: typeof record.createdAt === 'string' ? record.createdAt : nowIso,
          updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : undefined,
        };
      });

      const activeStudentId =
        obj.activeStudentId === null
          ? null
          : typeof obj.activeStudentId === 'string' &&
              students.some((s) => s.id === obj.activeStudentId)
            ? obj.activeStudentId
            : students[0].id;

      return syncStoreMirrors({
        version: 2,
        activeStudentId,
        students,
        settings: students[0].settings,
        shortTermGoal: students[0].shortTermGoal,
        longTermGoal: students[0].longTermGoal,
      });
    }

    // Legacy v1 single-student payload: migrate seamlessly into Student #1
    if ('settings' in obj || 'logs' in obj || 'quranPosition' in obj || 'shortTermGoal' in obj) {
      const normalized = normalizeAppState(obj as Partial<AppState>);
      const firstStudent: StudentProfile = {
        ...normalized,
        id: 'student-1',
        createdAt: nowIso,
      };
      return syncStoreMirrors({
        version: 2,
        activeStudentId: 'student-1',
        students: [firstStudent],
        settings: firstStudent.settings,
        shortTermGoal: firstStudent.shortTermGoal,
        longTermGoal: firstStudent.longTermGoal,
      });
    }
  }

  const demo = createDemoState();
  const defaultStudent: StudentProfile = {
    ...demo,
    id: 'student-1',
    createdAt: nowIso,
  };
  return syncStoreMirrors({
    version: 2,
    activeStudentId: 'student-1',
    students: [defaultStudent],
    settings: defaultStudent.settings,
    shortTermGoal: defaultStudent.shortTermGoal,
    longTermGoal: defaultStudent.longTermGoal,
  });
}

function mergeTwoStudents(localStudent: StudentProfile, serverStudent: StudentProfile): StudentProfile {
  const localIsDemo = isStockDemoStudent(localStudent);
  const serverIsDemo = isStockDemoStudent(serverStudent);

  if (localIsDemo && !serverIsDemo) return serverStudent;
  if (!localIsDemo && serverIsDemo) return localStudent;

  // Union logs by ID so no entered daily logs can ever be dropped
  const logMap = new Map<string, DailyLogEntry>();
  for (const log of serverStudent.logs) {
    logMap.set(log.id, log);
  }
  for (const log of localStudent.logs) {
    if (!logMap.has(log.id)) {
      logMap.set(log.id, log);
    }
  }
  const mergedLogs = Array.from(logMap.values()).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  // Union won treats by ID (preserve delivered: true if marked delivered in either)
  const wonMap = new Map<string, WonTreatRecord>();
  for (const wt of serverStudent.wonTreats) {
    wonMap.set(wt.id, wt);
  }
  for (const wt of localStudent.wonTreats) {
    const existing = wonMap.get(wt.id);
    if (!existing) {
      wonMap.set(wt.id, wt);
    } else if (wt.delivered && !existing.delivered) {
      wonMap.set(wt.id, { ...existing, delivered: true });
    }
  }
  const mergedWonTreats = Array.from(wonMap.values()).sort((a, b) =>
    a.wonAt.localeCompare(b.wonAt)
  );

  const localTs = Date.parse(localStudent.updatedAt ?? '') || 0;
  const serverTs = Date.parse(serverStudent.updatedAt ?? '') || 0;
  const primary = localTs > serverTs ? localStudent : serverStudent;

  const logsXp = mergedLogs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
  const mergedXp = Math.max(localStudent.xp, serverStudent.xp, logsXp);

  let nextLongTerm = primary.longTermGoal;
  if (nextLongTerm.mode !== 'custom') {
    const dir = nextLongTerm.surahDirection ?? primary.quranPosition.surahDirection ?? 'reverse';
    const calc = calculateSiparaProgress(
      nextLongTerm.targetJuz ?? primary.quranPosition.juz,
      primary.quranPosition,
      dir
    );
    nextLongTerm = {
      ...nextLongTerm,
      unit: 'lines',
      targetValue: calc.totalLines,
      currentValue: calc.completedLines,
    };
  }

  return {
    ...primary,
    id: serverStudent.id,
    createdAt: serverStudent.createdAt || localStudent.createdAt,
    updatedAt:
      localTs > serverTs
        ? localStudent.updatedAt
        : serverStudent.updatedAt ?? localStudent.updatedAt,
    xp: mergedXp,
    longTermGoal: nextLongTerm,
    wonTreats: mergedWonTreats,
    logs: mergedLogs,
  };
}

export function mergeStoresPreservingUserData(
  localStore: HifzMultiStore,
  serverStore: HifzMultiStore
): HifzMultiStore {
  const localDemo = isStoreStockDemo(localStore);
  const serverDemo = isStoreStockDemo(serverStore);

  if (localDemo && !serverDemo) {
    const activeValid =
      localStore.activeStudentId &&
      serverStore.students.some((s) => s.id === localStore.activeStudentId)
        ? localStore.activeStudentId
        : serverStore.activeStudentId;
    return syncStoreMirrors({ ...serverStore, activeStudentId: activeValid });
  }

  if (!localDemo && serverDemo) {
    return localStore;
  }

  if (localDemo && serverDemo) {
    return serverStore;
  }

  const localById = new Map<string, StudentProfile>(
    localStore.students.map((s) => [s.id, s])
  );
  const mergedStudents: StudentProfile[] = [];
  const handledIds = new Set<string>();

  for (const serverStudent of serverStore.students) {
    const matchingLocal = localById.get(serverStudent.id);
    handledIds.add(serverStudent.id);
    if (matchingLocal) {
      mergedStudents.push(mergeTwoStudents(matchingLocal, serverStudent));
    } else {
      mergedStudents.push(serverStudent);
    }
  }

  for (const localStudent of localStore.students) {
    if (!handledIds.has(localStudent.id) && !isStockDemoStudent(localStudent)) {
      mergedStudents.push(localStudent);
    }
  }

  const activeId =
    localStore.activeStudentId &&
    mergedStudents.some((s) => s.id === localStore.activeStudentId)
      ? localStore.activeStudentId
      : serverStore.activeStudentId &&
          mergedStudents.some((s) => s.id === serverStore.activeStudentId)
        ? serverStore.activeStudentId
        : mergedStudents[0].id;

  return syncStoreMirrors({
    version: 2,
    activeStudentId: activeId,
    students: mergedStudents,
    settings: mergedStudents[0].settings,
    shortTermGoal: mergedStudents[0].shortTermGoal,
    longTermGoal: mergedStudents[0].longTermGoal,
  });
}

export function loadMultiStore(): HifzMultiStore {
  try {
    const rawV2 = localStorage.getItem(STORE_STORAGE_KEY);
    if (rawV2) {
      return normalizeMultiStore(JSON.parse(rawV2));
    }
    const rawV1 = localStorage.getItem(STORAGE_KEY);
    if (rawV1) {
      return normalizeMultiStore(JSON.parse(rawV1));
    }
    return normalizeMultiStore(createDemoState());
  } catch {
    return normalizeMultiStore(createDemoState());
  }
}

export function saveMultiStore(store: HifzMultiStore): void {
  try {
    localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export type ServerStoreFetchResult =
  | { reachable: true; store: HifzMultiStore | null }
  | { reachable: false };

export async function fetchServerStore(): Promise<ServerStoreFetchResult> {
  try {
    const res = await fetch('/api/state', {
      method: 'GET',
      cache: 'no-store',
    });
    if (!res.ok) return { reachable: false };
    const data = (await res.json()) as { state?: unknown };
    if (!data || !('state' in data)) return { reachable: false };
    return {
      reachable: true,
      store: data.state ? normalizeMultiStore(data.state) : null,
    };
  } catch {
    return { reachable: false };
  }
}

export async function saveServerStore(
  store: HifzMultiStore,
  options?: { allowReset?: boolean }
): Promise<boolean> {
  try {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: store,
        allowReset: Boolean(options?.allowReset),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
