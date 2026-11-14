import type { QuranPosition } from '../types/hifz';

export interface JuzInfo {
  number: number;
  name: string;
}

export interface SurahInfo {
  number: number;
  name: string;
  meaning: string;
  totalAyats: number;
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
  { number: 1, name: 'Al-Fatihah', meaning: 'The Opening', totalAyats: 7, juz: 1 },
  { number: 2, name: 'Al-Baqarah', meaning: 'The Cow', totalAyats: 286, juz: 1 },
  { number: 3, name: "Ali 'Imran", meaning: 'Family of Imran', totalAyats: 200, juz: 3 },
  { number: 4, name: 'An-Nisa', meaning: 'The Women', totalAyats: 176, juz: 4 },
  { number: 5, name: "Al-Ma'idah", meaning: 'The Table Spread', totalAyats: 120, juz: 6 },
  { number: 6, name: "Al-An'am", meaning: 'The Cattle', totalAyats: 165, juz: 7 },
  { number: 7, name: "Al-A'raf", meaning: 'The Heights', totalAyats: 206, juz: 8 },
  { number: 8, name: 'Al-Anfal', meaning: 'The Spoils of War', totalAyats: 75, juz: 9 },
  { number: 9, name: 'At-Tawbah', meaning: 'The Repentance', totalAyats: 129, juz: 10 },
  { number: 10, name: 'Yunus', meaning: 'Jonah', totalAyats: 109, juz: 11 },
  { number: 11, name: 'Hud', meaning: 'Hud', totalAyats: 123, juz: 11 },
  { number: 12, name: 'Yusuf', meaning: 'Joseph', totalAyats: 111, juz: 12 },
  { number: 13, name: "Ar-Ra'd", meaning: 'The Thunder', totalAyats: 43, juz: 13 },
  { number: 14, name: 'Ibrahim', meaning: 'Abraham', totalAyats: 52, juz: 13 },
  { number: 15, name: 'Al-Hijr', meaning: 'The Rocky Tract', totalAyats: 99, juz: 14 },
  { number: 16, name: 'An-Nahl', meaning: 'The Bee', totalAyats: 128, juz: 14 },
  { number: 17, name: 'Al-Isra', meaning: 'The Night Journey', totalAyats: 111, juz: 15 },
  { number: 18, name: 'Al-Kahf', meaning: 'The Cave', totalAyats: 110, juz: 15 },
  { number: 19, name: 'Maryam', meaning: 'Mary', totalAyats: 98, juz: 16 },
  { number: 20, name: 'Ta-Ha', meaning: 'Ta-Ha', totalAyats: 135, juz: 16 },
  { number: 21, name: 'Al-Anbiya', meaning: 'The Prophets', totalAyats: 112, juz: 17 },
  { number: 22, name: 'Al-Hajj', meaning: 'The Pilgrimage', totalAyats: 78, juz: 17 },
  { number: 23, name: "Al-Mu'minun", meaning: 'The Believers', totalAyats: 118, juz: 18 },
  { number: 24, name: 'An-Nur', meaning: 'The Light', totalAyats: 64, juz: 18 },
  { number: 25, name: 'Al-Furqan', meaning: 'The Criterion', totalAyats: 77, juz: 18 },
  { number: 26, name: "Ash-Shu'ara", meaning: 'The Poets', totalAyats: 227, juz: 19 },
  { number: 27, name: 'An-Naml', meaning: 'The Ant', totalAyats: 93, juz: 19 },
  { number: 28, name: 'Al-Qasas', meaning: 'The Stories', totalAyats: 88, juz: 20 },
  { number: 29, name: "Al-'Ankabut", meaning: 'The Spider', totalAyats: 69, juz: 20 },
  { number: 30, name: 'Ar-Rum', meaning: 'The Romans', totalAyats: 60, juz: 21 },
  { number: 31, name: 'Luqman', meaning: 'Luqman', totalAyats: 34, juz: 21 },
  { number: 32, name: 'As-Sajdah', meaning: 'The Prostration', totalAyats: 30, juz: 21 },
  { number: 33, name: 'Al-Ahzab', meaning: 'The Combined Forces', totalAyats: 73, juz: 21 },
  { number: 34, name: 'Saba', meaning: 'Sheba', totalAyats: 54, juz: 22 },
  { number: 35, name: 'Fatir', meaning: 'Originator', totalAyats: 45, juz: 22 },
  { number: 36, name: 'Ya-Sin', meaning: 'Ya Sin', totalAyats: 83, juz: 22 },
  { number: 37, name: 'As-Saffat', meaning: 'Those Ranged in Ranks', totalAyats: 182, juz: 23 },
  { number: 38, name: 'Sad', meaning: 'Sad', totalAyats: 88, juz: 23 },
  { number: 39, name: 'Az-Zumar', meaning: 'The Troops', totalAyats: 75, juz: 23 },
  { number: 40, name: 'Ghafir', meaning: 'The Forgiver', totalAyats: 85, juz: 24 },
  { number: 41, name: 'Fussilat', meaning: 'Explained in Detail', totalAyats: 54, juz: 24 },
  { number: 42, name: 'Ash-Shura', meaning: 'The Consultation', totalAyats: 53, juz: 25 },
  { number: 43, name: 'Az-Zukhruf', meaning: 'The Ornaments of Gold', totalAyats: 89, juz: 25 },
  { number: 44, name: 'Ad-Dukhan', meaning: 'The Smoke', totalAyats: 59, juz: 25 },
  { number: 45, name: 'Al-Jathiyah', meaning: 'The Crouching', totalAyats: 37, juz: 25 },
  { number: 46, name: 'Al-Ahqaf', meaning: 'The Wind-Curved Sandhills', totalAyats: 35, juz: 26 },
  { number: 47, name: 'Muhammad', meaning: 'Muhammad', totalAyats: 38, juz: 26 },
  { number: 48, name: 'Al-Fath', meaning: 'The Victory', totalAyats: 29, juz: 26 },
  { number: 49, name: 'Al-Hujurat', meaning: 'The Rooms', totalAyats: 18, juz: 26 },
  { number: 50, name: 'Qaf', meaning: 'Qaf', totalAyats: 45, juz: 26 },
  { number: 51, name: 'Adh-Dhariyat', meaning: 'The Winnowing Winds', totalAyats: 60, juz: 26 },
  { number: 52, name: 'At-Tur', meaning: 'The Mount', totalAyats: 49, juz: 27 },
  { number: 53, name: 'An-Najm', meaning: 'The Star', totalAyats: 62, juz: 27 },
  { number: 54, name: 'Al-Qamar', meaning: 'The Moon', totalAyats: 55, juz: 27 },
  { number: 55, name: 'Ar-Rahman', meaning: 'The Beneficent', totalAyats: 78, juz: 27 },
  { number: 56, name: "Al-Waqi'ah", meaning: 'The Inevitable', totalAyats: 96, juz: 27 },
  { number: 57, name: 'Al-Hadid', meaning: 'The Iron', totalAyats: 29, juz: 27 },
  { number: 58, name: 'Al-Mujadilah', meaning: 'The Pleading Woman', totalAyats: 22, juz: 28 },
  { number: 59, name: 'Al-Hashr', meaning: 'The Exile', totalAyats: 24, juz: 28 },
  { number: 60, name: 'Al-Mumtahanah', meaning: 'She That Is Examined', totalAyats: 13, juz: 28 },
  { number: 61, name: 'As-Saff', meaning: 'The Ranks', totalAyats: 14, juz: 28 },
  { number: 62, name: "Al-Jumu'ah", meaning: 'The Congregation', totalAyats: 11, juz: 28 },
  { number: 63, name: 'Al-Munafiqun', meaning: 'The Hypocrites', totalAyats: 11, juz: 28 },
  { number: 64, name: 'At-Taghabun', meaning: 'Mutual Disillusion', totalAyats: 18, juz: 28 },
  { number: 65, name: 'At-Talaq', meaning: 'The Divorce', totalAyats: 12, juz: 28 },
  { number: 66, name: 'At-Tahrim', meaning: 'The Prohibition', totalAyats: 12, juz: 28 },
  { number: 67, name: 'Al-Mulk', meaning: 'The Sovereignty', totalAyats: 30, juz: 29 },
  { number: 68, name: 'Al-Qalam', meaning: 'The Pen', totalAyats: 52, juz: 29 },
  { number: 69, name: 'Al-Haqqah', meaning: 'The Reality', totalAyats: 52, juz: 29 },
  { number: 70, name: "Al-Ma'arij", meaning: 'The Ascending Stairways', totalAyats: 44, juz: 29 },
  { number: 71, name: 'Nuh', meaning: 'Noah', totalAyats: 28, juz: 29 },
  { number: 72, name: 'Al-Jinn', meaning: 'The Jinn', totalAyats: 28, juz: 29 },
  { number: 73, name: 'Al-Muzzammil', meaning: 'The Enshrouded One', totalAyats: 20, juz: 29 },
  { number: 74, name: 'Al-Muddaththir', meaning: 'The Cloaked One', totalAyats: 56, juz: 29 },
  { number: 75, name: 'Al-Qiyamah', meaning: 'The Resurrection', totalAyats: 40, juz: 29 },
  { number: 76, name: 'Al-Insan', meaning: 'The Human', totalAyats: 31, juz: 29 },
  { number: 77, name: 'Al-Mursalat', meaning: 'The Emissaries', totalAyats: 50, juz: 29 },
  { number: 78, name: 'An-Naba', meaning: 'The Tidings', totalAyats: 40, juz: 30 },
  { number: 79, name: "An-Nazi'at", meaning: 'Those Who Drag Forth', totalAyats: 46, juz: 30 },
  { number: 80, name: "'Abasa", meaning: 'He Frowned', totalAyats: 42, juz: 30 },
  { number: 81, name: 'At-Takwir', meaning: 'The Overthrowing', totalAyats: 29, juz: 30 },
  { number: 82, name: 'Al-Infitar', meaning: 'The Cleaving', totalAyats: 19, juz: 30 },
  { number: 83, name: 'Al-Mutaffifin', meaning: 'The Defrauding', totalAyats: 36, juz: 30 },
  { number: 84, name: 'Al-Inshiqaq', meaning: 'The Sundering', totalAyats: 25, juz: 30 },
  { number: 85, name: 'Al-Buruj', meaning: 'The Mansions of the Stars', totalAyats: 22, juz: 30 },
  { number: 86, name: 'At-Tariq', meaning: 'The Nightcomer', totalAyats: 17, juz: 30 },
  { number: 87, name: "Al-A'la", meaning: 'The Most High', totalAyats: 19, juz: 30 },
  { number: 88, name: 'Al-Ghashiyah', meaning: 'The Overwhelming', totalAyats: 26, juz: 30 },
  { number: 89, name: 'Al-Fajr', meaning: 'The Dawn', totalAyats: 30, juz: 30 },
  { number: 90, name: 'Al-Balad', meaning: 'The City', totalAyats: 20, juz: 30 },
  { number: 91, name: 'Ash-Shams', meaning: 'The Sun', totalAyats: 15, juz: 30 },
  { number: 92, name: 'Al-Layl', meaning: 'The Night', totalAyats: 21, juz: 30 },
  { number: 93, name: 'Ad-Duha', meaning: 'The Morning Hours', totalAyats: 11, juz: 30 },
  { number: 94, name: 'Ash-Sharh', meaning: 'The Relief', totalAyats: 8, juz: 30 },
  { number: 95, name: 'At-Tin', meaning: 'The Fig', totalAyats: 8, juz: 30 },
  { number: 96, name: "Al-'Alaq", meaning: 'The Clot', totalAyats: 19, juz: 30 },
  { number: 97, name: 'Al-Qadr', meaning: 'The Power', totalAyats: 5, juz: 30 },
  { number: 98, name: 'Al-Bayyinah', meaning: 'The Clear Proof', totalAyats: 8, juz: 30 },
  { number: 99, name: 'Az-Zalzalah', meaning: 'The Earthquake', totalAyats: 8, juz: 30 },
  { number: 100, name: "Al-'Adiyat", meaning: 'The Courser', totalAyats: 11, juz: 30 },
  { number: 101, name: "Al-Qari'ah", meaning: 'The Calamity', totalAyats: 11, juz: 30 },
  { number: 102, name: 'At-Takathur', meaning: 'The Rivalry', totalAyats: 8, juz: 30 },
  { number: 103, name: "Al-'Asr", meaning: 'The Declining Day', totalAyats: 3, juz: 30 },
  { number: 104, name: 'Al-Humazah', meaning: 'The Traducer', totalAyats: 9, juz: 30 },
  { number: 105, name: 'Al-Fil', meaning: 'The Elephant', totalAyats: 5, juz: 30 },
  { number: 106, name: 'Quraysh', meaning: 'Quraysh', totalAyats: 4, juz: 30 },
  { number: 107, name: "Al-Ma'un", meaning: 'The Small Kindnesses', totalAyats: 7, juz: 30 },
  { number: 108, name: 'Al-Kawthar', meaning: 'The Abundance', totalAyats: 3, juz: 30 },
  { number: 109, name: 'Al-Kafirun', meaning: 'The Disbelievers', totalAyats: 6, juz: 30 },
  { number: 110, name: 'An-Nasr', meaning: 'The Divine Support', totalAyats: 3, juz: 30 },
  { number: 111, name: 'Al-Masad', meaning: 'The Palm Fiber', totalAyats: 5, juz: 30 },
  { number: 112, name: 'Al-Ikhlas', meaning: 'The Sincerity', totalAyats: 4, juz: 30 },
  { number: 113, name: 'Al-Falaq', meaning: 'The Daybreak', totalAyats: 5, juz: 30 },
  { number: 114, name: 'An-Nas', meaning: 'Mankind', totalAyats: 6, juz: 30 },
];

export function getSurahInfo(surahNumber: number): SurahInfo {
  return QURAN_SURAHS.find((s) => s.number === surahNumber) ?? QURAN_SURAHS[0];
}

export function getJuzInfo(juzNumber: number): JuzInfo {
  return QURAN_JUZ_LIST.find((j) => j.number === juzNumber) ?? QURAN_JUZ_LIST[0];
}

export interface AdvancePositionResult {
  startSurah: SurahInfo;
  startAyat: number;
  endSurah: SurahInfo;
  endAyat: number;
  newPosition: QuranPosition;
  summaryText: string;
}

/**
 * Given the child's current memorized bookmark (surahNumber, ayatNumber)
 * and a count of newly memorized Jadeed ayats, computes the range memorized today
 * and the new bookmark position (automatically advancing into subsequent Surahs if needed).
 */
export function advanceQuranPosition(
  pos: QuranPosition,
  ayatsAdded: number
): AdvancePositionResult {
  const safeStartSurah = getSurahInfo(pos.surahNumber);
  const clampedCurrentAyat = Math.max(0, Math.min(safeStartSurah.totalAyats, pos.ayatNumber));

  if (ayatsAdded <= 0) {
    return {
      startSurah: safeStartSurah,
      startAyat: clampedCurrentAyat,
      endSurah: safeStartSurah,
      endAyat: clampedCurrentAyat,
      newPosition: {
        juz: pos.juz,
        surahNumber: safeStartSurah.number,
        ayatNumber: clampedCurrentAyat,
      },
      summaryText: 'No new ayats logged',
    };
  }

  let curSurahIdx = QURAN_SURAHS.findIndex((s) => s.number === safeStartSurah.number);
  if (curSurahIdx < 0) curSurahIdx = 0;

  let curAyat = clampedCurrentAyat;
  // Determine the very first ayat of today's range
  let firstSurah = QURAN_SURAHS[curSurahIdx];
  let firstAyat = curAyat + 1;
  if (firstAyat > firstSurah.totalAyats) {
    if (curSurahIdx < QURAN_SURAHS.length - 1) {
      curSurahIdx += 1;
      firstSurah = QURAN_SURAHS[curSurahIdx];
      curAyat = 0;
      firstAyat = 1;
    } else {
      firstAyat = firstSurah.totalAyats;
    }
  }

  let remaining = ayatsAdded;
  let endSurah = firstSurah;
  let endAyat = curAyat;
  let crossedSurah = false;

  while (remaining > 0) {
    const surah = QURAN_SURAHS[curSurahIdx];
    const spaceLeftInSurah = surah.totalAyats - endAyat;

    if (remaining <= spaceLeftInSurah) {
      endAyat += remaining;
      endSurah = surah;
      remaining = 0;
    } else {
      remaining -= spaceLeftInSurah;
      if (curSurahIdx < QURAN_SURAHS.length - 1) {
        curSurahIdx += 1;
        endSurah = QURAN_SURAHS[curSurahIdx];
        endAyat = 0;
        crossedSurah = true;
      } else {
        // Reached end of An-Nas (Surah 114)
        endSurah = surah;
        endAyat = surah.totalAyats;
        remaining = 0;
      }
    }
  }

  const nextJuz = crossedSurah ? endSurah.juz : pos.juz;
  const summaryText =
    firstSurah.number === endSurah.number
      ? firstAyat === endAyat
        ? `Surah ${firstSurah.name} (Ayat ${firstAyat})`
        : `Surah ${firstSurah.name} (Ayats ${firstAyat}–${endAyat})`
      : `Surah ${firstSurah.name} (${firstAyat}–${firstSurah.totalAyats}) → ${endSurah.name} (1–${endAyat})`;

  return {
    startSurah: firstSurah,
    startAyat: firstAyat,
    endSurah,
    endAyat,
    newPosition: {
      juz: nextJuz,
      surahNumber: endSurah.number,
      ayatNumber: endAyat,
    },
    summaryText,
  };
}
