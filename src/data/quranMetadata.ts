import type { QuranPosition, SurahDirection } from '../types/hifz';

export interface JuzInfo {
  number: number;
  name: string;
}

export interface SurahInfo {
  number: number;
  name: string;
  meaning: string;
  totalAyats: number;
  totalLines: number; // Standard 15-line Misri Tajweed Mushaf lines
  juz: number;
}

export const QURAN_JUZ_LIST: JuzInfo[] = [
  { number: 1, name: 'Alif Lam Meem' },
  { number: 2, name: 'Sayaqool' },
  { number: 3, name: 'Tilkar Rusul' },
  { number: 4, name: 'Lan Tanaloo' },
  { number: 5, name: 'Wal Mohsanat' },
  { number: 6, name: 'La Yuhibbullah' },
  { number: 7, name: 'Wa Iza Samiu' },
  { number: 8, name: 'Wa Lau Annana' },
  { number: 9, name: 'Qalal Malao' },
  { number: 10, name: "Wa A'lamu" },
  { number: 11, name: 'Yatazeroon' },
  { number: 12, name: 'Wa Mamin Dabbah' },
  { number: 13, name: 'Wa Ma Ubarrio' },
  { number: 14, name: 'Rubama' },
  { number: 15, name: 'Subhanalladhi' },
  { number: 16, name: 'Qal Alam' },
  { number: 17, name: 'Iqtaraba' },
  { number: 18, name: 'Qadd Aflaha' },
  { number: 19, name: 'Wa Qalalladhina' },
  { number: 20, name: 'Amman Khalaqa' },
  { number: 21, name: 'Utlu Ma Oohiya' },
  { number: 22, name: 'Wa Manyyaqnut' },
  { number: 23, name: 'Wa Mali' },
  { number: 24, name: 'Faman Azlam' },
  { number: 25, name: 'Ilayhi Yuraddu' },
  { number: 26, name: 'Ha Meem' },
  { number: 27, name: 'Qala Fama Khatbukum' },
  { number: 28, name: 'Qadd Sami Allah' },
  { number: 29, name: 'Tabarakalladhi' },
  { number: 30, name: 'Amma Yatasaaloon' },
];

export const QURAN_SURAHS: SurahInfo[] = [
  { number: 1, name: 'Al-Fatihah', meaning: 'The Opening', totalAyats: 7, totalLines: 7, juz: 1 },
  { number: 2, name: 'Al-Baqarah', meaning: 'The Cow', totalAyats: 286, totalLines: 720, juz: 1 },
  { number: 3, name: "Ali 'Imran", meaning: 'Family of Imran', totalAyats: 200, totalLines: 375, juz: 3 },
  { number: 4, name: 'An-Nisa', meaning: 'The Women', totalAyats: 176, totalLines: 420, juz: 4 },
  { number: 5, name: "Al-Ma'idah", meaning: 'The Table Spread', totalAyats: 120, totalLines: 330, juz: 6 },
  { number: 6, name: "Al-An'am", meaning: 'The Cattle', totalAyats: 165, totalLines: 345, juz: 7 },
  { number: 7, name: "Al-A'raf", meaning: 'The Heights', totalAyats: 206, totalLines: 375, juz: 8 },
  { number: 8, name: 'Al-Anfal', meaning: 'The Spoils of War', totalAyats: 75, totalLines: 150, juz: 9 },
  { number: 9, name: 'At-Tawbah', meaning: 'The Repentance', totalAyats: 129, totalLines: 285, juz: 10 },
  { number: 10, name: 'Yunus', meaning: 'Jonah', totalAyats: 109, totalLines: 205, juz: 11 },
  { number: 11, name: 'Hud', meaning: 'Hud', totalAyats: 123, totalLines: 210, juz: 11 },
  { number: 12, name: 'Yusuf', meaning: 'Joseph', totalAyats: 111, totalLines: 205, juz: 12 },
  { number: 13, name: "Ar-Ra'd", meaning: 'The Thunder', totalAyats: 43, totalLines: 136, juz: 13 },
  { number: 14, name: 'Ibrahim', meaning: 'Abraham', totalAyats: 52, totalLines: 164, juz: 13 },
  { number: 15, name: 'Al-Hijr', meaning: 'The Rocky Tract', totalAyats: 99, totalLines: 82, juz: 14 },
  { number: 16, name: 'An-Nahl', meaning: 'The Bee', totalAyats: 128, totalLines: 218, juz: 14 },
  { number: 17, name: 'Al-Isra', meaning: 'The Night Journey', totalAyats: 111, totalLines: 155, juz: 15 },
  { number: 18, name: 'Al-Kahf', meaning: 'The Cave', totalAyats: 110, totalLines: 145, juz: 15 },
  { number: 19, name: 'Maryam', meaning: 'Mary', totalAyats: 98, totalLines: 105, juz: 16 },
  { number: 20, name: 'Ta-Ha', meaning: 'Ta-Ha', totalAyats: 135, totalLines: 195, juz: 16 },
  { number: 21, name: 'Al-Anbiya', meaning: 'The Prophets', totalAyats: 112, totalLines: 160, juz: 17 },
  { number: 22, name: 'Al-Hajj', meaning: 'The Pilgrimage', totalAyats: 78, totalLines: 140, juz: 17 },
  { number: 23, name: "Al-Mu'minun", meaning: 'The Believers', totalAyats: 118, totalLines: 115, juz: 18 },
  { number: 24, name: 'An-Nur', meaning: 'The Light', totalAyats: 64, totalLines: 115, juz: 18 },
  { number: 25, name: 'Al-Furqan', meaning: 'The Criterion', totalAyats: 77, totalLines: 70, juz: 18 },
  { number: 26, name: "Ash-Shu'ara", meaning: 'The Poets', totalAyats: 227, totalLines: 165, juz: 19 },
  { number: 27, name: 'An-Naml', meaning: 'The Ant', totalAyats: 93, totalLines: 135, juz: 19 },
  { number: 28, name: 'Al-Qasas', meaning: 'The Stories', totalAyats: 88, totalLines: 175, juz: 20 },
  { number: 29, name: "Al-'Ankabut", meaning: 'The Spider', totalAyats: 69, totalLines: 125, juz: 20 },
  { number: 30, name: 'Ar-Rum', meaning: 'The Romans', totalAyats: 60, totalLines: 85, juz: 21 },
  { number: 31, name: 'Luqman', meaning: 'Luqman', totalAyats: 34, totalLines: 55, juz: 21 },
  { number: 32, name: 'As-Sajdah', meaning: 'The Prostration', totalAyats: 30, totalLines: 40, juz: 21 },
  { number: 33, name: 'Al-Ahzab', meaning: 'The Combined Forces', totalAyats: 73, totalLines: 120, juz: 21 },
  { number: 34, name: 'Saba', meaning: 'Sheba', totalAyats: 54, totalLines: 105, juz: 22 },
  { number: 35, name: 'Fatir', meaning: 'Originator', totalAyats: 45, totalLines: 90, juz: 22 },
  { number: 36, name: 'Ya-Sin', meaning: 'Ya Sin', totalAyats: 83, totalLines: 105, juz: 22 },
  { number: 37, name: 'As-Saffat', meaning: 'Those Ranged in Ranks', totalAyats: 182, totalLines: 115, juz: 23 },
  { number: 38, name: 'Sad', meaning: 'Sad', totalAyats: 88, totalLines: 80, juz: 23 },
  { number: 39, name: 'Az-Zumar', meaning: 'The Troops', totalAyats: 75, totalLines: 105, juz: 23 },
  { number: 40, name: 'Ghafir', meaning: 'The Forgiver', totalAyats: 85, totalLines: 180, juz: 24 },
  { number: 41, name: 'Fussilat', meaning: 'Explained in Detail', totalAyats: 54, totalLines: 120, juz: 24 },
  { number: 42, name: 'Ash-Shura', meaning: 'The Consultation', totalAyats: 53, totalLines: 95, juz: 25 },
  { number: 43, name: 'Az-Zukhruf', meaning: 'The Ornaments of Gold', totalAyats: 89, totalLines: 105, juz: 25 },
  { number: 44, name: 'Ad-Dukhan', meaning: 'The Smoke', totalAyats: 59, totalLines: 45, juz: 25 },
  { number: 45, name: 'Al-Jathiyah', meaning: 'The Crouching', totalAyats: 37, totalLines: 55, juz: 25 },
  { number: 46, name: 'Al-Ahqaf', meaning: 'The Wind-Curved Sandhills', totalAyats: 35, totalLines: 58, juz: 26 },
  { number: 47, name: 'Muhammad', meaning: 'Muhammad', totalAyats: 38, totalLines: 59, juz: 26 },
  { number: 48, name: 'Al-Fath', meaning: 'The Victory', totalAyats: 29, totalLines: 64, juz: 26 },
  { number: 49, name: 'Al-Hujurat', meaning: 'The Rooms', totalAyats: 18, totalLines: 38, juz: 26 },
  { number: 50, name: 'Qaf', meaning: 'Qaf', totalAyats: 45, totalLines: 40, juz: 26 },
  { number: 51, name: 'Adh-Dhariyat', meaning: 'The Winnowing Winds', totalAyats: 60, totalLines: 41, juz: 26 },
  { number: 52, name: 'At-Tur', meaning: 'The Mount', totalAyats: 49, totalLines: 42, juz: 27 },
  { number: 53, name: 'An-Najm', meaning: 'The Star', totalAyats: 62, totalLines: 42, juz: 27 },
  { number: 54, name: 'Al-Qamar', meaning: 'The Moon', totalAyats: 55, totalLines: 46, juz: 27 },
  { number: 55, name: 'Ar-Rahman', meaning: 'The Beneficent', totalAyats: 78, totalLines: 52, juz: 27 },
  { number: 56, name: "Al-Waqi'ah", meaning: 'The Inevitable', totalAyats: 96, totalLines: 54, juz: 27 },
  { number: 57, name: 'Al-Hadid', meaning: 'The Iron', totalAyats: 29, totalLines: 64, juz: 27 },
  { number: 58, name: 'Al-Mujadilah', meaning: 'The Pleading Woman', totalAyats: 22, totalLines: 51, juz: 28 },
  { number: 59, name: 'Al-Hashr', meaning: 'The Exile', totalAyats: 24, totalLines: 49, juz: 28 },
  { number: 60, name: 'Al-Mumtahanah', meaning: 'She That Is Examined', totalAyats: 13, totalLines: 38, juz: 28 },
  { number: 61, name: 'As-Saff', meaning: 'The Ranks', totalAyats: 14, totalLines: 24, juz: 28 },
  { number: 62, name: "Al-Jumu'ah", meaning: 'The Congregation', totalAyats: 11, totalLines: 20, juz: 28 },
  { number: 63, name: 'Al-Munafiqun', meaning: 'The Hypocrites', totalAyats: 11, totalLines: 22, juz: 28 },
  { number: 64, name: 'At-Taghabun', meaning: 'Mutual Disillusion', totalAyats: 18, totalLines: 29, juz: 28 },
  { number: 65, name: 'At-Talaq', meaning: 'The Divorce', totalAyats: 12, totalLines: 34, juz: 28 },
  { number: 66, name: 'At-Tahrim', meaning: 'The Prohibition', totalAyats: 12, totalLines: 33, juz: 28 },
  { number: 67, name: 'Al-Mulk', meaning: 'The Sovereignty', totalAyats: 30, totalLines: 35, juz: 29 },
  { number: 68, name: 'Al-Qalam', meaning: 'The Pen', totalAyats: 52, totalLines: 33, juz: 29 },
  { number: 69, name: 'Al-Haqqah', meaning: 'The Reality', totalAyats: 52, totalLines: 29, juz: 29 },
  { number: 70, name: "Al-Ma'arij", meaning: 'The Ascending Stairways', totalAyats: 44, totalLines: 27, juz: 29 },
  { number: 71, name: 'Nuh', meaning: 'Noah', totalAyats: 28, totalLines: 25, juz: 29 },
  { number: 72, name: 'Al-Jinn', meaning: 'The Jinn', totalAyats: 28, totalLines: 28, juz: 29 },
  { number: 73, name: 'Al-Muzzammil', meaning: 'The Enshrouded One', totalAyats: 20, totalLines: 22, juz: 29 },
  { number: 74, name: 'Al-Muddaththir', meaning: 'The Cloaked One', totalAyats: 56, totalLines: 30, juz: 29 },
  { number: 75, name: 'Al-Qiyamah', meaning: 'The Resurrection', totalAyats: 40, totalLines: 19, juz: 29 },
  { number: 76, name: 'Al-Insan', meaning: 'The Human', totalAyats: 31, totalLines: 29, juz: 29 },
  { number: 77, name: 'Al-Mursalat', meaning: 'The Emissaries', totalAyats: 50, totalLines: 23, juz: 29 },
  { number: 78, name: 'An-Naba', meaning: 'The Tidings', totalAyats: 40, totalLines: 22, juz: 30 },
  { number: 79, name: "An-Nazi'at", meaning: 'Those Who Drag Forth', totalAyats: 46, totalLines: 23, juz: 30 },
  { number: 80, name: "'Abasa", meaning: 'He Frowned', totalAyats: 42, totalLines: 17, juz: 30 },
  { number: 81, name: 'At-Takwir', meaning: 'The Overthrowing', totalAyats: 29, totalLines: 13, juz: 30 },
  { number: 82, name: 'Al-Infitar', meaning: 'The Cleaving', totalAyats: 19, totalLines: 11, juz: 30 },
  { number: 83, name: 'Al-Mutaffifin', meaning: 'The Defrauding', totalAyats: 36, totalLines: 22, juz: 30 },
  { number: 84, name: 'Al-Inshiqaq', meaning: 'The Sundering', totalAyats: 25, totalLines: 13, juz: 30 },
  { number: 85, name: 'Al-Buruj', meaning: 'The Mansions of the Stars', totalAyats: 22, totalLines: 13, juz: 30 },
  { number: 86, name: 'At-Tariq', meaning: 'The Nightcomer', totalAyats: 17, totalLines: 8, juz: 30 },
  { number: 87, name: "Al-A'la", meaning: 'The Most High', totalAyats: 19, totalLines: 9, juz: 30 },
  { number: 88, name: 'Al-Ghashiyah', meaning: 'The Overwhelming', totalAyats: 26, totalLines: 11, juz: 30 },
  { number: 89, name: 'Al-Fajr', meaning: 'The Dawn', totalAyats: 30, totalLines: 17, juz: 30 },
  { number: 90, name: 'Al-Balad', meaning: 'The City', totalAyats: 20, totalLines: 10, juz: 30 },
  { number: 91, name: 'Ash-Shams', meaning: 'The Sun', totalAyats: 15, totalLines: 8, juz: 30 },
  { number: 92, name: 'Al-Layl', meaning: 'The Night', totalAyats: 21, totalLines: 10, juz: 30 },
  { number: 93, name: 'Ad-Duha', meaning: 'The Morning Hours', totalAyats: 11, totalLines: 6, juz: 30 },
  { number: 94, name: 'Ash-Sharh', meaning: 'The Relief', totalAyats: 8, totalLines: 4, juz: 30 },
  { number: 95, name: 'At-Tin', meaning: 'The Fig', totalAyats: 8, totalLines: 4, juz: 30 },
  { number: 96, name: "Al-'Alaq", meaning: 'The Clot', totalAyats: 19, totalLines: 8, juz: 30 },
  { number: 97, name: 'Al-Qadr', meaning: 'The Power', totalAyats: 5, totalLines: 4, juz: 30 },
  { number: 98, name: 'Al-Bayyinah', meaning: 'The Clear Proof', totalAyats: 8, totalLines: 10, juz: 30 },
  { number: 99, name: 'Az-Zalzalah', meaning: 'The Earthquake', totalAyats: 8, totalLines: 5, juz: 30 },
  { number: 100, name: "Al-'Adiyat", meaning: 'The Courser', totalAyats: 11, totalLines: 6, juz: 30 },
  { number: 101, name: "Al-Qari'ah", meaning: 'The Calamity', totalAyats: 11, totalLines: 5, juz: 30 },
  { number: 102, name: 'At-Takathur', meaning: 'The Rivalry', totalAyats: 8, totalLines: 4, juz: 30 },
  { number: 103, name: "Al-'Asr", meaning: 'The Declining Day', totalAyats: 3, totalLines: 3, juz: 30 },
  { number: 104, name: 'Al-Humazah', meaning: 'The Traducer', totalAyats: 9, totalLines: 4, juz: 30 },
  { number: 105, name: 'Al-Fil', meaning: 'The Elephant', totalAyats: 5, totalLines: 3, juz: 30 },
  { number: 106, name: 'Quraysh', meaning: 'Quraysh', totalAyats: 4, totalLines: 3, juz: 30 },
  { number: 107, name: "Al-Ma'un", meaning: 'The Small Kindnesses', totalAyats: 7, totalLines: 4, juz: 30 },
  { number: 108, name: 'Al-Kawthar', meaning: 'The Abundance', totalAyats: 3, totalLines: 2, juz: 30 },
  { number: 109, name: 'Al-Kafirun', meaning: 'The Disbelievers', totalAyats: 6, totalLines: 4, juz: 30 },
  { number: 110, name: 'An-Nasr', meaning: 'The Divine Support', totalAyats: 3, totalLines: 3, juz: 30 },
  { number: 111, name: 'Al-Masad', meaning: 'The Palm Fiber', totalAyats: 5, totalLines: 3, juz: 30 },
  { number: 112, name: 'Al-Ikhlas', meaning: 'The Sincerity', totalAyats: 4, totalLines: 2, juz: 30 },
  { number: 113, name: 'Al-Falaq', meaning: 'The Daybreak', totalAyats: 5, totalLines: 3, juz: 30 },
  { number: 114, name: 'An-Nas', meaning: 'Mankind', totalAyats: 6, totalLines: 3, juz: 30 },
];

export function getSurahInfo(surahNumber: number): SurahInfo {
  return QURAN_SURAHS.find((s) => s.number === surahNumber) ?? QURAN_SURAHS[0];
}

export function getJuzInfo(juzNumber: number): JuzInfo {
  return QURAN_JUZ_LIST.find((j) => j.number === juzNumber) ?? QURAN_JUZ_LIST[0];
}

export const MISRI_LINES_PER_PAGE = 15;
export const MISRI_PAGES_PER_SIPARA = 20;
export const MISRI_LINES_PER_SIPARA = MISRI_LINES_PER_PAGE * MISRI_PAGES_PER_SIPARA; // 300

export function getSurahLineFromPosition(pos: QuranPosition, surah: SurahInfo): number {
  if (typeof pos.lineNumber === 'number' && Number.isFinite(pos.lineNumber)) {
    return Math.max(0, Math.min(surah.totalLines, Math.round(pos.lineNumber)));
  }
  if (pos.ayatNumber >= surah.totalAyats) return surah.totalLines;
  if (pos.ayatNumber <= 0) return 0;
  return Math.max(
    1,
    Math.min(surah.totalLines - 1, Math.round((pos.ayatNumber / Math.max(1, surah.totalAyats)) * surah.totalLines))
  );
}

export function getAyatFromSurahLine(line: number, surah: SurahInfo): number {
  const clampedLine = Math.max(0, Math.min(surah.totalLines, Math.round(line)));
  if (clampedLine <= 0) return 0;
  if (clampedLine >= surah.totalLines) return surah.totalAyats;
  return Math.max(
    1,
    Math.min(surah.totalAyats, Math.round((clampedLine / Math.max(1, surah.totalLines)) * surah.totalAyats))
  );
}

export interface AdvancePositionResult {
  startSurah: SurahInfo;
  startAyat: number;
  startLine: number;
  endSurah: SurahInfo;
  endAyat: number;
  endLine: number;
  linesAdded: number;
  newPosition: QuranPosition;
  summaryText: string;
}

/**
 * Given the child's current memorized bookmark and a count of newly memorized
 * 15-line Misri Mushaf lines, computes the range memorized today and advances the bookmark.
 */
export interface SiparaSurahProgress {
  surah: SurahInfo;
  completedAyats: number;
  completedLines: number;
  totalLines: number;
  status: 'done' | 'current' | 'pending';
}

export interface SiparaProgressResult {
  juz: number;
  juzInfo: JuzInfo;
  direction: SurahDirection;
  surahs: SurahInfo[];
  surahStatuses: SiparaSurahProgress[];
  firstSurahOfJuz: SurahInfo;
  lastSurahOfJuz: SurahInfo;
  finishingSurah: SurahInfo;
  totalAyats: number;
  completedAyats: number;
  remainingAyats: number;
  totalLines: number;
  completedLines: number;
  remainingLines: number;
  totalPages: number;
  completedPages: number;
  percent: number;
  isComplete: boolean;
}

/**
 * Return Surahs in a Juz ordered by the active memorization direction.
 * For Juzs that start mid-Surah (Juz 2 and Juz 5), falls back to the spanning Surah.
 */
export function getSurahsForJuz(
  juzNumber: number,
  direction: SurahDirection = 'reverse'
): SurahInfo[] {
  const clampedJuz = Math.max(1, Math.min(30, juzNumber));
  const direct = QURAN_SURAHS.filter((s) => s.juz === clampedJuz);
  let baseSurahs = direct;
  if (baseSurahs.length === 0) {
    const spanning = [...QURAN_SURAHS].reverse().find((s) => s.juz < clampedJuz);
    baseSurahs = spanning ? [spanning] : [QURAN_SURAHS[0]];
  }
  return direction === 'reverse' ? [...baseSurahs].reverse() : [...baseSurahs];
}

/**
 * Automatically calculate completion of a target Sipara (Juz 1-30) from the child's Quran bookmark
 * using standard 15-line Misri Tajweed Mushaf lines (300 lines = 20 pages per Sipara).
 * In 'reverse' mode (e.g. Juz 26: 51 Adh-Dhariyat -> 46 Al-Ahqaf), Surahs are memorized from
 * highest Surah number to lowest, so finishing the first Surah of the Juz (Al-Ahqaf) completes 100%.
 */
export function calculateSiparaProgress(
  targetJuz: number,
  bookmark: QuranPosition,
  direction: SurahDirection = bookmark.surahDirection ?? 'reverse'
): SiparaProgressResult {
  const clampedJuz = Math.max(1, Math.min(30, targetJuz));
  const juzInfo = getJuzInfo(clampedJuz);
  const surahs = getSurahsForJuz(clampedJuz, direction);
  const ascSurahs = direction === 'reverse' ? [...surahs].reverse() : surahs;
  const firstSurahOfJuz = ascSurahs[0];
  const lastSurahOfJuz = ascSurahs[ascSurahs.length - 1];
  const finishingSurah = surahs[surahs.length - 1];

  let totalAyats = 0;
  let completedAyats = 0;
  let rawTotalLines = 0;
  let rawCompletedLines = 0;

  const surahStatuses: SiparaSurahProgress[] = surahs.map((surah) => {
    totalAyats += surah.totalAyats;
    rawTotalLines += surah.totalLines;

    const alreadyPassedSurah =
      direction === 'reverse'
        ? bookmark.surahNumber < surah.number
        : bookmark.surahNumber > surah.number;

    if (alreadyPassedSurah) {
      completedAyats += surah.totalAyats;
      rawCompletedLines += surah.totalLines;
      return {
        surah,
        completedAyats: surah.totalAyats,
        completedLines: surah.totalLines,
        totalLines: surah.totalLines,
        status: 'done',
      };
    }

    if (bookmark.surahNumber === surah.number) {
      const inSurahLines = getSurahLineFromPosition(bookmark, surah);
      const inSurahAyats = Math.max(0, Math.min(surah.totalAyats, bookmark.ayatNumber));
      completedAyats += inSurahAyats;
      rawCompletedLines += inSurahLines;
      return {
        surah,
        completedAyats: inSurahAyats,
        completedLines: inSurahLines,
        totalLines: surah.totalLines,
        status: inSurahLines >= surah.totalLines ? 'done' : 'current',
      };
    }

    return {
      surah,
      completedAyats: 0,
      completedLines: 0,
      totalLines: surah.totalLines,
      status: 'pending',
    };
  });

  // For Juz 13-30, sum(surah.totalLines) === 300 exactly.
  // For multi-Juz spanning Juz 1-12, normalize smoothly to the 300-line Sipara standard.
  let completedLines = rawCompletedLines;
  const totalLines = MISRI_LINES_PER_SIPARA;
  if (rawTotalLines !== MISRI_LINES_PER_SIPARA) {
    const passedTargetJuz =
      direction === 'reverse'
        ? bookmark.juz < clampedJuz || bookmark.surahNumber < firstSurahOfJuz.number
        : bookmark.juz > clampedJuz || bookmark.surahNumber > lastSurahOfJuz.number;
    const beforeTargetJuz =
      direction === 'reverse' ? bookmark.juz > clampedJuz : bookmark.juz < clampedJuz;

    if (passedTargetJuz) {
      completedLines = MISRI_LINES_PER_SIPARA;
    } else if (beforeTargetJuz) {
      completedLines = 0;
    } else {
      completedLines = Math.min(
        MISRI_LINES_PER_SIPARA,
        Math.round((rawCompletedLines / Math.max(1, rawTotalLines)) * MISRI_LINES_PER_SIPARA)
      );
    }
  }

  const isComplete = completedLines >= totalLines && totalLines > 0;
  const remainingLines = Math.max(0, totalLines - completedLines);
  const remainingAyats = Math.max(0, totalAyats - completedAyats);
  const totalPages = MISRI_PAGES_PER_SIPARA;
  const completedPages = Number((completedLines / MISRI_LINES_PER_PAGE).toFixed(1));
  const percent = isComplete
    ? 100
    : totalLines > 0
      ? Math.min(99, Math.round((completedLines / totalLines) * 100))
      : 0;

  return {
    juz: clampedJuz,
    juzInfo,
    direction,
    surahs,
    surahStatuses,
    firstSurahOfJuz,
    lastSurahOfJuz,
    finishingSurah,
    totalAyats,
    completedAyats,
    remainingAyats,
    totalLines,
    completedLines,
    remainingLines,
    totalPages,
    completedPages,
    percent,
    isComplete,
  };
}

export function advanceQuranPosition(
  pos: QuranPosition,
  linesAdded: number
): AdvancePositionResult {
  const direction: SurahDirection = pos.surahDirection ?? 'reverse';
  const step = direction === 'reverse' ? -1 : 1;
  const canAdvanceSurah = (idx: number) =>
    direction === 'reverse' ? idx > 0 : idx < QURAN_SURAHS.length - 1;

  const safeStartSurah = getSurahInfo(pos.surahNumber);
  const currentLine = getSurahLineFromPosition(pos, safeStartSurah);
  const currentAyat = getAyatFromSurahLine(currentLine, safeStartSurah);

  if (linesAdded <= 0) {
    return {
      startSurah: safeStartSurah,
      startAyat: currentAyat,
      startLine: currentLine,
      endSurah: safeStartSurah,
      endAyat: currentAyat,
      endLine: currentLine,
      linesAdded: 0,
      newPosition: {
        juz: pos.juz,
        surahNumber: safeStartSurah.number,
        ayatNumber: currentAyat,
        lineNumber: currentLine,
        surahDirection: direction,
      },
      summaryText: 'No new Misri lines logged',
    };
  }

  let curSurahIdx = QURAN_SURAHS.findIndex((s) => s.number === safeStartSurah.number);
  if (curSurahIdx < 0) curSurahIdx = 0;

  let curLine = currentLine;
  let crossedSurah = false;

  // Determine the starting line of today's session
  let firstSurah = QURAN_SURAHS[curSurahIdx];
  let firstLine = curLine + 1;
  if (firstLine > firstSurah.totalLines) {
    if (canAdvanceSurah(curSurahIdx)) {
      curSurahIdx += step;
      firstSurah = QURAN_SURAHS[curSurahIdx];
      curLine = 0;
      firstLine = 1;
      crossedSurah = true;
    } else {
      firstLine = firstSurah.totalLines;
    }
  }

  let remaining = linesAdded;
  let endSurah = firstSurah;
  let endLine = curLine;

  while (remaining > 0) {
    const surah = QURAN_SURAHS[curSurahIdx];
    const spaceLeftInSurah = surah.totalLines - endLine;

    if (remaining <= spaceLeftInSurah) {
      endLine += remaining;
      endSurah = surah;
      remaining = 0;
    } else {
      remaining -= spaceLeftInSurah;
      if (canAdvanceSurah(curSurahIdx)) {
        curSurahIdx += step;
        endSurah = QURAN_SURAHS[curSurahIdx];
        endLine = 0;
        crossedSurah = true;
      } else {
        endSurah = surah;
        endLine = surah.totalLines;
        remaining = 0;
      }
    }
  }

  const startAyat = getAyatFromSurahLine(firstLine, firstSurah);
  const endAyat = getAyatFromSurahLine(endLine, endSurah);
  const nextJuz = crossedSurah ? endSurah.juz : pos.juz;

  const summaryText =
    firstSurah.number === endSurah.number
      ? firstLine === endLine
        ? `Surah ${firstSurah.name} (Line ${firstLine} • +${linesAdded} line)`
        : `Surah ${firstSurah.name} (Lines ${firstLine}–${endLine} • +${linesAdded} lines)`
      : `Surah ${firstSurah.name} → ${endSurah.name} (Lines 1–${endLine} • +${linesAdded} lines)`;

  return {
    startSurah: firstSurah,
    startAyat,
    startLine: firstLine,
    endSurah,
    endAyat,
    endLine,
    linesAdded,
    newPosition: {
      juz: nextJuz,
      surahNumber: endSurah.number,
      ayatNumber: endAyat,
      lineNumber: endLine,
      surahDirection: direction,
    },
    summaryText,
  };
}
