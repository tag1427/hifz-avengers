import { useRef } from 'react';
import { Sparkles, Trophy, X } from 'lucide-react';
import type { LongTermGoal } from '../types/hifz';
import { useNativeDialogControls } from '../utils/dialogHelpers';

interface GrandPrizeModalProps {
  isOpen: boolean;
  longTermGoal: LongTermGoal;
  onClose: () => void;
  onClaimGrandPrize: () => void;
}

export function GrandPrizeModal({
  isOpen,
  longTermGoal,
  onClose,
  onClaimGrandPrize,
}: GrandPrizeModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useNativeDialogControls(dialogRef, isOpen, (returnValue) => {
    if (returnValue === 'claim') {
      onClaimGrandPrize();
    }
    onClose();
  });

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="grand-prize-title"
      className="w-full"
    >
      <div className="comic-card overflow-hidden bg-white">
        <div className="flex items-center justify-between border-b-[3px] border-slate-900 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-300" aria-hidden="true" />
            <h2 id="grand-prize-title" className="font-comic text-2xl tracking-wider">
              MEGA QUEST CONQUERED!
            </h2>
          </div>

          <form method="dialog">
            <button
              type="submit"
              value="close"
              aria-label="Close grand prize modal"
              className="comic-btn flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="space-y-4 p-5 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-slate-900 bg-yellow-300 text-5xl shadow-comic animate-float-slow">
            {longTermGoal.grandTreatEmoji}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-purple-700">
              {longTermGoal.title}
            </p>
            <h3 className="mt-1 font-comic text-3xl text-slate-950">
              {longTermGoal.grandTreatLabel}
            </h3>
            <p className="mt-2 text-sm font-bold text-slate-600">
              Mashallah! You finished your Long-Term Quest! Claim this Grand Treat so it goes straight into your Trophy Vault!
            </p>
          </div>

          <form method="dialog" className="flex flex-col gap-2">
            <button
              type="submit"
              value="claim"
              autoFocus
              className="comic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-4 py-3 font-comic text-xl tracking-wider text-white"
            >
              <Sparkles className="h-5 w-5 text-yellow-300" aria-hidden="true" />
              <span>CLAIM GRAND PRIZE!</span>
            </button>
            <button
              type="submit"
              value="close"
              className="comic-btn w-full rounded-2xl bg-slate-100 px-4 py-2.5 font-display text-sm font-black text-slate-800"
            >
              Not Yet
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
