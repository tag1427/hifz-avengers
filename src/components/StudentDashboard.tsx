import { useRef, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  Flame,
  Gift,
  Plus,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { HERO_LIST, HERO_THEMES } from '../data/heroes';
import { createNewStudentProfile } from '../data/defaultState';
import {
  QURAN_JUZ_LIST,
  QURAN_SURAHS,
  calculateSiparaProgress,
  getSurahInfo,
  getSurahsForJuz,
} from '../data/quranMetadata';
import type { HeroId, StudentProfile, SurahDirection } from '../types/hifz';
import { useNativeDialogControls } from '../utils/dialogHelpers';
import { calculateStreak, getHeroRank } from '../utils/hifzMath';
import { HeroAvatarSvg } from './HeroAvatarSvg';

interface StudentDashboardProps {
  students: StudentProfile[];
  activeStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
  onOpenAddModal: () => void;
}

export function StudentDashboard({
  students,
  activeStudentId,
  onSelectStudent,
  onOpenAddModal,
}: StudentDashboardProps) {
  return (
    <div className="space-y-4">
      {/* Main Academy Banner */}
      <section
        aria-labelledby="dashboard-title"
        className="comic-card relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-sky-600 p-4 sm:p-5 text-white"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
            backgroundSize: '14px 14px',
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-yellow-300 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-900 shadow-comic-sm">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{students.length} {students.length === 1 ? 'Student' : 'Students'} Registered</span>
            </div>
            <h1
              id="dashboard-title"
              className="hero-title-fluid mt-2 font-comic tracking-wide text-white drop-shadow-[2px_2px_0_#0f172a]"
            >
              HIFZ AVENGERS ACADEMY
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-extrabold text-sky-100">
              Select a student to open their goals, daily marks &amp; progress — or add another child!
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="comic-btn inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-4 py-3 font-comic text-lg tracking-wide text-slate-950 hover:bg-yellow-400"
          >
            <UserPlus className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
            <span>+ ADD CHILD</span>
          </button>
        </div>
      </section>

      {/* Student Selector Grid */}
      <section aria-label="Student Profiles">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {students.map((student) => {
            const hero = HERO_THEMES[student.settings.heroId];
            const rank = getHeroRank(student.xp);
            const streak = calculateStreak(student.logs);
            const surah = getSurahInfo(student.quranPosition.surahNumber);
            const direction =
              student.longTermGoal.mode !== 'custom'
                ? (student.longTermGoal.surahDirection ??
                  student.quranPosition.surahDirection ??
                  'reverse')
                : (student.quranPosition.surahDirection ?? 'reverse');

            const shortTarget = Math.max(1, student.shortTermGoal.targetAyats);
            const shortCurrent = Math.max(0, student.shortTermGoal.currentAyats);
            const shortPct = Math.min(100, Math.round((shortCurrent / shortTarget) * 100));

            const sipara =
              student.longTermGoal.mode !== 'custom'
                ? calculateSiparaProgress(
                    student.longTermGoal.targetJuz ?? student.quranPosition.juz,
                    student.quranPosition,
                    direction
                  )
                : null;

            const longTarget = sipara
              ? Math.max(1, sipara.totalAyats)
              : Math.max(1, student.longTermGoal.targetValue);
            const longCurrent = sipara
              ? sipara.completedAyats
              : Math.max(0, student.longTermGoal.currentValue);
            const longPct = sipara
              ? sipara.percent
              : Math.min(100, Math.round((longCurrent / longTarget) * 100));
            const longLabel = sipara
              ? `Juz ${sipara.juz} Sipara`
              : student.longTermGoal.title;

            const pendingTreats = student.wonTreats.filter((wt) => !wt.delivered).length;
            const isSelected = student.id === activeStudentId;

            return (
              <button
                key={student.id}
                type="button"
                onClick={() => onSelectStudent(student.id)}
                className={`comic-card group flex flex-col overflow-hidden text-left transition-transform hover:-translate-y-0.5 active:translate-y-0.5 ${
                  isSelected ? 'ring-4 ring-amber-400' : ''
                }`}
              >
                {/* Hero Header Strip */}
                <div
                  className={`flex items-center gap-3 border-b-[2.5px] border-slate-900 bg-gradient-to-r ${hero.gradientClass} p-3.5 text-white`}
                >
                  <div className="relative shrink-0 rounded-full bg-white/15 p-1">
                    <HeroAvatarSvg heroId={student.settings.heroId} className="h-14 w-14 drop-shadow" />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-900 bg-yellow-300 px-1.5 py-0.5 text-[10px] font-black text-slate-900">
                      LVL {rank.level}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded border border-slate-900 bg-yellow-300 px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-900">
                      {hero.name}
                    </span>
                    <h2 className="mt-1 truncate font-comic text-2xl tracking-wide text-white drop-shadow-[1.5px_1.5px_0_#0f172a]">
                      {student.settings.childName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-white/95">
                      <span>⚡ {student.xp.toLocaleString()} XP</span>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-950/30 px-2 py-0.5">
                        <Flame className="h-3 w-3 text-amber-300" aria-hidden="true" />
                        {streak}d streak
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bookmark & Progress Body */}
                <div className="flex flex-1 flex-col justify-between space-y-3 bg-white p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-xl border-2 border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-extrabold text-slate-800">
                    <span className="inline-flex items-center gap-1.5 truncate">
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-orange-600" aria-hidden="true" />
                      <span className="truncate">
                        Juz {student.quranPosition.juz} • {surah.number}. {surah.name} (Ayat{' '}
                        {student.quranPosition.ayatNumber})
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px]" title={direction === 'reverse' ? 'Backwards Surah Order' : 'Forward Surah Order'}>
                      {direction === 'reverse' ? '⏪' : '⏩'}
                    </span>
                  </div>

                  {/* Mini Progress Bars */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-black text-slate-700">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-orange-500" aria-hidden="true" />
                          Weekly Target
                        </span>
                        <span className="text-orange-600">
                          {shortCurrent}/{shortTarget} Ayats ({shortPct}%)
                        </span>
                      </div>
                      <progress
                        className="comic-progress comic-progress--short mt-1"
                        max={shortTarget}
                        value={Math.min(shortCurrent, shortTarget)}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] font-black text-slate-700">
                        <span className="inline-flex items-center gap-1 truncate">
                          <Trophy className="h-3 w-3 shrink-0 text-purple-600" aria-hidden="true" />
                          <span className="truncate">{longLabel}</span>
                        </span>
                        <span className="shrink-0 text-purple-700">
                          {longCurrent}/{longTarget} ({longPct}%)
                        </span>
                      </div>
                      <progress
                        className="comic-progress comic-progress--long mt-1"
                        max={longTarget}
                        value={Math.min(longCurrent, longTarget)}
                      />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-xs font-black">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>{student.logs.length} logs</span>
                      {pendingTreats > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900">
                          <Gift className="h-3 w-3 text-rose-500" aria-hidden="true" />
                          {pendingTreats} treat{pendingTreats > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-white transition-transform group-hover:translate-x-0.5">
                      <span>Open Portal</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Add Another Student Card */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex min-h-[210px] flex-col items-center justify-center gap-2 rounded-[1.25rem] border-[3px] border-dashed border-slate-400 bg-white/80 p-6 text-center transition hover:border-slate-900 hover:bg-amber-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-900 bg-yellow-300 shadow-comic-sm">
              <Plus className="h-7 w-7 stroke-[2.5] text-slate-900" aria-hidden="true" />
            </div>
            <span className="font-comic text-2xl tracking-wide text-slate-900">
              + ADD ANOTHER CHILD
            </span>
            <span className="max-w-xs text-xs font-bold text-slate-600">
              Each child gets their own Quran bookmark, goals, marks history, XP level &amp; Spin Wheel treats.
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}

interface AddStudentDialogProps {
  isOpen: boolean;
  existingParentPin: string;
  onAddStudent: (student: StudentProfile) => void;
  onClose: () => void;
}

export function AddStudentDialog({
  isOpen,
  existingParentPin,
  onAddStudent,
  onClose,
}: AddStudentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [name, setName] = useState<string>('');
  const [heroId, setHeroId] = useState<HeroId>('captain-noor');
  const [juz, setJuz] = useState<number>(30);
  const [direction, setDirection] = useState<SurahDirection>('reverse');
  const [surahNumber, setSurahNumber] = useState<number>(114);
  const [ayatNumber, setAyatNumber] = useState<string>('0');
  const [weeklyTarget, setWeeklyTarget] = useState<string>('20');

  useNativeDialogControls(dialogRef, isOpen, () => {
    onClose();
  });

  const selectedSurah = getSurahInfo(surahNumber);

  const handleJuzOrDirectionChange = (nextJuz: number, nextDir: SurahDirection) => {
    setJuz(nextJuz);
    setDirection(nextDir);
    const orderedSurahs = getSurahsForJuz(nextJuz, nextDir);
    if (orderedSurahs.length > 0) {
      setSurahNumber(orderedSurahs[0].number);
      setAyatNumber('0');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const newStudent = createNewStudentProfile({
      name: trimmed,
      heroId,
      juz,
      surahNumber,
      ayatNumber: Math.max(0, Math.min(selectedSurah.totalAyats, parseInt(ayatNumber, 10) || 0)),
      surahDirection: direction,
      weeklyTargetAyats: Math.max(1, parseInt(weeklyTarget, 10) || 20),
      parentPin: existingParentPin,
    });

    onAddStudent(newStudent);
    setName('');
    setHeroId('captain-noor');
    setJuz(30);
    setDirection('reverse');
    setSurahNumber(114);
    setAyatNumber('0');
    setWeeklyTarget('20');
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="add-student-dialog-title"
      className="w-full"
    >
      <div className="comic-card overflow-hidden bg-white">
        <div className="flex items-center justify-between border-b-[3px] border-slate-900 bg-gradient-to-r from-indigo-700 to-sky-600 px-4 py-3 text-white">
          <h2 id="add-student-dialog-title" className="font-comic text-2xl tracking-wider">
            ADD NEW STUDENT HERO
          </h2>
          <form method="dialog">
            <button
              type="submit"
              value="close"
              aria-label="Close Add Student dialog"
              className="comic-btn flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75dvh] space-y-4 overflow-y-auto p-4">
          <div>
            <label
              htmlFor="new-student-name"
              className="block text-xs font-black uppercase text-slate-700"
            >
              Child / Student Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="new-student-name"
              name="childName"
              type="text"
              required
              autoFocus
              placeholder="e.g. Zayd or Amina"
              enterKeyHint="next"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900"
            />
          </div>

          <fieldset>
            <legend className="text-xs font-black uppercase text-slate-700">
              Choose Superhero Avatar
            </legend>
            <div className="mt-1.5 grid grid-cols-5 gap-1.5">
              {HERO_LIST.map((hero) => {
                const radioId = `new-hero-${hero.id}`;
                const selected = heroId === hero.id;
                return (
                  <div key={hero.id}>
                    <input
                      id={radioId}
                      type="radio"
                      name="heroId"
                      value={hero.id}
                      checked={selected}
                      onChange={() => setHeroId(hero.id)}
                      className="peer visually-hidden"
                    />
                    <label
                      htmlFor={radioId}
                      className={`flex cursor-pointer flex-col items-center rounded-xl border-2 p-1.5 text-center transition peer-focus-visible:ring-4 peer-focus-visible:ring-blue-600 ${
                        selected
                          ? 'border-slate-900 bg-amber-200 shadow-comic-sm'
                          : 'border-slate-300 bg-slate-50 hover:bg-amber-50'
                      }`}
                    >
                      <HeroAvatarSvg heroId={hero.id} className="h-10 w-10" />
                      <span className="mt-1 line-clamp-1 text-[10px] font-black text-slate-800">
                        {hero.name.split(' ')[0]}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-black uppercase text-slate-700">
              Memorization Order
            </legend>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <div>
                <input
                  id="new-dir-reverse"
                  type="radio"
                  name="surahDirection"
                  value="reverse"
                  checked={direction === 'reverse'}
                  onChange={() => handleJuzOrDirectionChange(juz, 'reverse')}
                  className="peer visually-hidden"
                />
                <label
                  htmlFor="new-dir-reverse"
                  className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border-2 px-3 py-2 text-center text-xs font-black peer-focus-visible:ring-4 peer-focus-visible:ring-blue-600 ${
                    direction === 'reverse'
                      ? 'border-slate-900 bg-indigo-600 text-white shadow-comic-sm'
                      : 'border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  ⏪ Backwards by Surah
                </label>
              </div>
              <div>
                <input
                  id="new-dir-forward"
                  type="radio"
                  name="surahDirection"
                  value="forward"
                  checked={direction === 'forward'}
                  onChange={() => handleJuzOrDirectionChange(juz, 'forward')}
                  className="peer visually-hidden"
                />
                <label
                  htmlFor="new-dir-forward"
                  className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border-2 px-3 py-2 text-center text-xs font-black peer-focus-visible:ring-4 peer-focus-visible:ring-blue-600 ${
                    direction === 'forward'
                      ? 'border-slate-900 bg-indigo-600 text-white shadow-comic-sm'
                      : 'border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  ⏩ Forward by Surah
                </label>
              </div>
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-student-juz"
                className="block text-xs font-black uppercase text-slate-700"
              >
                Starting Juz / Sipara
              </label>
              <select
                id="new-student-juz"
                name="juz"
                value={juz}
                onChange={(e) => handleJuzOrDirectionChange(Number(e.target.value), direction)}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900"
              >
                {QURAN_JUZ_LIST.map((j) => (
                  <option key={j.number} value={j.number}>
                    Juz {j.number} — {j.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="new-student-surah"
                className="block text-xs font-black uppercase text-slate-700"
              >
                Current Surah
              </label>
              <select
                id="new-student-surah"
                name="surahNumber"
                value={surahNumber}
                onChange={(e) => {
                  const nextSurah = getSurahInfo(Number(e.target.value));
                  setSurahNumber(nextSurah.number);
                  setAyatNumber('0');
                }}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900"
              >
                {QURAN_SURAHS.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name} ({s.totalAyats} ayats)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-student-ayat"
                className="block text-xs font-black uppercase text-slate-700"
              >
                Ayat Reached (0–{selectedSurah.totalAyats})
              </label>
              <input
                id="new-student-ayat"
                name="ayatNumber"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                enterKeyHint="next"
                value={ayatNumber}
                onChange={(e) => setAyatNumber(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 font-display text-base font-black text-orange-600"
              />
            </div>

            <div>
              <label
                htmlFor="new-student-weekly"
                className="block text-xs font-black uppercase text-slate-700"
              >
                Weekly Jadeed Goal (Ayats)
              </label>
              <input
                id="new-student-weekly"
                name="weeklyTargetAyats"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                enterKeyHint="done"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 font-display text-base font-black text-indigo-700"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="comic-btn rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-black uppercase text-slate-800 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black uppercase text-white hover:bg-emerald-600"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              <span>Create Student &amp; Open</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
