import { Gift, Sparkles, Target, Trophy } from 'lucide-react';
import { calculateSiparaProgress } from '../data/quranMetadata';
import type { LongTermGoal, QuranPosition, ShortTermGoal } from '../types/hifz';

interface GoalProgressBannerProps {
  shortTermGoal: ShortTermGoal;
  longTermGoal: LongTermGoal;
  quranPosition: QuranPosition;
  onOpenWheel: () => void;
  onOpenGrandPrize: () => void;
}

export function GoalProgressBanner({
  shortTermGoal,
  longTermGoal,
  quranPosition,
  onOpenWheel,
  onOpenGrandPrize,
}: GoalProgressBannerProps) {
  const shortTarget = Math.max(1, shortTermGoal.targetAyats);
  const shortCurrent = Math.max(0, shortTermGoal.currentAyats);
  const shortPct = Math.min(100, Math.round((shortCurrent / shortTarget) * 100));
  const shortRemaining = Math.max(0, shortTarget - shortCurrent);
  const wheelUnlocked = shortCurrent >= shortTarget || shortTermGoal.bonusSpins > 0;

  const isSiparaMode = longTermGoal.mode !== 'custom';
  const siparaProgress = isSiparaMode
    ? calculateSiparaProgress(
        longTermGoal.targetJuz ?? quranPosition.juz,
        quranPosition,
        longTermGoal.surahDirection ?? quranPosition.surahDirection ?? 'reverse'
      )
    : null;

  const longTarget = siparaProgress
    ? Math.max(1, siparaProgress.totalLines)
    : Math.max(1, longTermGoal.targetValue);
  const longCurrent = siparaProgress
    ? siparaProgress.completedLines
    : Math.max(0, longTermGoal.currentValue);
  const longPct = siparaProgress
    ? siparaProgress.percent
    : longCurrent >= longTarget
      ? 100
      : Math.min(99, Math.round((longCurrent / longTarget) * 100));
  const longRemaining = siparaProgress
    ? siparaProgress.remainingLines
    : Math.max(0, longTarget - longCurrent);
  const longUnitLabel = siparaProgress
    ? 'Lines'
    : longTermGoal.unit === 'pages'
      ? 'Pages'
      : 'Lines';
  const isLongComplete = siparaProgress
    ? siparaProgress.isComplete
    : longCurrent >= longTarget;
  const grandPrizeReady = isLongComplete && !longTermGoal.claimed;

  return (
    <section aria-label="Goal Progress Trackers" className="grid gap-3 sm:grid-cols-2">
      {/* Short-Term Jadeed Goal Card */}
      <div className="comic-card relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-amber-300 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-slate-900">
              <Target className="h-3 w-3" aria-hidden="true" />
              Short-Term Goal
            </span>
            <label
              htmlFor="short-term-progress"
              className="mt-1.5 block font-display text-base font-bold text-slate-900"
            >
              {shortTermGoal.title}
            </label>
          </div>
          <span className="shrink-0 rounded-xl border-2 border-slate-900 bg-white px-2.5 py-1 font-display text-sm font-black text-orange-600 shadow-comic-sm">
            {shortCurrent}/{shortTarget} Lines
          </span>
        </div>

        <div className="mt-2.5">
          <progress
            id="short-term-progress"
            className="comic-progress comic-progress--short"
            max={shortTarget}
            value={Math.min(shortCurrent, shortTarget)}
          />
          <div className="mt-1.5 flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span>
              {shortPct}% ({(shortCurrent / 15).toFixed(1)}/{(shortTarget / 15).toFixed(1)} pgs)
            </span>
            <span>
              {wheelUnlocked
                ? shortTermGoal.bonusSpins > 0
                  ? `Bonus Spin Ready! (${shortTermGoal.bonusSpins})`
                  : 'TARGET SMASHED! 🎉'
                : `${shortRemaining} more Line${shortRemaining === 1 ? '' : 's'} to spin!`}
            </span>
          </div>
        </div>

        <div className="mt-3">
          {wheelUnlocked ? (
            <button
              type="button"
              onClick={onOpenWheel}
              className="comic-btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-lime-400 px-3 py-2.5 font-comic text-lg tracking-wider text-slate-950 animate-hero-pop"
            >
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/45 animate-shine-sweep"
                aria-hidden="true"
              />
              <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>SPIN THE TREAT WHEEL!</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenWheel}
              className="comic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-100 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-900 hover:bg-amber-200"
            >
              <Gift className="h-4 w-4 text-orange-600" aria-hidden="true" />
              <span>Preview Treat Wheel Prizes</span>
            </button>
          )}
        </div>
      </div>

      {/* Long-Term Mega Quest Card */}
      <div className="comic-card relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-purple-300 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-slate-900">
              <Trophy className="h-3 w-3" aria-hidden="true" />
              Long-Term Quest
            </span>
            <label
              htmlFor="long-term-progress"
              className="mt-1.5 block font-display text-base font-bold text-slate-900"
            >
              {longTermGoal.title}
            </label>
          </div>
          <span className="shrink-0 rounded-xl border-2 border-slate-900 bg-white px-2.5 py-1 font-display text-sm font-black text-purple-700 shadow-comic-sm">
            {longCurrent}/{longTarget} {longUnitLabel}
          </span>
        </div>

        <div className="mt-2.5">
          <progress
            id="long-term-progress"
            className="comic-progress comic-progress--long"
            max={longTarget}
            value={Math.min(longCurrent, longTarget)}
          />
          <div className="mt-1.5 flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span>
              {longPct}% Complete
              {siparaProgress
                ? ` · Juz ${siparaProgress.juz} (${siparaProgress.completedPages}/${siparaProgress.totalPages} pgs)`
                : ''}
            </span>
            <span>
              {isLongComplete
                ? 'QUEST CONQUERED! ⚡'
                : `${longRemaining} ${longUnitLabel} left`}
            </span>
          </div>
        </div>

        {siparaProgress && (
          <div className="mt-2.5 rounded-xl border-2 border-indigo-200 bg-white/85 p-2">
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-black text-indigo-950">
              <span>
                {siparaProgress.direction === 'reverse'
                  ? '⏪ Reverse Surah Trail'
                  : '⏩ Forward Surah Trail'}
              </span>
              <span className="text-purple-700">
                🏁 Finishes on {siparaProgress.finishingSurah.number}. {siparaProgress.finishingSurah.name}
              </span>
            </div>
            <div
              className={`mt-1.5 flex gap-1.5 ${
                siparaProgress.surahStatuses.length > 10
                  ? 'overflow-x-auto pb-1'
                  : 'flex-wrap'
              }`}
            >
              {siparaProgress.surahStatuses.map(
                ({ surah, completedLines, totalLines, status }) => {
                  const isFinal = surah.number === siparaProgress.finishingSurah.number;
                  const badgeClass =
                    status === 'done'
                      ? 'border-emerald-700 bg-emerald-100 text-emerald-900'
                      : status === 'current'
                        ? 'border-amber-600 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                        : 'border-slate-300 bg-slate-50 text-slate-600';
                  const icon =
                    status === 'done' ? '✅' : status === 'current' ? '🔥' : isFinal ? '🏁' : '⏳';
                  return (
                    <span
                      key={surah.number}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-extrabold ${badgeClass}`}
                    >
                      <span>{icon}</span>
                      <span>
                        {surah.number}. {surah.name}
                      </span>
                      {status === 'current' && (
                        <span className="text-[10px] font-black text-amber-800">
                          ({completedLines}/{totalLines} lines)
                        </span>
                      )}
                    </span>
                  );
                }
              )}
            </div>
          </div>
        )}

        <div className="mt-3">
          {grandPrizeReady ? (
            <button
              type="button"
              onClick={onOpenGrandPrize}
              className="comic-btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-3 py-2.5 font-comic text-lg tracking-wider text-white animate-hero-pop"
            >
              <Trophy className="h-5 w-5 shrink-0 text-yellow-300" aria-hidden="true" />
              <span>CLAIM GRAND PRIZE!</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-purple-100 px-3 py-2 text-xs font-extrabold text-slate-900">
              <span className="text-base leading-none" aria-hidden="true">
                {longTermGoal.grandTreatEmoji}
              </span>
              <span className="min-w-0 flex-1 truncate">
                Grand Treat: <strong className="text-purple-800">{longTermGoal.grandTreatLabel}</strong>
              </span>
              {longTermGoal.claimed && (
                <span className="shrink-0 rounded-md bg-emerald-400 px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-950">
                  Claimed!
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
