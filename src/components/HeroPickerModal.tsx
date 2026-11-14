import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import { HERO_LIST } from '../data/heroes';
import type { HeroId } from '../types/hifz';
import { useNativeDialogControls } from '../utils/dialogHelpers';
import { HeroAvatarSvg } from './HeroAvatarSvg';

interface HeroPickerModalProps {
  isOpen: boolean;
  selectedHeroId: HeroId;
  onSelectHero: (heroId: HeroId) => void;
  onClose: () => void;
}

export function HeroPickerModal({
  isOpen,
  selectedHeroId,
  onSelectHero,
  onClose,
}: HeroPickerModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useNativeDialogControls(dialogRef, isOpen, () => {
    onClose();
  });

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="hero-picker-title"
      className="w-full"
    >
      <div className="comic-card overflow-hidden bg-white">
        <div className="flex items-center justify-between border-b-[3px] border-slate-900 bg-gradient-to-r from-red-600 to-blue-600 px-4 py-3 text-white">
          <h2 id="hero-picker-title" className="font-comic text-2xl tracking-wider">
            CHOOSE YOUR AVENGER!
          </h2>
          <form method="dialog">
            <button
              type="submit"
              value="close"
              aria-label="Close hero selector"
              className="comic-btn flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="space-y-2.5 p-4 max-h-[65dvh] overflow-y-auto">
          {HERO_LIST.map((hero) => {
            const active = hero.id === selectedHeroId;
            return (
              <button
                key={hero.id}
                type="button"
                autoFocus={active}
                onClick={() => {
                  onSelectHero(hero.id);
                  onClose();
                }}
                className={`comic-btn flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
                  active ? 'bg-amber-200' : 'bg-slate-50 hover:bg-amber-50'
                }`}
              >
                <HeroAvatarSvg heroId={hero.id} className="h-14 w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-comic text-xl tracking-wide text-slate-900">
                      {hero.name}
                    </span>
                    <span className="rounded-md border border-slate-900 bg-white px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-700">
                      {hero.alias}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-slate-600">{hero.tagline}</p>
                </div>
                {active && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-400 text-slate-950">
                    <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
