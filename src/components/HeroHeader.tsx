import { Flame, Volume2, VolumeX, Zap } from 'lucide-react';
import { HERO_THEMES } from '../data/heroes';
import type { HeroId } from '../types/hifz';
import { getHeroRank } from '../utils/hifzMath';
import { HeroAvatarSvg } from './HeroAvatarSvg';

interface HeroHeaderProps {
  childName: string;
  heroId: HeroId;
  xp: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHeroPicker: () => void;
}

export function HeroHeader({
  childName,
  heroId,
  xp,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenHeroPicker,
}: HeroHeaderProps) {
  const hero = HERO_THEMES[heroId];
  const rank = getHeroRank(xp);

  return (
    <header
      className={`relative overflow-hidden rounded-3xl border-[3px] border-slate-900 bg-gradient-to-br ${hero.gradientClass} p-3.5 sm:p-4 text-white shadow-comic`}
    >
      {/* Subtle comic action dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenHeroPicker}
            className="group relative shrink-0 rounded-full bg-white/15 p-1 transition-transform hover:scale-105 active:scale-95"
            aria-label={`Change superhero avatar. Currently ${hero.name}`}
            title="Tap to switch Hero!"
          >
            <HeroAvatarSvg heroId={heroId} className="h-14 w-14 sm:h-16 sm:w-16 drop-shadow" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-900 bg-yellow-300 px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-900 shadow-sm">
              LVL {rank.level}
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md border border-slate-900 bg-yellow-300 px-2 py-0.5 font-comic text-xs tracking-wider text-slate-900 shadow-comic-sm">
                {hero.name.toUpperCase()}
              </span>
              <span className="text-xs font-extrabold text-white/90">{rank.title}</span>
            </div>
            <h1 className="hero-title-fluid mt-1 font-comic tracking-wide text-white drop-shadow-[2px_2px_0_#0f172a]">
              {childName}&apos;s Hifz HQ
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-2xl border-2 border-slate-900 bg-amber-300 px-2.5 py-1.5 text-slate-900 shadow-comic-sm"
            title="Daily Revision Streak"
          >
            <Flame className="h-4 w-4 fill-orange-500 text-orange-600" aria-hidden="true" />
            <span className="text-sm font-black leading-none">{streak}d</span>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            className="comic-btn flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 hover:bg-slate-100"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-slate-900" aria-hidden="true" />
            ) : (
              <VolumeX className="h-5 w-5 text-slate-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Hero XP Bar */}
      <div className="relative mt-3 rounded-xl border-2 border-slate-900 bg-slate-950/35 px-3 py-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-yellow-200">
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" aria-hidden="true" />
            {xp.toLocaleString()} XP Total
          </span>
          <span>
            {rank.currentLevelXp} / {rank.nextLevelXp} XP to LVL {rank.level + 1}
          </span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full border border-slate-900 bg-slate-900/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-lime-400 transition-all duration-500"
            style={{ width: `${rank.progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
