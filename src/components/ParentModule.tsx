import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  BookMarked,
  Check,
  Download,
  Edit3,
  Gift,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Sparkles,
  Trash2,
  Trophy,
  Unlock,
  Upload,
} from 'lucide-react';
import { getLocalDateString, normalizeMultiStore } from '../data/defaultState';
import {
  QURAN_JUZ_LIST,
  QURAN_SURAHS,
  calculateSiparaProgress,
  getAyatFromSurahLine,
  getSurahInfo,
  getSurahLineFromPosition,
} from '../data/quranMetadata';
import type { AppState, HifzMultiStore, LongTermGoal, SurahDirection, TreatItem } from '../types/hifz';

interface ParentModuleProps {
  state: AppState;
  totalStudents: number;
  allStudentsStore: HifzMultiStore;
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onDeleteStudent?: () => void;
  onRestoreBackup: (restored: HifzMultiStore) => void;
  onLoadDemo: () => void;
  onResetFresh: () => void;
}

const SLICE_COLORS = [
  '#f97316',
  '#3b82f6',
  '#dc2626',
  '#eab308',
  '#8b5cf6',
  '#10b981',
  '#ec4899',
  '#06b6d4',
];

const TREAT_EMOJIS = ['🍦', '🎮', '🦸‍♂️', '🍕', '🍿', '🌙', '⚽', '🎁', '🍩', '🚲', '🧩', '📚'];

export function ParentModule({
  state,
  totalStudents,
  allStudentsStore,
  isUnlocked,
  onUnlock,
  onLock,
  onUpdateState,
  onDeleteStudent,
  onRestoreBackup,
  onLoadDemo,
  onResetFresh,
}: ParentModuleProps) {
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Quran Bookmark (current position) local form
  const [qpJuz, setQpJuz] = useState<number>(state.quranPosition.juz);
  const [qpSurah, setQpSurah] = useState<number>(state.quranPosition.surahNumber);
  const [qpLine, setQpLine] = useState<string>(
    String(
      getSurahLineFromPosition(state.quranPosition, getSurahInfo(state.quranPosition.surahNumber))
    )
  );
  const [qpAyat, setQpAyat] = useState<string>(String(state.quranPosition.ayatNumber));
  const [qpDirection, setQpDirection] = useState<SurahDirection>(
    state.quranPosition.surahDirection ?? 'reverse'
  );

  // Short-term goal local form
  const [stTitle, setStTitle] = useState<string>(state.shortTermGoal.title);
  const [stTarget, setStTarget] = useState<string>(String(state.shortTermGoal.targetAyats));
  const [stCurrent, setStCurrent] = useState<string>(String(state.shortTermGoal.currentAyats));

  // Long-term goal local form
  const [ltTitle, setLtTitle] = useState<string>(state.longTermGoal.title);
  const [ltMode, setLtMode] = useState<'sipara' | 'custom'>(state.longTermGoal.mode ?? 'sipara');
  const [ltTargetJuz, setLtTargetJuz] = useState<number>(
    state.longTermGoal.targetJuz ?? state.quranPosition.juz
  );
  const [ltDirection, setLtDirection] = useState<SurahDirection>(
    state.longTermGoal.surahDirection ?? state.quranPosition.surahDirection ?? 'reverse'
  );
  const [ltUnit, setLtUnit] = useState<'lines' | 'ayats' | 'pages'>(
    state.longTermGoal.unit === 'pages' ? 'pages' : 'lines'
  );
  const [ltTarget, setLtTarget] = useState<string>(String(state.longTermGoal.targetValue));
  const [ltCurrent, setLtCurrent] = useState<string>(String(state.longTermGoal.currentValue));
  const [ltTreatLabel, setLtTreatLabel] = useState<string>(state.longTermGoal.grandTreatLabel);
  const [ltTreatEmoji, setLtTreatEmoji] = useState<string>(state.longTermGoal.grandTreatEmoji);
  const [ltClaimed, setLtClaimed] = useState<boolean>(state.longTermGoal.claimed);

  // Add/Edit Treat form
  const [newTreatLabel, setNewTreatLabel] = useState<string>('');
  const [newTreatEmoji, setNewTreatEmoji] = useState<string>('🎁');
  const [newTreatColor, setNewTreatColor] = useState<string>(SLICE_COLORS[0]);
  const [editingTreatId, setEditingTreatId] = useState<string | null>(null);
  const [editTreatLabel, setEditTreatLabel] = useState<string>('');
  const [editTreatEmoji, setEditTreatEmoji] = useState<string>('🎁');

  // Settings local form
  const [childName, setChildName] = useState<string>(state.settings.childName);
  const [defaultMurajaat, setDefaultMurajaat] = useState<string>(
    String(state.settings.defaultMurajaatPages)
  );
  const [defaultJuzHali, setDefaultJuzHali] = useState<string>(
    String(state.settings.defaultJuzHaliPages)
  );
  const [ayatsPerPage, setAyatsPerPage] = useState<string>(String(state.settings.ayatsPerPage));
  const [pagesPerSipara, setPagesPerSipara] = useState<string>(
    String(state.settings.pagesPerSipara)
  );
  const [newPin, setNewPin] = useState<string>(state.settings.parentPin);

  const [savedNotice, setSavedNotice] = useState<string>('');
  const [confirmResetMode, setConfirmResetMode] = useState<'demo' | 'fresh' | null>(null);
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState<boolean>(false);

  const showSavedToast = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => {
      setSavedNotice((cur) => (cur === msg ? '' : cur));
    }, 3000);
  };

  const handlePinSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pinInput.trim() === state.settings.parentPin) {
      setPinError('');
      setPinInput('');
      // Sync local drafts when entering Parent HQ
      setQpJuz(state.quranPosition.juz);
      setQpSurah(state.quranPosition.surahNumber);
      setQpLine(
        String(
          getSurahLineFromPosition(state.quranPosition, getSurahInfo(state.quranPosition.surahNumber))
        )
      );
      setQpAyat(String(state.quranPosition.ayatNumber));
      setQpDirection(state.quranPosition.surahDirection ?? 'reverse');
      setStTitle(state.shortTermGoal.title);
      setStTarget(String(state.shortTermGoal.targetAyats));
      setStCurrent(String(state.shortTermGoal.currentAyats));
      setLtTitle(state.longTermGoal.title);
      setLtMode(state.longTermGoal.mode ?? 'sipara');
      setLtTargetJuz(state.longTermGoal.targetJuz ?? state.quranPosition.juz);
      setLtDirection(
        state.longTermGoal.surahDirection ?? state.quranPosition.surahDirection ?? 'reverse'
      );
      setLtUnit(state.longTermGoal.unit === 'pages' ? 'pages' : 'lines');
      setLtTarget(String(state.longTermGoal.targetValue));
      setLtCurrent(String(state.longTermGoal.currentValue));
      setLtTreatLabel(state.longTermGoal.grandTreatLabel);
      setLtTreatEmoji(state.longTermGoal.grandTreatEmoji);
      setLtClaimed(state.longTermGoal.claimed);
      setChildName(state.settings.childName);
      setDefaultMurajaat(String(state.settings.defaultMurajaatPages));
      setDefaultJuzHali(String(state.settings.defaultJuzHaliPages));
      setAyatsPerPage(String(state.settings.ayatsPerPage));
      setPagesPerSipara(String(state.settings.pagesPerSipara));
      setNewPin(state.settings.parentPin);
      onUnlock();
    } else {
      setPinError('Incorrect 4-digit PIN. Default is 1234.');
    }
  };

  if (!isUnlocked) {
    return (
      <section aria-labelledby="parent-gate-heading" className="comic-card bg-white p-5 sm:p-6">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-slate-900 bg-indigo-100 shadow-comic-sm">
            <Lock className="h-8 w-8 text-indigo-700" aria-hidden="true" />
          </div>
          <h2 id="parent-gate-heading" className="mt-3 font-comic text-3xl tracking-wide text-slate-900">
            Parent Command HQ
          </h2>
          <p className="mt-1 text-sm font-bold text-slate-600">
            Set short-term &amp; long-term goals, customize Spin Wheel treats, and manage rewards.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-5 space-y-3 text-left">
            <div>
              <label htmlFor="parent-pin-input" className="block text-xs font-black uppercase text-slate-700">
                Enter 4-Digit Parent PIN
              </label>
              <input
                id="parent-pin-input"
                name="parentPin"
                type="text"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                autoComplete="off"
                enterKeyHint="done"
                required
                placeholder="1234"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                  if (pinError) setPinError('');
                }}
                aria-invalid={pinError ? 'true' : 'false'}
                aria-describedby="pin-hint pin-error"
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-4 py-2.5 text-center font-display text-2xl font-black tracking-[0.5em] text-slate-900"
              />
              <p id="pin-hint" className="mt-1.5 text-center text-xs font-bold text-slate-500">
                Default PIN: <strong className="text-slate-800">1234</strong> (changeable inside)
              </p>
              {pinError && (
                <p id="pin-error" role="alert" className="mt-1.5 text-center text-xs font-black text-red-600">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="comic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-display text-base font-black text-white hover:bg-indigo-700"
            >
              <Unlock className="h-5 w-5" aria-hidden="true" />
              <span>Unlock Parent HQ</span>
            </button>
          </form>
        </div>
      </section>
    );
  }

  const handleSaveShortTerm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = Math.max(1, parseInt(stTarget, 10) || 20);
    const current = Math.max(0, parseInt(stCurrent, 10) || 0);
    onUpdateState((prev) => ({
      ...prev,
      shortTermGoal: {
        ...prev.shortTermGoal,
        title: stTitle.trim() || "This Week's Jadeed Target",
        targetAyats: target,
        currentAyats: current,
      },
    }));
    showSavedToast('Short-term goal updated!');
  };

  const handleGrantBonusSpin = () => {
    onUpdateState((prev) => ({
      ...prev,
      shortTermGoal: {
        ...prev.shortTermGoal,
        bonusSpins: prev.shortTermGoal.bonusSpins + 1,
      },
    }));
    showSavedToast('Granted +1 Bonus Wheel Spin!');
  };

  const handleSaveLongTerm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const siparaCalc = calculateSiparaProgress(ltTargetJuz, state.quranPosition, ltDirection);
    const updatedLongTerm: LongTermGoal =
      ltMode === 'sipara'
        ? {
            title: ltTitle.trim() || `Complete Juz ${ltTargetJuz} (${siparaCalc.juzInfo.name})`,
            mode: 'sipara',
            targetJuz: ltTargetJuz,
            surahDirection: ltDirection,
            unit: 'lines',
            targetValue: siparaCalc.totalLines,
            currentValue: siparaCalc.completedLines,
            grandTreatLabel: ltTreatLabel.trim() || 'Special Grand Treat',
            grandTreatEmoji: ltTreatEmoji.trim() || '🏆',
            claimed: ltClaimed,
          }
        : {
            title: ltTitle.trim() || 'Long-Term Quran Quest',
            mode: 'custom',
            unit: ltUnit === 'pages' ? 'pages' : 'lines',
            targetValue: Math.max(1, parseInt(ltTarget, 10) || 300),
            currentValue: Math.max(0, parseInt(ltCurrent, 10) || 0),
            grandTreatLabel: ltTreatLabel.trim() || 'Special Grand Treat',
            grandTreatEmoji: ltTreatEmoji.trim() || '🏆',
            claimed: ltClaimed,
          };
    onUpdateState((prev) => ({
      ...prev,
      longTermGoal: updatedLongTerm,
      quranPosition:
        ltMode === 'sipara'
          ? { ...prev.quranPosition, surahDirection: ltDirection }
          : prev.quranPosition,
    }));
    if (ltMode === 'sipara') {
      setQpDirection(ltDirection);
    }
    showSavedToast('Long-term goal & Grand Treat saved!');
  };

  const handleAddTreat = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const label = newTreatLabel.trim();
    if (!label) return;
    const newItem: TreatItem = {
      id: `treat-${Date.now()}`,
      label,
      emoji: newTreatEmoji || '🎁',
      color: newTreatColor,
    };
    onUpdateState((prev) => ({
      ...prev,
      treats: [...prev.treats, newItem],
    }));
    setNewTreatLabel('');
    setNewTreatColor(SLICE_COLORS[(state.treats.length + 1) % SLICE_COLORS.length]);
    showSavedToast(`Added "${label}" to Spin Wheel!`);
  };

  const handleSaveTreatEdit = (id: string) => {
    const trimmed = editTreatLabel.trim();
    if (!trimmed) return;
    onUpdateState((prev) => ({
      ...prev,
      treats: prev.treats.map((t) =>
        t.id === id ? { ...t, label: trimmed, emoji: editTreatEmoji || t.emoji } : t
      ),
    }));
    setEditingTreatId(null);
    showSavedToast('Treat updated!');
  };

  const handleDeleteTreat = (id: string) => {
    if (state.treats.length <= 1) {
      showSavedToast('Keep at least 1 treat on the wheel!');
      return;
    }
    onUpdateState((prev) => ({
      ...prev,
      treats: prev.treats.filter((t) => t.id !== id),
    }));
    showSavedToast('Treat removed from wheel.');
  };

  const selectedSurahInfo = getSurahInfo(qpSurah);

  const handleSaveQuranPosition = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const maxLine = selectedSurahInfo.totalLines;
    const maxAyat = selectedSurahInfo.totalAyats;
    const parsedLine = Math.max(0, Math.min(maxLine, parseInt(qpLine, 10) || 0));
    const parsedAyat = Math.max(
      0,
      Math.min(maxAyat, parseInt(qpAyat, 10) || getAyatFromSurahLine(parsedLine, selectedSurahInfo))
    );
    setQpLine(String(parsedLine));
    setQpAyat(String(parsedAyat));
    onUpdateState((prev) => {
      const nextPos = {
        juz: qpJuz,
        surahNumber: qpSurah,
        ayatNumber: parsedAyat,
        lineNumber: parsedLine,
        surahDirection: qpDirection,
      };
      if (prev.longTermGoal.mode !== 'custom') {
        const recalculated = calculateSiparaProgress(
          prev.longTermGoal.targetJuz ?? qpJuz,
          nextPos,
          qpDirection
        );
        return {
          ...prev,
          quranPosition: nextPos,
          longTermGoal: {
            ...prev.longTermGoal,
            surahDirection: qpDirection,
            unit: 'lines',
            targetValue: recalculated.totalLines,
            currentValue: recalculated.completedLines,
          },
        };
      }
      return {
        ...prev,
        quranPosition: nextPos,
      };
    });
    setLtDirection(qpDirection);
    showSavedToast(
      `Quran Bookmark set to Juz ${qpJuz} • Surah ${selectedSurahInfo.name}, Line ${parsedLine}/${maxLine} (${qpDirection === 'reverse' ? 'Backwards' : 'Forward'})!`
    );
  };

  const handleSaveSettings = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedPin = /^\d{4}$/.test(newPin) ? newPin : state.settings.parentPin;
    onUpdateState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        childName: childName.trim() || 'Little Champion',
        defaultMurajaatPages: Math.max(1, parseInt(defaultMurajaat, 10) || 10),
        defaultJuzHaliPages: Math.max(1, parseInt(defaultJuzHali, 10) || 4),
        ayatsPerPage: Math.max(1, parseInt(ayatsPerPage, 10) || 15),
        pagesPerSipara: Math.max(1, parseInt(pagesPerSipara, 10) || 20),
        parentPin: sanitizedPin,
      },
    }));
    showSavedToast('Profile & Mushaf settings saved!');
  };

  const handleDownloadBackup = () => {
    try {
      const json = JSON.stringify(allStudentsStore, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hifz-avengers-backup-${getLocalDateString()}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showSavedToast('Full multi-student backup file downloaded!');
    } catch {
      showSavedToast('Could not generate backup file.');
    }
  };

  const handleRestoreFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const restored = normalizeMultiStore(parsed);
      onRestoreBackup(restored);
      showSavedToast(`Restored ${restored.students.length} student profile(s) cleanly!`);
    } catch {
      showSavedToast('Invalid backup JSON file. Nothing was changed.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="comic-card flex flex-wrap items-center justify-between gap-2 bg-indigo-700 p-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-comic text-2xl tracking-wide">PARENT COMMAND CENTER</h2>
            <span className="rounded-full border border-slate-900 bg-yellow-300 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-900">
              Student: {state.settings.childName}
            </span>
          </div>
          <p className="text-xs font-bold text-indigo-100">
            Configure goals, Spin Wheel treats, &amp; deliver rewards for {state.settings.childName}
          </p>
        </div>
        <button
          type="button"
          onClick={onLock}
          className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-black uppercase text-slate-900 hover:bg-slate-100"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          <span>Lock HQ</span>
        </button>
      </div>

      {/* Live Save Toast */}
      {savedNotice && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border-2 border-slate-900 bg-emerald-300 px-4 py-2.5 text-center text-sm font-black text-slate-950 shadow-comic-sm"
        >
          ✅ {savedNotice}
        </div>
      )}

      {/* 0. Quran Bookmark (Current Juz, Surah & Line) */}
      <section aria-labelledby="qp-editor-heading" className="comic-card bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-orange-600" aria-hidden="true" />
          <h3 id="qp-editor-heading" className="font-comic text-xl tracking-wide text-slate-900">
            Quran Bookmark (15-Line Misri Mushaf)
          </h3>
        </div>
        <p className="mt-1 text-xs font-bold text-slate-600">
          Set where {state.settings.childName} currently is in Jadeed. When logging new Misri lines (15 lines = 1 page), the app auto-calculates from this exact spot!
        </p>

        <form onSubmit={handleSaveQuranPosition} className="mt-3 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="qp-surah" className="block text-xs font-black uppercase text-slate-700">
                Current Surah (1–114)
              </label>
              <select
                id="qp-surah"
                value={qpSurah}
                onChange={(e) => {
                  const num = parseInt(e.target.value, 10);
                  const info = getSurahInfo(num);
                  setQpSurah(num);
                  setQpJuz(info.juz);
                  const currentLineNum = Math.min(info.totalLines, parseInt(qpLine, 10) || 0);
                  setQpLine(String(currentLineNum));
                  setQpAyat(String(getAyatFromSurahLine(currentLineNum, info)));
                }}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold text-slate-900"
              >
                {QURAN_SURAHS.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name} ({s.totalLines} lines · {s.totalAyats} ayats)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="qp-juz" className="block text-xs font-black uppercase text-slate-700">
                Current Juz / Sipara (1–30)
              </label>
              <select
                id="qp-juz"
                value={qpJuz}
                onChange={(e) => setQpJuz(parseInt(e.target.value, 10))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold text-slate-900"
              >
                {QURAN_JUZ_LIST.map((j) => (
                  <option key={j.number} value={j.number}>
                    Juz {j.number} — {j.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="w-36">
              <label htmlFor="qp-line" className="block text-xs font-black uppercase text-slate-700">
                Line Reached (0–{selectedSurahInfo.totalLines})
              </label>
              <input
                id="qp-line"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={qpLine}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '');
                  setQpLine(clean);
                  const n = Math.min(selectedSurahInfo.totalLines, parseInt(clean, 10) || 0);
                  setQpAyat(String(getAyatFromSurahLine(n, selectedSurahInfo)));
                }}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 font-display text-base font-black text-orange-600"
              />
            </div>

            <div className="w-36">
              <label htmlFor="qp-ayat" className="block text-xs font-black uppercase text-slate-700">
                Approx Ayat (0–{selectedSurahInfo.totalAyats})
              </label>
              <input
                id="qp-ayat"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={qpAyat}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '');
                  setQpAyat(clean);
                  const n = Math.min(selectedSurahInfo.totalAyats, parseInt(clean, 10) || 0);
                  setQpLine(
                    String(
                      getSurahLineFromPosition(
                        { juz: qpJuz, surahNumber: qpSurah, ayatNumber: n },
                        selectedSurahInfo
                      )
                    )
                  );
                }}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 font-display text-base font-black text-slate-700"
              />
            </div>

            <div className="min-w-[200px] flex-1">
              <label htmlFor="qp-direction" className="block text-xs font-black uppercase text-slate-700">
                Memorization Order
              </label>
              <select
                id="qp-direction"
                value={qpDirection}
                onChange={(e) => setQpDirection(e.target.value as SurahDirection)}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold text-slate-900"
              >
                <option value="reverse">⏪ Backwards by Surah (e.g. 51 → 46)</option>
                <option value="forward">⏩ Forward by Surah (e.g. 46 → 51)</option>
              </select>
            </div>

            <button
              type="submit"
              className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-orange-600"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>Save Quran Bookmark</span>
            </button>
          </div>
        </form>
      </section>

      {/* 1. Short-Term Goal Editor */}
      <section aria-labelledby="st-editor-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="st-editor-heading" className="font-comic text-xl tracking-wide text-slate-900">
            1. Short-Term Jadeed Goal (Spin Wheel)
          </h3>
          <button
            type="button"
            onClick={handleGrantBonusSpin}
            className="comic-btn inline-flex items-center gap-1 rounded-xl bg-amber-300 px-3 py-1.5 text-xs font-black text-slate-950 hover:bg-amber-400"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>+1 Bonus Spin ({state.shortTermGoal.bonusSpins})</span>
          </button>
        </div>

        <form onSubmit={handleSaveShortTerm} className="mt-3 space-y-3">
          <div>
            <label htmlFor="st-title" className="block text-xs font-black uppercase text-slate-700">
              Goal Title
            </label>
            <input
              id="st-title"
              type="text"
              required
              value={stTitle}
              onChange={(e) => setStTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="st-target" className="block text-xs font-black uppercase text-slate-700">
                Target Misri Lines (e.g. 30 = 2 pgs)
              </label>
              <input
                id="st-target"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={stTarget}
                onChange={(e) => setStTarget(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 font-display text-base font-black"
              />
            </div>
            <div>
              <label htmlFor="st-current" className="block text-xs font-black uppercase text-slate-700">
                Current Lines Done
              </label>
              <input
                id="st-current"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={stCurrent}
                onChange={(e) => setStCurrent(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 font-display text-base font-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-black uppercase text-white hover:bg-orange-600"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>Save Short-Term Goal</span>
          </button>
        </form>
      </section>

      {/* 2. Spin Wheel Treat List Manager */}
      <section aria-labelledby="treat-manager-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-red-600" aria-hidden="true" />
          <h3 id="treat-manager-heading" className="font-comic text-xl tracking-wide text-slate-900">
            2. Spin Wheel Treat List ({state.treats.length})
          </h3>
        </div>
        <p className="mt-0.5 text-xs font-bold text-slate-600">
          Add the treats you want on the wheel. Wherever it lands, your son wins that treat!
        </p>

        <ul className="mt-3 space-y-2">
          {state.treats.map((treat) => (
            <li
              key={treat.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-slate-900 bg-slate-50 p-2.5"
            >
              {editingTreatId === treat.id ? (
                <div className="flex w-full flex-wrap items-center gap-2">
                  <label htmlFor={`edit-emoji-${treat.id}`} className="visually-hidden">
                    Treat emoji
                  </label>
                  <input
                    id={`edit-emoji-${treat.id}`}
                    type="text"
                    value={editTreatEmoji}
                    onChange={(e) => setEditTreatEmoji(e.target.value)}
                    className="w-14 rounded-lg border-2 border-slate-900 bg-white px-2 py-1 text-center text-lg"
                    maxLength={4}
                  />
                  <label htmlFor={`edit-label-${treat.id}`} className="visually-hidden">
                    Treat label
                  </label>
                  <input
                    id={`edit-label-${treat.id}`}
                    type="text"
                    value={editTreatLabel}
                    onChange={(e) => setEditTreatLabel(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border-2 border-slate-900 bg-white px-2.5 py-1 text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveTreatEdit(treat.id)}
                    className="comic-btn rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-black text-slate-950"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTreatId(null)}
                    className="comic-btn rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-900"
                      style={{ backgroundColor: treat.color }}
                      aria-hidden="true"
                    />
                    <span className="text-xl" aria-hidden="true">
                      {treat.emoji}
                    </span>
                    <span className="truncate text-sm font-extrabold text-slate-900">
                      {treat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Edit ${treat.label}`}
                      onClick={() => {
                        setEditingTreatId(treat.id);
                        setEditTreatLabel(treat.label);
                        setEditTreatEmoji(treat.emoji);
                      }}
                      className="comic-btn flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-amber-100"
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${treat.label}`}
                      onClick={() => handleDeleteTreat(treat.id)}
                      className="comic-btn flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Add Treat Form */}
        <form onSubmit={handleAddTreat} className="mt-3 rounded-2xl border-2 border-dashed border-slate-400 bg-amber-50/70 p-3 space-y-2.5">
          <p className="text-xs font-black uppercase text-slate-700">Add New Treat to Wheel</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[160px]">
              <label htmlFor="new-treat-label" className="visually-hidden">
                New treat name
              </label>
              <input
                id="new-treat-label"
                type="text"
                required
                placeholder="e.g. Trip to Trampoline Park"
                value={newTreatLabel}
                onChange={(e) => setNewTreatLabel(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold"
              />
            </div>
            <div className="w-20">
              <label htmlFor="new-treat-emoji" className="visually-hidden">
                Treat emoji
              </label>
              <input
                id="new-treat-emoji"
                type="text"
                value={newTreatEmoji}
                onChange={(e) => setNewTreatEmoji(e.target.value)}
                maxLength={4}
                className="w-full rounded-xl border-2 border-slate-900 bg-white px-2 py-2 text-center text-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {TREAT_EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setNewTreatEmoji(em)}
                className={`rounded-lg border px-2 py-1 text-base ${
                  newTreatEmoji === em ? 'border-slate-900 bg-amber-300' : 'border-slate-300 bg-white'
                }`}
              >
                {em}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Slice Color:</span>
              {SLICE_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  aria-label={`Select color ${col}`}
                  onClick={() => setNewTreatColor(col)}
                  className={`h-6 w-6 rounded-full border-2 ${
                    newTreatColor === col ? 'border-slate-950 scale-125' : 'border-white'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
            <button
              type="submit"
              className="comic-btn inline-flex items-center gap-1 rounded-xl bg-emerald-400 px-3.5 py-2 text-xs font-black uppercase text-slate-950 hover:bg-emerald-500"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Treat</span>
            </button>
          </div>
        </form>
      </section>

      {/* 3. Long-Term Goal & Grand Treat Editor */}
      <section aria-labelledby="lt-editor-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" aria-hidden="true" />
          <h3 id="lt-editor-heading" className="font-comic text-xl tracking-wide text-slate-900">
            3. Long-Term Goal &amp; Grand Treat
          </h3>
        </div>

        <form onSubmit={handleSaveLongTerm} className="mt-3 space-y-3">
          <div>
            <span className="block text-xs font-black uppercase text-slate-700">
              Goal Type
            </span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLtMode('sipara');
                  if (!ltTitle.trim() || ltTitle === 'Long-Term Quran Quest') {
                    const info = calculateSiparaProgress(ltTargetJuz, state.quranPosition, ltDirection);
                    setLtTitle(`Complete Juz ${ltTargetJuz} (${info.juzInfo.name})`);
                  }
                }}
                className={`rounded-xl border-2 border-slate-900 px-3 py-2 text-xs font-black uppercase transition ${
                  ltMode === 'sipara'
                    ? 'bg-purple-600 text-white shadow-comic-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-purple-50'
                }`}
              >
                📖 Complete a Sipara / Juz
              </button>
              <button
                type="button"
                onClick={() => setLtMode('custom')}
                className={`rounded-xl border-2 border-slate-900 px-3 py-2 text-xs font-black uppercase transition ${
                  ltMode === 'custom'
                    ? 'bg-purple-600 text-white shadow-comic-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-purple-50'
                }`}
              >
                ✏️ Custom Ayats / Pages
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="lt-title" className="block text-xs font-black uppercase text-slate-700">
              Long-Term Quest Title
            </label>
            <input
              id="lt-title"
              type="text"
              required
              value={ltTitle}
              onChange={(e) => setLtTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold"
            />
          </div>

          {ltMode === 'sipara' ? (
            (() => {
              const preview = calculateSiparaProgress(
                ltTargetJuz,
                state.quranPosition,
                ltDirection
              );
              const curSurah = getSurahInfo(state.quranPosition.surahNumber);
              return (
                <div className="space-y-2.5 rounded-2xl border-2 border-purple-300 bg-purple-50/70 p-3">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lt-juz" className="block text-xs font-black uppercase text-slate-700">
                        Select Sipara / Juz (1–30)
                      </label>
                      <select
                        id="lt-juz"
                        value={ltTargetJuz}
                        onChange={(e) => {
                          const nextJuz = Number(e.target.value);
                          setLtTargetJuz(nextJuz);
                          const info = calculateSiparaProgress(
                            nextJuz,
                            state.quranPosition,
                            ltDirection
                          );
                          if (
                            !ltTitle.trim() ||
                            ltTitle.startsWith('Complete Juz ') ||
                            ltTitle.startsWith('Conquer Juz ') ||
                            ltTitle === 'Complete 1 Full Sipara (Juz)'
                          ) {
                            setLtTitle(`Complete Juz ${nextJuz} (${info.juzInfo.name})`);
                          }
                        }}
                        className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold text-slate-900"
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
                        htmlFor="lt-direction"
                        className="block text-xs font-black uppercase text-slate-700"
                      >
                        Surah Direction in Juz
                      </label>
                      <select
                        id="lt-direction"
                        value={ltDirection}
                        onChange={(e) => setLtDirection(e.target.value as SurahDirection)}
                        className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold text-slate-900"
                      >
                        <option value="reverse">
                          ⏪ Backwards ({preview.lastSurahOfJuz.number}. {preview.lastSurahOfJuz.name} → {preview.firstSurahOfJuz.number}. {preview.firstSurahOfJuz.name})
                        </option>
                        <option value="forward">
                          ⏩ Forward ({preview.firstSurahOfJuz.number}. {preview.firstSurahOfJuz.name} → {preview.lastSurahOfJuz.number}. {preview.lastSurahOfJuz.name})
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-slate-900 bg-white p-2.5 text-xs font-bold text-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span>
                        📍 Bookmark: Juz {state.quranPosition.juz} • {curSurah.number}. {curSurah.name} (Line{' '}
                        {getSurahLineFromPosition(state.quranPosition, curSurah)}/{curSurah.totalLines})
                      </span>
                      <span className="font-display text-sm font-black text-purple-700">
                        {preview.completedLines}/{preview.totalLines} Lines ({preview.completedPages}/{preview.totalPages} pgs • {preview.percent}%)
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-extrabold text-indigo-800">
                      🏁 Sipara completion is achieved when he finishes{' '}
                      <span className="underline">
                        Surah {preview.finishingSurah.number}. {preview.finishingSurah.name}
                      </span>{' '}
                      ({preview.finishingSurah.totalLines} lines / Ayat {preview.finishingSurah.totalAyats}).
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label htmlFor="lt-unit" className="block text-xs font-black uppercase text-slate-700">
                  Unit
                </label>
                <select
                  id="lt-unit"
                  value={ltUnit === 'pages' ? 'pages' : 'lines'}
                  onChange={(e) => setLtUnit(e.target.value as 'lines' | 'ayats' | 'pages')}
                  className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-2 py-2 text-sm font-bold"
                >
                  <option value="lines">Lines (15/page)</option>
                  <option value="pages">Pages</option>
                </select>
              </div>
              <div>
                <label htmlFor="lt-target" className="block text-xs font-black uppercase text-slate-700">
                  Target
                </label>
                <input
                  id="lt-target"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={ltTarget}
                  onChange={(e) => setLtTarget(e.target.value.replace(/\D/g, ''))}
                  className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 font-display text-base font-black"
                />
              </div>
              <div>
                <label htmlFor="lt-current" className="block text-xs font-black uppercase text-slate-700">
                  Current
                </label>
                <input
                  id="lt-current"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={ltCurrent}
                  onChange={(e) => setLtCurrent(e.target.value.replace(/\D/g, ''))}
                  className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 font-display text-base font-black"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-[1fr_5rem] gap-2.5">
            <div>
              <label htmlFor="lt-treat-label" className="block text-xs font-black uppercase text-slate-700">
                Grand Treat Reward
              </label>
              <input
                id="lt-treat-label"
                type="text"
                required
                placeholder="e.g. LEGO Avengers Quinjet"
                value={ltTreatLabel}
                onChange={(e) => setLtTreatLabel(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold"
              />
            </div>
            <div>
              <label htmlFor="lt-treat-emoji" className="block text-xs font-black uppercase text-slate-700">
                Emoji
              </label>
              <input
                id="lt-treat-emoji"
                type="text"
                maxLength={4}
                value={ltTreatEmoji}
                onChange={(e) => setLtTreatEmoji(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-2 py-2 text-center text-lg"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-extrabold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={ltClaimed}
              onChange={(e) => setLtClaimed(e.target.checked)}
              className="h-5 w-5 accent-purple-600"
            />
            <span>Mark current long-term Grand Prize as already claimed</span>
          </label>

          <button
            type="submit"
            className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-purple-700"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>Save Long-Term Quest</span>
          </button>
        </form>
      </section>

      {/* 4. Reward Delivery & Log Management */}
      <section aria-labelledby="delivery-heading" className="comic-card bg-white p-4 sm:p-5">
        <h3 id="delivery-heading" className="font-comic text-xl tracking-wide text-slate-900">
          4. Won Treats Delivery Checklist
        </h3>
        {state.wonTreats.length === 0 ? (
          <p className="mt-2 text-xs font-bold text-slate-500">No treats won yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {[...state.wonTreats]
              .sort((a, b) => b.wonAt.localeCompare(a.wonAt))
              .map((wt) => (
                <li
                  key={wt.id}
                  className="flex items-center justify-between gap-2 rounded-xl border-2 border-slate-900 bg-slate-50 p-2.5 text-xs font-bold"
                >
                  <span className="truncate">
                    {wt.emoji} <strong>{wt.label}</strong> ({wt.wonAt.slice(0, 10)})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateState((prev) => ({
                        ...prev,
                        wonTreats: prev.wonTreats.map((item) =>
                          item.id === wt.id ? { ...item, delivered: !item.delivered } : item
                        ),
                      }))
                    }
                    className={`comic-btn inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-black ${
                      wt.delivered
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-yellow-300 text-slate-950'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{wt.delivered ? 'Delivered' : 'Mark Delivered'}</span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>

      {/* 5. Profile, Mushaf Calibration & Data */}
      <section aria-labelledby="settings-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-slate-700" aria-hidden="true" />
          <h3 id="settings-heading" className="font-comic text-xl tracking-wide text-slate-900">
            5. Child Profile, Mushaf Pace &amp; PIN
          </h3>
        </div>

        <form onSubmit={handleSaveSettings} className="mt-3 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="child-name-input" className="block text-xs font-black uppercase text-slate-700">
                Child&apos;s Hero Name
              </label>
              <input
                id="child-name-input"
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold"
              />
            </div>
            <div>
              <label htmlFor="change-pin-input" className="block text-xs font-black uppercase text-slate-700">
                Parent 4-Digit PIN
              </label>
              <input
                id="change-pin-input"
                type="text"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 font-display text-base font-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label htmlFor="def-murajaat" className="block text-[11px] font-black uppercase text-slate-700">
                Murajaat Pgs/Day
              </label>
              <input
                id="def-murajaat"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={defaultMurajaat}
                onChange={(e) => setDefaultMurajaat(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-2.5 py-2 text-center font-display font-black"
              />
            </div>
            <div>
              <label htmlFor="def-juzhali" className="block text-[11px] font-black uppercase text-slate-700">
                Juz Hali Pgs/Day
              </label>
              <input
                id="def-juzhali"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={defaultJuzHali}
                onChange={(e) => setDefaultJuzHali(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-2.5 py-2 text-center font-display font-black"
              />
            </div>
            <div>
              <label htmlFor="ayats-per-page" className="block text-[11px] font-black uppercase text-slate-700">
                Lines / Page (Misri)
              </label>
              <input
                id="ayats-per-page"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={ayatsPerPage}
                onChange={(e) => setAyatsPerPage(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-2.5 py-2 text-center font-display font-black"
              />
            </div>
            <div>
              <label htmlFor="pages-per-sipara" className="block text-[11px] font-black uppercase text-slate-700">
                Pages / Sipara
              </label>
              <input
                id="pages-per-sipara"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pagesPerSipara}
                onChange={(e) => setPagesPerSipara(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-2.5 py-2 text-center font-display font-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase text-white hover:bg-slate-800"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>Save Settings</span>
          </button>
        </form>

        {/* Manage Daily Logs & Data Reset */}
        {state.logs.length > 0 && (
          <div className="mt-5 border-t-2 border-dashed border-slate-200 pt-4">
            <p className="text-xs font-black uppercase text-slate-700">
              Manage Daily Logs ({state.logs.length})
            </p>
            <ul className="mt-2 max-h-44 space-y-1.5 overflow-y-auto pr-1">
              {[...state.logs]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((log) => (
                  <li
                    key={log.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold"
                  >
                    <span className="truncate">
                      {log.date}: {log.murajaatJuz ? `Juz ${log.murajaatJuz} • ` : ''}+{log.jadeedAyats} lines • Marks {log.murajaatMark}/{log.juzHaliMark}/{log.jadeedMark}
                    </span>
                    <button
                      type="button"
                      aria-label={`Delete log for ${log.date}`}
                      onClick={() => {
                        onUpdateState((prev) => ({
                          ...prev,
                          logs: prev.logs.filter((l) => l.id !== log.id),
                        }));
                        showSavedToast(`Removed log for ${log.date}.`);
                      }}
                      className="rounded-lg bg-rose-100 p-1.5 text-rose-700 hover:bg-rose-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="mt-5 border-t-2 border-dashed border-slate-200 pt-4">
          <p className="text-xs font-black uppercase text-slate-700">
            Safe Backup &amp; Restore (All Students)
          </p>
          <p className="mt-0.5 text-[11px] font-bold text-slate-500">
            Your data stays safely on the server volume across redeploys. Download a manual copy anytime for extra peace of mind.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-sky-100 px-3 py-2 text-xs font-black text-sky-900 hover:bg-sky-200"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download Backup (.json)</span>
            </button>

            <label className="comic-btn inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-900 hover:bg-emerald-200">
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Restore from Backup (.json)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleRestoreFileChange}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        {totalStudents > 1 && onDeleteStudent && (
          <div className="mt-5 border-t-2 border-dashed border-slate-200 pt-4">
            <p className="text-xs font-black uppercase text-slate-700">
              Remove Student Profile ({state.settings.childName})
            </p>
            {confirmDeleteStudent ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-50 p-3 text-xs font-bold">
                <span className="flex-1">
                  Permanently remove <strong>{state.settings.childName}</strong> and their logs?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteStudent();
                    setConfirmDeleteStudent(false);
                  }}
                  className="comic-btn rounded-lg bg-red-600 px-3 py-1.5 text-xs font-black text-white"
                >
                  Yes, Remove
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteStudent(false)}
                  className="comic-btn rounded-lg bg-white px-3 py-1.5 text-xs font-black text-slate-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDeleteStudent(true)}
                className="comic-btn mt-2 inline-flex items-center gap-1.5 rounded-xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-800"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Remove {state.settings.childName}</span>
              </button>
            )}
          </div>
        )}

        <div className="mt-5 border-t-2 border-dashed border-slate-200 pt-4">
          <p className="text-xs font-black uppercase text-slate-700">Reset This Student&apos;s Data</p>
          {confirmResetMode ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-50 p-3 text-xs font-bold">
              <span className="flex-1">
                {confirmResetMode === 'demo'
                  ? 'Replace current data with 7-day Sample Hero Demo?'
                  : 'Erase all logs and start fresh from 0?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirmResetMode === 'demo') onLoadDemo();
                  else onResetFresh();
                  setConfirmResetMode(null);
                  showSavedToast(
                    confirmResetMode === 'demo' ? 'Demo data loaded!' : 'Started fresh!'
                  );
                }}
                className="comic-btn rounded-lg bg-red-600 px-3 py-1.5 text-xs font-black text-white"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetMode(null)}
                className="comic-btn rounded-lg bg-white px-3 py-1.5 text-xs font-black text-slate-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setConfirmResetMode('demo')}
                className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-slate-900"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Load Sample Demo Data</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetMode('fresh')}
                className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-800"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Start Fresh (Zero Logs)</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
