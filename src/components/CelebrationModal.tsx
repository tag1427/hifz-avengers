import { useRef } from 'react';
import { Sparkles, Trophy, Zap } from 'lucide-react';
import type { DailyLogEntry } from '../types/hifz';
import { useNativeDialogControls } from '../utils/dialogHelpers';
import { getMarkFeedback } from '../utils/hifzMath';

export interface CelebrationPayload {
  entry: DailyLogEntry;
  leveledUp: boolean;
  newLevel: number;
  wheelUnlockedNow: boolean;
  grandPrizeUnlockedNow: boolean;
}

interface CelebrationModalProps {
  celebration: CelebrationPayload | null;
  onClose: () => void;
  onOpenWheel: () => void;
  onOpenGrandPrize: () => void;
}

export function CelebrationModal({
  celebration,
  onClose,
  onOpenWheel,
  onOpenGrandPrize,
}: CelebrationModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useNativeDialogControls(dialogRef, celebration !== null, (returnValue) => {
    if (returnValue === 'spin') {
      onClose();
      onOpenWheel();
    } else if (returnValue === 'grand') {
      onClose();
      onOpenGrandPrize();
    } else {
      onClose();
    }
  });

  if (!celebration) {
    return <dialog ref={dialogRef} aria-labelledby="celebration-title" />;
  }

  const { entry, leveledUp, newLevel, wheelUnlockedNow, grandPrizeUnlockedNow } = celebration;
  const avgMark = Number(
    ((entry.murajaatMark + entry.juzHaliMark + entry.jadeedMark) / 3).toFixed(1)
  );
  const overallFeedback = getMarkFeedback(Math.round(avgMark));

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="celebration-title"
      className="w-full"
    >
      <div className="comic-card overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 px-5 py-4 text-center text-white border-b-[3px] border-slate-900">
          <p className="font-comic text-sm tracking-widest text-yellow-100">
            MASHALLAH! MISSION COMPLETE!
          </p>
          <h2
            id="celebration-title"
            className="mt-0.5 font-comic text-3xl tracking-wide text-white drop-shadow-[2px_2px_0_#0f172a]"
          >
            {avgMark >= 9 ? 'BOOM! AVENGER LEVEL!' : avgMark >= 7 ? 'POW! SUPER HERO!' : 'GREAT EFFORT, HERO!'}
          </h2>
        </div>

        <div className="space-y-3.5 p-5">
          {/* XP & Level Banner */}
          <div className="flex items-center justify-between rounded-2xl border-2 border-slate-900 bg-amber-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 fill-amber-500 text-slate-900" aria-hidden="true" />
              <div>
                <p className="text-xs font-black uppercase text-slate-600">Power Gained</p>
                <p className="font-display text-xl font-black text-slate-900">+{entry.xpEarned} XP</p>
              </div>
            </div>

            <span
              className={`rounded-full border-2 px-3 py-1 text-xs font-black ${overallFeedback.badgeColor} ${overallFeedback.textColor}`}
            >
              {overallFeedback.emoji} Avg {avgMark}/10
            </span>
          </div>

          {leveledUp && (
            <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-center font-display text-sm font-black text-white shadow-comic-sm">
              ⚡ LEVEL UP! You reached HERO LEVEL {newLevel}!
            </div>
          )}

          {/* Musaid Scorecard */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border-2 border-slate-900 bg-sky-50 p-2.5">
              <p className="text-[11px] font-black uppercase text-slate-600">Murajaat</p>
              <p className="font-display text-lg font-black text-sky-700">{entry.murajaatMark}/10</p>
              <p className="text-[11px] font-bold text-slate-500">{entry.murajaatPages} pgs</p>
            </div>
            <div className="rounded-xl border-2 border-slate-900 bg-purple-50 p-2.5">
              <p className="text-[11px] font-black uppercase text-slate-600">Juz Hali</p>
              <p className="font-display text-lg font-black text-purple-700">{entry.juzHaliMark}/10</p>
              <p className="text-[11px] font-bold text-slate-500">{entry.juzHaliPages} pgs</p>
            </div>
            <div className="rounded-xl border-2 border-slate-900 bg-amber-50 p-2.5">
              <p className="text-[11px] font-black uppercase text-slate-600">Jadeed</p>
              <p className="font-display text-lg font-black text-orange-600">{entry.jadeedMark}/10</p>
              <p className="text-[11px] font-bold text-slate-500">+{entry.jadeedAyats} ayats</p>
            </div>
          </div>

          {wheelUnlockedNow && (
            <div className="rounded-2xl border-2 border-slate-900 bg-lime-200 p-3 text-center">
              <p className="font-display text-sm font-black text-slate-900">
                🎉 SHORT-TERM JADEED TARGET SMASHED!
              </p>
              <p className="text-xs font-bold text-slate-700">
                Your Treat Spin Wheel is UNLOCKED and ready to spin!
              </p>
            </div>
          )}

          {grandPrizeUnlockedNow && (
            <div className="rounded-2xl border-2 border-slate-900 bg-fuchsia-200 p-3 text-center">
              <p className="font-display text-sm font-black text-slate-900">
                🏆 MEGA LONG-TERM QUEST CONQUERED!
              </p>
              <p className="text-xs font-bold text-slate-700">
                Tap below to claim your Grand Treat from Mom/Dad!
              </p>
            </div>
          )}

          <form method="dialog" className="flex flex-col gap-2 pt-1">
            {wheelUnlockedNow && (
              <button
                type="submit"
                value="spin"
                autoFocus
                className="comic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-lime-400 px-4 py-3 font-comic text-xl tracking-wider text-slate-950"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                <span>SPIN THE TREAT WHEEL NOW!</span>
              </button>
            )}

            {grandPrizeUnlockedNow && (
              <button
                type="submit"
                value="grand"
                autoFocus={!wheelUnlockedNow}
                className="comic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 font-comic text-xl tracking-wider text-white"
              >
                <Trophy className="h-5 w-5 text-yellow-300" aria-hidden="true" />
                <span>CLAIM GRAND PRIZE!</span>
              </button>
            )}

            <button
              type="submit"
              value="close"
              autoFocus={!wheelUnlockedNow && !grandPrizeUnlockedNow}
              className="comic-btn w-full rounded-2xl bg-slate-900 px-4 py-2.5 font-display text-sm font-black uppercase tracking-wide text-white hover:bg-slate-800"
            >
              Awesome! Back to HQ
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
