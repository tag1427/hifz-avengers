import { useState, type FormEvent } from 'react';
import { BookOpen, Calendar, CheckCircle2, Minus, Plus, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import { getLocalDateString } from '../data/defaultState';
import type { AppSettings } from '../types/hifz';
import { getMarkFeedback } from '../utils/hifzMath';
import { playTapClick } from '../utils/sound';

export interface DailyMissionPayload {
  date: string;
  murajaatPages: number;
  murajaatMark: number;
  juzHaliPages: number;
  juzHaliMark: number;
  jadeedAyats: number;
  jadeedMark: number;
  jadeedNote: string;
}

interface DailyLogFormProps {
  settings: AppSettings;
  onSubmitMission: (payload: DailyMissionPayload) => void;
}

interface MarkSelectorProps {
  idPrefix: string;
  label: string;
  value: number;
  soundEnabled: boolean;
  onChange: (mark: number) => void;
}

function MarkSelector({ idPrefix, label, value, soundEnabled, onChange }: MarkSelectorProps) {
  const feedback = getMarkFeedback(value);

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <span className="text-xs font-black uppercase tracking-wide text-slate-700">
          {label} (1–10)
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-xs font-black ${feedback.badgeColor} ${feedback.textColor}`}
        >
          <span aria-hidden="true">{feedback.emoji}</span>
          <span>
            {value}/10 • {feedback.label}
          </span>
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label={label}
        className="mt-2 grid grid-cols-5 gap-1.5 sm:grid-cols-10"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const selected = value === num;
          let colorClass = 'bg-white text-slate-800 hover:bg-slate-100';
          if (selected) {
            if (num === 10) colorClass = 'bg-amber-300 text-slate-950 scale-105';
            else if (num >= 8) colorClass = 'bg-emerald-400 text-slate-950 scale-105';
            else if (num >= 6) colorClass = 'bg-sky-400 text-slate-950 scale-105';
            else colorClass = 'bg-orange-400 text-slate-950 scale-105';
          }
          return (
            <button
              key={`${idPrefix}-${num}`}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                playTapClick(soundEnabled);
                onChange(num);
              }}
              className={`comic-btn flex h-11 items-center justify-center rounded-xl font-display text-base font-black transition-transform ${colorClass}`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DailyLogForm({ settings, onSubmitMission }: DailyLogFormProps) {
  const [date, setDate] = useState<string>(() => getLocalDateString());
  const [murajaatPages, setMurajaatPages] = useState<number>(settings.defaultMurajaatPages);
  const [murajaatMark, setMurajaatMark] = useState<number>(9);
  const [juzHaliPages, setJuzHaliPages] = useState<number>(settings.defaultJuzHaliPages);
  const [juzHaliMark, setJuzHaliMark] = useState<number>(9);
  const [jadeedAyats, setJadeedAyats] = useState<number>(5);
  const [jadeedMark, setJadeedMark] = useState<number>(9);
  const [jadeedNote, setJadeedNote] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitMission({
      date,
      murajaatPages: Math.max(0, murajaatPages),
      murajaatMark,
      juzHaliPages: Math.max(0, juzHaliPages),
      juzHaliMark,
      jadeedAyats: Math.max(0, jadeedAyats),
      jadeedMark,
      jadeedNote: jadeedNote.trim(),
    });
    setJadeedNote('');
  };

  return (
    <section aria-labelledby="daily-mission-heading" className="comic-card bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-slate-200 pb-3">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-rose-500 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Daily Musaid Check-In
          </span>
          <h2 id="daily-mission-heading" className="mt-1 font-comic text-2xl tracking-wide text-slate-900">
            Log Today&apos;s Hifz Marks!
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="mission-date" className="flex items-center gap-1 text-xs font-extrabold text-slate-700">
            <Calendar className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span>Date</span>
          </label>
          <input
            id="mission-date"
            name="missionDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-xl border-2 border-slate-900 bg-slate-50 px-2.5 py-1.5 text-sm font-bold text-slate-900"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Pillar 1: Murajaat */}
        <fieldset className="rounded-2xl border-2 border-slate-900 bg-sky-50 p-3.5 sm:p-4">
          <legend className="flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-sky-500 px-3 py-1 font-display text-sm font-black uppercase tracking-wide text-white shadow-comic-sm">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>1. Murajaat (Revision)</span>
          </legend>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <div>
              <label htmlFor="murajaat-pages" className="block text-sm font-extrabold text-slate-900">
                Pages Revised Today
              </label>
              <p className="text-xs font-bold text-slate-600">
                Daily goal: {settings.defaultMurajaatPages} pages
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease Murajaat pages"
                onClick={() => {
                  playTapClick(settings.soundEnabled);
                  setMurajaatPages((p) => Math.max(0, p - 1));
                }}
                className="comic-btn flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900 hover:bg-slate-100"
              >
                <Minus className="h-5 w-5" aria-hidden="true" />
              </button>
              <input
                id="murajaat-pages"
                name="murajaatPages"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={murajaatPages}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
                  setMurajaatPages(Number.isNaN(val) ? 0 : Math.min(200, val));
                }}
                className="w-16 rounded-xl border-2 border-slate-900 bg-white text-center font-display text-xl font-black text-slate-900"
              />
              <button
                type="button"
                aria-label="Increase Murajaat pages"
                onClick={() => {
                  playTapClick(settings.soundEnabled);
                  setMurajaatPages((p) => Math.min(200, p + 1));
                }}
                className="comic-btn flex h-11 w-11 items-center justify-center rounded-xl bg-sky-300 text-slate-950 hover:bg-sky-400"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <MarkSelector
            idPrefix="murajaat"
            label="Musaid Mark for Murajaat"
            value={murajaatMark}
            soundEnabled={settings.soundEnabled}
            onChange={setMurajaatMark}
          />
        </fieldset>

        {/* Pillar 2: Juz Hali */}
        <fieldset className="rounded-2xl border-2 border-slate-900 bg-purple-50 p-3.5 sm:p-4">
          <legend className="flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-purple-600 px-3 py-1 font-display text-sm font-black uppercase tracking-wide text-white shadow-comic-sm">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>2. Juz Hali (Recent Pages)</span>
          </legend>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <div>
              <label htmlFor="juzhali-pages" className="block text-sm font-extrabold text-slate-900">
                Recent Pages Revised
              </label>
              <p className="text-xs font-bold text-slate-600">
                Daily goal: {settings.defaultJuzHaliPages} pages (3–4 pages)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease Juz Hali pages"
                onClick={() => {
                  playTapClick(settings.soundEnabled);
                  setJuzHaliPages((p) => Math.max(0, p - 1));
                }}
                className="comic-btn flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900 hover:bg-slate-100"
              >
                <Minus className="h-5 w-5" aria-hidden="true" />
              </button>
              <input
                id="juzhali-pages"
                name="juzHaliPages"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={juzHaliPages}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
                  setJuzHaliPages(Number.isNaN(val) ? 0 : Math.min(60, val));
                }}
                className="w-16 rounded-xl border-2 border-slate-900 bg-white text-center font-display text-xl font-black text-slate-900"
              />
              <button
                type="button"
                aria-label="Increase Juz Hali pages"
                onClick={() => {
                  playTapClick(settings.soundEnabled);
                  setJuzHaliPages((p) => Math.min(60, p + 1));
                }}
                className="comic-btn flex h-11 w-11 items-center justify-center rounded-xl bg-purple-300 text-slate-950 hover:bg-purple-400"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <MarkSelector
            idPrefix="juzhali"
            label="Musaid Mark for Juz Hali"
            value={juzHaliMark}
            soundEnabled={settings.soundEnabled}
            onChange={setJuzHaliMark}
          />
        </fieldset>

        {/* Pillar 3: Jadeed */}
        <fieldset className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-3.5 sm:p-4">
          <legend className="flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-orange-500 px-3 py-1 font-display text-sm font-black uppercase tracking-wide text-white shadow-comic-sm">
            <Rocket className="h-4 w-4" aria-hidden="true" />
            <span>3. Jadeed (New Memorization)</span>
          </legend>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <div>
              <label htmlFor="jadeed-ayats" className="block text-sm font-extrabold text-slate-900">
                New Ayats Memorized Today
              </label>
              <p className="text-xs font-bold text-slate-600">
                Counts toward your Short-Term &amp; Long-Term goals!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease Jadeed ayats"
                onClick={() => {
                  playTapClick(settings.soundEnabled);
                  setJadeedAyats((a) => Math.max(0, a - 1));
                }}
                className="comic-btn flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900 hover:bg-slate-100"
              >
                <Minus className="h-5 w-5" aria-hidden="true" />
              </button>
              <input
                id="jadeed-ayats"
                name="jadeedAyats"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={jadeedAyats}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
                  setJadeedAyats(Number.isNaN(val) ? 0 : Math.min(200, val));
                }}
                className="w-16 rounded-xl border-2 border-slate-900 bg-white text-center font-display text-xl font-black text-orange-600"
              />
              <button
                type="button"
                aria-label="Increase Jadeed ayats"
                onClick={() => {
                  playTapClick(settings.soundEnabled);
                  setJadeedAyats((a) => Math.min(200, a + 1));
                }}
                className="comic-btn flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-slate-950 hover:bg-amber-400"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Quick Ayat Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-slate-600">Quick set:</span>
            {[3, 5, 7, 10, 15].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  playTapClick(settings.soundEnabled);
                  setJadeedAyats(preset);
                }}
                className={`rounded-xl border-2 border-slate-900 px-3 py-1 text-xs font-black transition-colors ${
                  jadeedAyats === preset
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-900 hover:bg-amber-200'
                }`}
              >
                {preset} Ayats
              </button>
            ))}
          </div>

          <div className="mt-3">
            <label htmlFor="jadeed-note" className="block text-xs font-extrabold text-slate-700">
              Surah / Page Note (optional)
            </label>
            <input
              id="jadeed-note"
              name="jadeedNote"
              type="text"
              placeholder="e.g. Surah Al-Qalam Ayats 1-5"
              value={jadeedNote}
              onChange={(e) => setJadeedNote(e.target.value)}
              maxLength={80}
              className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <MarkSelector
            idPrefix="jadeed"
            label="Musaid Mark for Jadeed"
            value={jadeedMark}
            soundEnabled={settings.soundEnabled}
            onChange={setJadeedMark}
          />
        </fieldset>

        <button
          type="submit"
          className="comic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 px-5 py-3.5 font-comic text-xl tracking-wider text-white shadow-comic hover:brightness-105"
        >
          <CheckCircle2 className="h-6 w-6 text-yellow-300" aria-hidden="true" />
          <span>POWER UP &amp; LOG TODAY&apos;S MISSION!</span>
        </button>
      </form>
    </section>
  );
}
