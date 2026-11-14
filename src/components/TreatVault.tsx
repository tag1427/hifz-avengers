import { Check, Gift, Shield, Sparkles, Trophy } from 'lucide-react';
import { HERO_LIST } from '../data/heroes';
import type { HeroId, WonTreatRecord } from '../types/hifz';
import { HeroAvatarSvg } from './HeroAvatarSvg';

interface TreatVaultProps {
  wonTreats: WonTreatRecord[];
  selectedHeroId: HeroId;
  onSelectHero: (heroId: HeroId) => void;
  onOpenWheel: () => void;
}

export function TreatVault({
  wonTreats,
  selectedHeroId,
  onSelectHero,
  onOpenWheel,
}: TreatVaultProps) {
  return (
    <div className="space-y-4">
      {/* Won Treats Trophy Shelf */}
      <section aria-labelledby="treat-vault-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-amber-300 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-900">
              <Trophy className="h-3 w-3" aria-hidden="true" />
              Reward Vault
            </span>
            <h2 id="treat-vault-heading" className="mt-1 font-comic text-2xl tracking-wide text-slate-900">
              My Earned Treats &amp; Prizes
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenWheel}
            className="comic-btn inline-flex items-center gap-1.5 rounded-xl bg-amber-300 px-3 py-1.5 text-xs font-black uppercase text-slate-950 hover:bg-amber-400"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>View Wheel</span>
          </button>
        </div>

        {wonTreats.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-amber-50/60 p-6 text-center">
            <Gift className="mx-auto h-10 w-10 text-orange-500" aria-hidden="true" />
            <p className="mt-2 font-display text-base font-black text-slate-900">
              Your Treat Vault is waiting!
            </p>
            <p className="mt-1 text-xs font-bold text-slate-600">
              Finish your Weekly Jadeed Target to spin the wheel and win your first treat!
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {[...wonTreats]
              .sort((a, b) => b.wonAt.localeCompare(a.wonAt))
              .map((item) => {
                const dateLabel = item.wonAt.slice(0, 10);
                return (
                  <li
                    key={item.id}
                    className={`flex items-center justify-between gap-3 rounded-2xl border-2 border-slate-900 p-3 shadow-comic-sm ${
                      item.source === 'long-term-grand'
                        ? 'bg-gradient-to-r from-purple-100 via-fuchsia-50 to-amber-50'
                        : 'bg-amber-50'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-2xl"
                        aria-hidden="true"
                      >
                        {item.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-black text-slate-900">
                          {item.label}
                        </p>
                        <p className="text-[11px] font-bold text-slate-600">
                          {item.source === 'long-term-grand'
                            ? '🏆 Long-Term Grand Treat'
                            : '🎡 Spin Wheel Prize'}{' '}
                          • {dateLabel}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border-2 border-slate-900 px-2.5 py-1 text-[11px] font-black ${
                        item.delivered
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-yellow-300 text-slate-950'
                      }`}
                    >
                      {item.delivered ? 'Delivered ✅' : 'Claim from Parent 🎁'}
                    </span>
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      {/* Superhero Squad Picker */}
      <section aria-labelledby="hero-squad-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" aria-hidden="true" />
          <h2 id="hero-squad-heading" className="font-comic text-2xl tracking-wide text-slate-900">
            Avengers Hifz Squad
          </h2>
        </div>
        <p className="mt-0.5 text-xs font-bold text-slate-600">
          Tap any superhero to equip their badge and suit colors!
        </p>

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {HERO_LIST.map((hero) => {
            const active = hero.id === selectedHeroId;
            return (
              <button
                key={hero.id}
                type="button"
                onClick={() => onSelectHero(hero.id)}
                className={`comic-btn flex items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
                  active ? 'bg-amber-200' : 'bg-slate-50 hover:bg-amber-50'
                }`}
              >
                <HeroAvatarSvg heroId={hero.id} className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-comic text-lg tracking-wide text-slate-900">{hero.name}</p>
                  <p className="truncate text-[11px] font-bold text-slate-600">{hero.alias}</p>
                </div>
                {active && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-400 text-slate-950">
                    <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
