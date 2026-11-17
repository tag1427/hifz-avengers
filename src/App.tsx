import { useEffect, useRef, useState } from 'react';
import {
  Cloud,
  Flame,
  HardDrive,
  Lock,
  TrendingUp,
  Trophy,
  Unlock,
  UserPlus,
  Users,
} from 'lucide-react';
import { CelebrationModal, type CelebrationPayload } from './components/CelebrationModal';
import { DailyLogForm, type DailyMissionPayload } from './components/DailyLogForm';
import { GoalProgressBanner } from './components/GoalProgressBanner';
import { GrandPrizeModal } from './components/GrandPrizeModal';
import { HeroAvatarSvg } from './components/HeroAvatarSvg';
import { HeroHeader } from './components/HeroHeader';
import { HeroPickerModal } from './components/HeroPickerModal';
import { ParentModule } from './components/ParentModule';
import { AddStudentDialog, StudentDashboard } from './components/StudentDashboard';
import { TreatSpinWheelModal } from './components/TreatSpinWheelModal';
import { TreatVault } from './components/TreatVault';
import { TrendsAndForecast } from './components/TrendsAndForecast';
import {
  createDemoState,
  createFreshState,
  fetchServerStore,
  isStoreStockDemo,
  loadMultiStore,
  mergeStoresPreservingUserData,
  saveMultiStore,
  saveServerStore,
  syncStoreMirrors,
} from './data/defaultState';
import { advanceQuranPosition, calculateSiparaProgress } from './data/quranMetadata';
import type {
  AppState,
  AppTab,
  DailyLogEntry,
  HeroId,
  HifzMultiStore,
  StudentProfile,
  TreatItem,
} from './types/hifz';
import { calculateStreak, fireHeroConfetti, getHeroRank } from './utils/hifzMath';
import { playGrandPrizeChord, playHeroFanfare, playTapClick } from './utils/sound';

export function App() {
  const [store, setStore] = useState<HifzMultiStore>(() => loadMultiStore());
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'checking' | 'synced' | 'local'>('checking');

  const isFirstRenderRef = useRef<boolean>(true);
  const skipNextPostRef = useRef<boolean>(false);
  const hasHydratedFromServerRef = useRef<boolean>(false);
  const allowNextSaveResetRef = useRef<boolean>(false);
  const saveInFlightRef = useRef<number>(0);
  const syncStatusRef = useRef<'checking' | 'synced' | 'local'>(syncStatus);
  syncStatusRef.current = syncStatus;
  const latestStoreRef = useRef<HifzMultiStore>(store);
  latestStoreRef.current = store;

  // Dialog states
  const [celebration, setCelebration] = useState<CelebrationPayload | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);
  const [isGrandPrizeOpen, setIsGrandPrizeOpen] = useState<boolean>(false);
  const [isHeroPickerOpen, setIsHeroPickerOpen] = useState<boolean>(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);

  // Save to localStorage and sync mutations to server (never overwriting before initial GET hydration)
  useEffect(() => {
    saveMultiStore(store);

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (skipNextPostRef.current) {
      skipNextPostRef.current = false;
      return;
    }

    if (!hasHydratedFromServerRef.current) {
      return;
    }

    const allowReset = allowNextSaveResetRef.current;
    allowNextSaveResetRef.current = false;

    let cancelled = false;
    saveInFlightRef.current += 1;
    saveServerStore(store, { allowReset })
      .then((ok) => {
        if (!cancelled) {
          setSyncStatus(ok ? 'synced' : 'local');
        }
      })
      .finally(() => {
        saveInFlightRef.current = Math.max(0, saveInFlightRef.current - 1);
      });

    return () => {
      cancelled = true;
    };
  }, [store]);

  // Initial hydrate from server + re-sync on focus/visibility
  useEffect(() => {
    let active = true;

    const syncFromServer = async (isInitialMount: boolean) => {
      if (!isInitialMount && saveInFlightRef.current > 0) {
        return;
      }

      const result = await fetchServerStore();
      if (!active) return;

      if (!result.reachable) {
        if (isInitialMount) {
          hasHydratedFromServerRef.current = true;
        }
        setSyncStatus('local');
        return;
      }

      if (result.store) {
        const shouldMerge = isInitialMount || syncStatusRef.current === 'local';
        const resolvedStore = shouldMerge
          ? mergeStoresPreservingUserData(latestStoreRef.current, result.store)
          : result.store;

        const resolvedJson = JSON.stringify(resolvedStore);
        const currentJson = JSON.stringify(latestStoreRef.current);
        const serverJson = JSON.stringify(result.store);

        hasHydratedFromServerRef.current = true;

        if (resolvedJson !== currentJson) {
          skipNextPostRef.current = true;
          setStore(resolvedStore);
        }

        if (shouldMerge && resolvedJson !== serverJson && !isStoreStockDemo(resolvedStore)) {
          const ok = await saveServerStore(resolvedStore);
          if (active) {
            setSyncStatus(ok ? 'synced' : 'local');
          }
        } else {
          setSyncStatus('synced');
        }
      } else if (isInitialMount) {
        hasHydratedFromServerRef.current = true;
        const ok = await saveServerStore(latestStoreRef.current);
        if (active) {
          setSyncStatus(ok ? 'synced' : 'local');
        }
      } else {
        hasHydratedFromServerRef.current = true;
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

  const state: StudentProfile =
    store.students.find((s) => s.id === store.activeStudentId) ?? store.students[0];

  const updateActiveStudent = (updater: (prev: AppState) => AppState) => {
    setStore((prevStore) => {
      const targetId = prevStore.activeStudentId ?? prevStore.students[0]?.id;
      const nowIso = new Date().toISOString();
      const updatedStudents = prevStore.students.map((student) => {
        if (student.id !== targetId) return student;
        const nextApp = updater(student);
        return {
          ...nextApp,
          id: student.id,
          createdAt: student.createdAt,
          updatedAt: nowIso,
        };
      });
      return syncStoreMirrors({
        ...prevStore,
        activeStudentId: targetId,
        students: updatedStudents,
      });
    });
  };

  const handleSelectStudent = (studentId: string) => {
    playTapClick(state.settings.soundEnabled);
    setStore((prevStore) =>
      syncStoreMirrors({
        ...prevStore,
        activeStudentId: studentId,
      })
    );
    setShowDashboard(false);
    setActiveTab('home');
  };

  const handleAddStudent = (newStudent: StudentProfile) => {
    playTapClick(state.settings.soundEnabled);
    setStore((prevStore) =>
      syncStoreMirrors({
        ...prevStore,
        activeStudentId: newStudent.id,
        students: [...prevStore.students, newStudent],
      })
    );
    setIsAddStudentOpen(false);
    setShowDashboard(false);
    setActiveTab('home');
  };

  const handleDeleteActiveStudent = () => {
    setStore((prevStore) => {
      if (prevStore.students.length <= 1) return prevStore;
      const remaining = prevStore.students.filter((s) => s.id !== state.id);
      return syncStoreMirrors({
        ...prevStore,
        activeStudentId: remaining[0].id,
        students: remaining,
      });
    });
    setShowDashboard(true);
    setActiveTab('home');
  };

  const streak = calculateStreak(state.logs);
  const pendingTreatsCount = state.wonTreats.filter((w) => !w.delivered).length;
  const lastMurajaatJuz =
    state.logs.length > 0 ? (state.logs[state.logs.length - 1].murajaatJuz ?? 30) : 30;

  const handleSubmitMission = (payload: DailyMissionPayload) => {
    const xpEarned =
      payload.murajaatMark * 8 +
      payload.juzHaliMark * 8 +
      payload.jadeedMark * 10 +
      payload.jadeedAyats * 12;

    const effectiveDirection =
      state.longTermGoal.mode !== 'custom'
        ? (state.longTermGoal.surahDirection ?? state.quranPosition.surahDirection ?? 'reverse')
        : (state.quranPosition.surahDirection ?? 'reverse');

    const advanceResult = advanceQuranPosition(
      { ...state.quranPosition, surahDirection: effectiveDirection },
      payload.jadeedAyats
    );

    const entry: DailyLogEntry = {
      id: `log-${Date.now()}`,
      date: payload.date,
      createdAt: new Date().toISOString(),
      murajaatJuz: payload.murajaatJuz,
      murajaatPages: payload.murajaatPages,
      murajaatMark: payload.murajaatMark,
      juzHaliPages: payload.juzHaliPages,
      juzHaliMark: payload.juzHaliMark,
      jadeedAyats: payload.jadeedAyats,
      jadeedMark: payload.jadeedMark,
      jadeedNote:
        payload.jadeedNote ||
        (payload.jadeedAyats > 0 ? advanceResult.summaryText : undefined),
      jadeedJuz: advanceResult.newPosition.juz,
      jadeedSurahNumber: advanceResult.endSurah.number,
      jadeedStartAyat: advanceResult.startAyat,
      jadeedEndAyat: advanceResult.endAyat,
      xpEarned,
    };

    const oldLevel = getHeroRank(state.xp).level;
    const newXp = state.xp + xpEarned;
    const newLevel = getHeroRank(newXp).level;
    const leveledUp = newLevel > oldLevel;

    const newShortCurrent = state.shortTermGoal.currentAyats + payload.jadeedAyats;
    const wheelUnlockedNow =
      newShortCurrent >= state.shortTermGoal.targetAyats || state.shortTermGoal.bonusSpins > 0;

    const isSiparaMode = state.longTermGoal.mode !== 'custom';
    const siparaAfter = isSiparaMode
      ? calculateSiparaProgress(
          state.longTermGoal.targetJuz ?? advanceResult.newPosition.juz,
          advanceResult.newPosition,
          state.longTermGoal.surahDirection ?? effectiveDirection
        )
      : null;

    const longDelta =
      state.longTermGoal.unit === 'pages'
        ? payload.jadeedAyats / Math.max(1, state.settings.ayatsPerPage)
        : payload.jadeedAyats;
    const newLongCurrent = siparaAfter
      ? siparaAfter.completedAyats
      : Number((state.longTermGoal.currentValue + longDelta).toFixed(1));
    const grandPrizeUnlockedNow = siparaAfter
      ? siparaAfter.isComplete && !state.longTermGoal.claimed
      : newLongCurrent >= state.longTermGoal.targetValue && !state.longTermGoal.claimed;

    updateActiveStudent((prev) => {
      const prevDir =
        prev.longTermGoal.mode !== 'custom'
          ? (prev.longTermGoal.surahDirection ?? prev.quranPosition.surahDirection ?? 'reverse')
          : (prev.quranPosition.surahDirection ?? 'reverse');
      const nextPos = advanceQuranPosition(
        { ...prev.quranPosition, surahDirection: prevDir },
        payload.jadeedAyats
      ).newPosition;
      const prevSipara =
        prev.longTermGoal.mode !== 'custom'
          ? calculateSiparaProgress(
              prev.longTermGoal.targetJuz ?? nextPos.juz,
              nextPos,
              prev.longTermGoal.surahDirection ?? prevDir
            )
          : null;

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        quranPosition: nextPos,
        logs: [...prev.logs, entry],
        shortTermGoal: {
          ...prev.shortTermGoal,
          currentAyats: prev.shortTermGoal.currentAyats + payload.jadeedAyats,
        },
        longTermGoal: prevSipara
          ? {
              ...prev.longTermGoal,
              targetValue: prevSipara.totalAyats,
              currentValue: prevSipara.completedAyats,
            }
          : {
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
      };
    });

    const avgMark = (payload.murajaatMark + payload.juzHaliMark + payload.jadeedMark) / 3;
    fireHeroConfetti(avgMark >= 9 || wheelUnlockedNow || grandPrizeUnlockedNow ? 'grand' : 'normal');
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
    updateActiveStudent((prev) => {
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

    updateActiveStudent((prev) => ({
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
    updateActiveStudent((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        heroId,
      },
    }));
  };

  const handleToggleSound = () => {
    updateActiveStudent((prev) => ({
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
        {/* Top Student Switcher & Main Dashboard Navigation Bar */}
        <div className="comic-card flex flex-wrap items-center gap-2 bg-white/95 p-2.5">
          <button
            type="button"
            onClick={() => {
              playTapClick(state.settings.soundEnabled);
              setShowDashboard(true);
            }}
            className={`comic-btn inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black uppercase ${
              showDashboard
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-100 text-indigo-950 hover:bg-indigo-200'
            }`}
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>All Students</span>
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5">
            {store.students.map((student) => {
              const active = !showDashboard && student.id === state.id;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => handleSelectStudent(student.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border-2 px-2.5 py-1 text-xs font-black transition ${
                    active
                      ? 'border-slate-900 bg-amber-300 text-slate-950 shadow-comic-sm'
                      : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-900 hover:bg-amber-50'
                  }`}
                >
                  <HeroAvatarSvg heroId={student.settings.heroId} className="h-5 w-5" />
                  <span className="max-w-[90px] truncate">{student.settings.childName}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              playTapClick(state.settings.soundEnabled);
              setIsAddStudentOpen(true);
            }}
            className="comic-btn inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-400 px-3 py-1.5 text-xs font-black uppercase text-slate-950 hover:bg-emerald-500"
          >
            <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>+ Child</span>
          </button>
        </div>

        {showDashboard ? (
          <StudentDashboard
            students={store.students}
            activeStudentId={store.activeStudentId}
            onSelectStudent={handleSelectStudent}
            onOpenAddModal={() => setIsAddStudentOpen(true)}
          />
        ) : (
          <>
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
                quranPosition={state.quranPosition}
                onOpenWheel={() => setIsWheelOpen(true)}
                onOpenGrandPrize={() => setIsGrandPrizeOpen(true)}
              />
            )}

            <main>
              {activeTab === 'home' && (
                <DailyLogForm
                  key={state.id}
                  settings={state.settings}
                  quranPosition={state.quranPosition}
                  lastMurajaatJuz={lastMurajaatJuz}
                  onSubmitMission={handleSubmitMission}
                />
              )}

              {activeTab === 'trends' && (
                <TrendsAndForecast
                  logs={state.logs}
                  settings={state.settings}
                  quranPosition={state.quranPosition}
                />
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
                  key={state.id}
                  state={state}
                  totalStudents={store.students.length}
                  allStudentsStore={store}
                  isUnlocked={isParentUnlocked}
                  onUnlock={() => setIsParentUnlocked(true)}
                  onLock={() => setIsParentUnlocked(false)}
                  onUpdateState={updateActiveStudent}
                  onDeleteStudent={handleDeleteActiveStudent}
                  onRestoreBackup={(restored) => {
                    allowNextSaveResetRef.current = true;
                    setStore(restored);
                  }}
                  onLoadDemo={() => {
                    allowNextSaveResetRef.current = true;
                    updateActiveStudent(() => createDemoState());
                  }}
                  onResetFresh={() => {
                    allowNextSaveResetRef.current = true;
                    updateActiveStudent((prev) => ({
                      ...createFreshState(),
                      settings: {
                        ...createFreshState().settings,
                        childName: prev.settings.childName,
                        heroId: prev.settings.heroId,
                        parentPin: prev.settings.parentPin,
                      },
                    }));
                  }}
                />
              )}
            </main>
          </>
        )}

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

      {/* Fixed Mobile Bottom Navigation Bar (shown when a student is opened) */}
      {!showDashboard && (
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
              <span className="mt-0.5">Progress</span>
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
      )}

      {/* Modals */}
      <AddStudentDialog
        isOpen={isAddStudentOpen}
        existingParentPin={state.settings.parentPin}
        onAddStudent={handleAddStudent}
        onClose={() => setIsAddStudentOpen(false)}
      />
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
