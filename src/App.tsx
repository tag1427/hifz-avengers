import { useEffect, useRef, useState } from 'react';
import { Cloud, Flame, HardDrive, Lock, TrendingUp, Trophy, Unlock } from 'lucide-react';
import { CelebrationModal, type CelebrationPayload } from './components/CelebrationModal';
import { DailyLogForm, type DailyMissionPayload } from './components/DailyLogForm';
import { GoalProgressBanner } from './components/GoalProgressBanner';
import { GrandPrizeModal } from './components/GrandPrizeModal';
import { HeroHeader } from './components/HeroHeader';
import { HeroPickerModal } from './components/HeroPickerModal';
import { ParentModule } from './components/ParentModule';
import { TreatSpinWheelModal } from './components/TreatSpinWheelModal';
import { TreatVault } from './components/TreatVault';
import { TrendsAndForecast } from './components/TrendsAndForecast';
import {
  createDemoState,
  createFreshState,
  fetchServerState,
  loadAppState,
  saveAppState,
  saveServerState,
} from './data/defaultState';
import type { AppState, AppTab, DailyLogEntry, HeroId, TreatItem } from './types/hifz';
import { calculateStreak, fireHeroConfetti, getHeroRank } from './utils/hifzMath';
import { playGrandPrizeChord, playHeroFanfare, playTapClick } from './utils/sound';

export function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'checking' | 'synced' | 'local'>('checking');

  const isFirstRenderRef = useRef<boolean>(true);
  const skipNextPostRef = useRef<boolean>(false);
  const latestStateRef = useRef<AppState>(state);
  latestStateRef.current = state;

  // Dialog states
  const [celebration, setCelebration] = useState<CelebrationPayload | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);
  const [isGrandPrizeOpen, setIsGrandPrizeOpen] = useState<boolean>(false);
  const [isHeroPickerOpen, setIsHeroPickerOpen] = useState<boolean>(false);

  // Save to localStorage and sync mutations to server
  useEffect(() => {
    saveAppState(state);

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (skipNextPostRef.current) {
      skipNextPostRef.current = false;
      return;
    }

    let cancelled = false;
    saveServerState(state).then((ok) => {
      if (!cancelled) {
        setSyncStatus(ok ? 'synced' : 'local');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [state]);

  // Initial hydrate from server + re-sync on focus/visibility
  useEffect(() => {
    let active = true;

    const syncFromServer = async (initializeIfEmpty: boolean) => {
      const result = await fetchServerState();
      if (!active) return;

      if (!result.reachable) {
        setSyncStatus('local');
        return;
      }

      if (result.state) {
        const incomingJson = JSON.stringify(result.state);
        const currentJson = JSON.stringify(latestStateRef.current);
        if (incomingJson !== currentJson) {
          skipNextPostRef.current = true;
          setState(result.state);
        }
        setSyncStatus('synced');
      } else if (initializeIfEmpty) {
        const ok = await saveServerState(latestStateRef.current);
        if (active) {
          setSyncStatus(ok ? 'synced' : 'local');
        }
      }
    };

    syncFromServer(true);

    const handleFocus = () => {
      syncFromServer(false);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromServer(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      active = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const streak = calculateStreak(state.logs);
  const pendingTreatsCount = state.wonTreats.filter((w) => !w.delivered).length;

  const handleSubmitMission = (payload: DailyMissionPayload) => {
    const xpEarned =
      payload.murajaatMark * 8 +
      payload.juzHaliMark * 8 +
      payload.jadeedMark * 10 +
      payload.jadeedAyats * 12;

    const entry: DailyLogEntry = {
      id: `log-${Date.now()}`,
      date: payload.date,
      createdAt: new Date().toISOString(),
      murajaatPages: payload.murajaatPages,
      murajaatMark: payload.murajaatMark,
      juzHaliPages: payload.juzHaliPages,
      juzHaliMark: payload.juzHaliMark,
      jadeedAyats: payload.jadeedAyats,
      jadeedMark: payload.jadeedMark,
      jadeedNote: payload.jadeedNote || undefined,
      xpEarned,
    };

    const oldLevel = getHeroRank(state.xp).level;
    const newXp = state.xp + xpEarned;
    const newLevel = getHeroRank(newXp).level;
    const leveledUp = newLevel > oldLevel;

    const newShortCurrent = state.shortTermGoal.currentAyats + payload.jadeedAyats;
    const wheelUnlockedNow =
      newShortCurrent >= state.shortTermGoal.targetAyats || state.shortTermGoal.bonusSpins > 0;

    const longDelta =
      state.longTermGoal.unit === 'pages'
        ? payload.jadeedAyats / Math.max(1, state.settings.ayatsPerPage)
        : payload.jadeedAyats;
    const newLongCurrent = Number((state.longTermGoal.currentValue + longDelta).toFixed(1));
    const grandPrizeUnlockedNow =
      newLongCurrent >= state.longTermGoal.targetValue && !state.longTermGoal.claimed;

    setState((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
      logs: [...prev.logs, entry],
      shortTermGoal: {
        ...prev.shortTermGoal,
        currentAyats: prev.shortTermGoal.currentAyats + payload.jadeedAyats,
      },
      longTermGoal: {
        ...prev.longTermGoal,
        currentValue: Number(
          (
            prev.longTermGoal.currentValue +
            (prev.longTermGoal.unit === 'pages'
              ? payload.jadeedAyats / Math.max(1, prev.settings.ayatsPerPage)
              : payload.jadeedAyats)
          ).toFixed(1)
        ),
      },
    }));

    const avgMark = (payload.murajaatMark + payload.juzHaliMark + payload.jadeedMark) / 3;
    fireHeroConfetti(avgMark >= 9 || wheelUnlockedNow ? 'grand' : 'normal');
    playHeroFanfare(state.settings.soundEnabled);

    setCelebration({
      entry,
      leveledUp,
      newLevel,
      wheelUnlockedNow,
      grandPrizeUnlockedNow,
    });
  };

  const handleTreatWon = (treat: TreatItem) => {
    setState((prev) => {
      const wonRecord = {
        id: `won-${Date.now()}`,
        treatId: treat.id,
        label: treat.label,
        emoji: treat.emoji,
        wonAt: new Date().toISOString(),
        source: 'short-term-wheel' as const,
        delivered: false,
      };

      // Consume short-term cycle (carry over any excess ayats) or consume a bonus spin
      let nextCurrentAyats = prev.shortTermGoal.currentAyats;
      let nextBonusSpins = prev.shortTermGoal.bonusSpins;

      if (prev.shortTermGoal.currentAyats >= prev.shortTermGoal.targetAyats) {
        nextCurrentAyats = Math.max(
          0,
          prev.shortTermGoal.currentAyats - prev.shortTermGoal.targetAyats
        );
      } else if (prev.shortTermGoal.bonusSpins > 0) {
        nextBonusSpins = prev.shortTermGoal.bonusSpins - 1;
      }

      return {
        ...prev,
        wonTreats: [...prev.wonTreats, wonRecord],
        shortTermGoal: {
          ...prev.shortTermGoal,
          currentAyats: nextCurrentAyats,
          bonusSpins: nextBonusSpins,
        },
      };
    });
  };

  const handleClaimGrandPrize = () => {
    fireHeroConfetti('grand');
    playGrandPrizeChord(state.settings.soundEnabled);

    setState((prev) => ({
      ...prev,
      wonTreats: [
        ...prev.wonTreats,
        {
          id: `grand-${Date.now()}`,
          treatId: 'long-term-grand',
          label: prev.longTermGoal.grandTreatLabel,
          emoji: prev.longTermGoal.grandTreatEmoji,
          wonAt: new Date().toISOString(),
          source: 'long-term-grand',
          delivered: false,
        },
      ],
      longTermGoal: {
        ...prev.longTermGoal,
        claimed: true,
      },
    }));
  };

  const handleSelectHero = (heroId: HeroId) => {
    playTapClick(state.settings.soundEnabled);
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        heroId,
      },
    }));
  };

  const handleToggleSound = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: !prev.settings.soundEnabled,
      },
    }));
  };

  return (
    <div className="min-h-[100dvh] pb-28">
      <div className="mx-auto max-w-2xl space-y-4 px-3 pt-3 sm:px-5 sm:pt-5">
        <HeroHeader
          childName={state.settings.childName}
          heroId={state.settings.heroId}
          xp={state.xp}
          streak={streak}
          soundEnabled={state.settings.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenHeroPicker={() => setIsHeroPickerOpen(true)}
        />

        {/* Dual Progress Bars ALWAYS shown on Front Screen */}
        {activeTab === 'home' && (
          <GoalProgressBanner
            shortTermGoal={state.shortTermGoal}
            longTermGoal={state.longTermGoal}
            onOpenWheel={() => setIsWheelOpen(true)}
            onOpenGrandPrize={() => setIsGrandPrizeOpen(true)}
          />
        )}

        <main>
          {activeTab === 'home' && (
            <DailyLogForm
              settings={state.settings}
              onSubmitMission={handleSubmitMission}
            />
          )}

          {activeTab === 'trends' && (
            <TrendsAndForecast logs={state.logs} settings={state.settings} />
          )}

          {activeTab === 'vault' && (
            <TreatVault
              wonTreats={state.wonTreats}
              selectedHeroId={state.settings.heroId}
              onSelectHero={handleSelectHero}
              onOpenWheel={() => setIsWheelOpen(true)}
            />
          )}

          {activeTab === 'parent' && (
            <ParentModule
              state={state}
              isUnlocked={isParentUnlocked}
              onUnlock={() => setIsParentUnlocked(true)}
              onLock={() => setIsParentUnlocked(false)}
              onUpdateState={(updater) => setState(updater)}
              onLoadDemo={() => setState(createDemoState())}
              onResetFresh={() => setState(createFreshState())}
            />
          )}
        </main>

        {/* Subtle Server Storage Sync Indicator */}
        <div className="flex justify-center pb-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/20 bg-white/75 px-3 py-1 text-[11px] font-extrabold text-slate-600">
            {syncStatus === 'synced' ? (
              <>
                <Cloud className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span>Server Synced ✓ (Shared across devices)</span>
              </>
            ) : syncStatus === 'checking' ? (
              <>
                <Cloud className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>Connecting to server...</span>
              </>
            ) : (
              <>
                <HardDrive className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>Local Device Mode</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Fixed Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Primary App Navigation"
        className="bottom-nav-safe fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-slate-900 bg-white/95 pt-2 backdrop-blur-md"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-2">
          <button
            type="button"
            aria-current={activeTab === 'home' ? 'page' : undefined}
            onClick={() => {
              playTapClick(state.settings.soundEnabled);
              setActiveTab('home');
            }}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 py-1.5 text-[11px] font-black transition-all ${
              activeTab === 'home'
                ? 'border-slate-900 bg-red-600 text-white shadow-comic-sm -translate-y-0.5'
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame className="h-5 w-5" aria-hidden="true" />
            <span className="mt-0.5">Mission</span>
          </button>

          <button
            type="button"
            aria-current={activeTab === 'trends' ? 'page' : undefined}
            onClick={() => {
              playTapClick(state.settings.soundEnabled);
              setActiveTab('trends');
            }}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 py-1.5 text-[11px] font-black transition-all ${
              activeTab === 'trends'
                ? 'border-slate-900 bg-sky-500 text-white shadow-comic-sm -translate-y-0.5'
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
            <span className="mt-0.5">Trends</span>
          </button>

          <button
            type="button"
            aria-current={activeTab === 'vault' ? 'page' : undefined}
            onClick={() => {
              playTapClick(state.settings.soundEnabled);
              setActiveTab('vault');
            }}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 py-1.5 text-[11px] font-black transition-all ${
              activeTab === 'vault'
                ? 'border-slate-900 bg-amber-400 text-slate-950 shadow-comic-sm -translate-y-0.5'
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Trophy className="h-5 w-5" aria-hidden="true" />
            <span className="mt-0.5">Treats</span>
            {pendingTreatsCount > 0 && (
              <span className="absolute right-2 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-slate-900 bg-red-600 px-1 text-[10px] font-black text-white">
                {pendingTreatsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-current={activeTab === 'parent' ? 'page' : undefined}
            onClick={() => {
              playTapClick(state.settings.soundEnabled);
              setActiveTab('parent');
            }}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 py-1.5 text-[11px] font-black transition-all ${
              activeTab === 'parent'
                ? 'border-slate-900 bg-indigo-600 text-white shadow-comic-sm -translate-y-0.5'
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isParentUnlocked ? (
              <Unlock className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Lock className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="mt-0.5">Parent HQ</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <CelebrationModal
        celebration={celebration}
        onClose={() => setCelebration(null)}
        onOpenWheel={() => setIsWheelOpen(true)}
        onOpenGrandPrize={() => setIsGrandPrizeOpen(true)}
      />

      <TreatSpinWheelModal
        isOpen={isWheelOpen}
        treats={state.treats}
        shortTermGoal={state.shortTermGoal}
        soundEnabled={state.settings.soundEnabled}
        onClose={() => setIsWheelOpen(false)}
        onTreatWon={handleTreatWon}
      />

      <GrandPrizeModal
        isOpen={isGrandPrizeOpen}
        longTermGoal={state.longTermGoal}
        onClose={() => setIsGrandPrizeOpen(false)}
        onClaimGrandPrize={handleClaimGrandPrize}
      />

      <HeroPickerModal
        isOpen={isHeroPickerOpen}
        selectedHeroId={state.settings.heroId}
        onSelectHero={handleSelectHero}
        onClose={() => setIsHeroPickerOpen(false)}
      />
    </div>
  );
}

export default App;
