import { useEffect, useRef, useState } from 'react';
import { Gift, Lock, Sparkles, X } from 'lucide-react';
import type { HeroId, ShortTermGoal, TreatItem } from '../types/hifz';
import { useNativeDialogControls } from '../utils/dialogHelpers';
import { fireAvengersConfettiRain } from '../utils/hifzMath';
import { playGrandPrizeChord, playHeroThemeSound, playWheelTick } from '../utils/sound';

interface TreatSpinWheelModalProps {
  isOpen: boolean;
  heroId?: HeroId;
  treats: TreatItem[];
  shortTermGoal: ShortTermGoal;
  soundEnabled: boolean;
  onClose: () => void;
  onTreatWon: (treat: TreatItem) => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDegFromTop: number) {
  const rad = ((angleDegFromTop - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end = polarToCartesian(cx, cy, r, startDeg);
  const largeArcFlag = endDeg - startDeg <= 180 ? '0' : '1';
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
}

export function TreatSpinWheelModal({
  isOpen,
  heroId = 'iron-hafiz',
  treats,
  shortTermGoal,
  soundEnabled,
  onClose,
  onTreatWon,
}: TreatSpinWheelModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stopConfettiRef = useRef<(() => void) | null>(null);

  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<TreatItem | null>(null);
  const [hasSpunThisOpen, setHasSpunThisOpen] = useState<boolean>(false);

  const wheelUnlocked =
    shortTermGoal.currentAyats >= shortTermGoal.targetAyats || shortTermGoal.bonusSpins > 0;
  const remainingAyats = Math.max(0, shortTermGoal.targetAyats - shortTermGoal.currentAyats);

  useEffect(() => {
    if (isOpen) {
      setWinner(null);
      setHasSpunThisOpen(false);
    }
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      stopConfettiRef.current?.();
      stopConfettiRef.current = null;
    };
  }, [isOpen]);

  useNativeDialogControls(
    dialogRef,
    isOpen,
    () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setIsSpinning(false);
      onClose();
    },
    !isSpinning
  );

  const safeTreats: TreatItem[] =
    treats.length > 0
      ? treats
      : [{ id: 'fallback', label: 'Hero Treat!', emoji: '🎁', color: '#f97316' }];

  const sliceCount = safeTreats.length;
  const sliceDeg = 360 / sliceCount;

  const handleSpin = () => {
    if (isSpinning || !wheelUnlocked || hasSpunThisOpen) return;

    setWinner(null);
    setIsSpinning(true);
    setHasSpunThisOpen(true);

    const winIndex = Math.floor(Math.random() * sliceCount);
    // Target a safe interior point of the chosen slice (18% to 82% of slice width)
    const offsetInsideSlice = (0.18 + Math.random() * 0.64) * sliceDeg;
    const targetWheelAngleAtTop = winIndex * sliceDeg + offsetInsideSlice;
    const desiredMod = (360 - (targetWheelAngleAtTop % 360) + 360) % 360;

    const startRotation = rotationDeg;
    const currentMod = ((startRotation % 360) + 360) % 360;
    const deltaMod = (desiredMod - currentMod + 360) % 360;
    const extraSpins = 6 * 360;
    const totalDelta = extraSpins + deltaMod;

    const durationMs = 4600;
    const startTime = performance.now();
    let lastTickSlice = -1;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // Smooth dramatic deceleration
      const eased = 1 - Math.pow(1 - t, 3.6);
      const currentRot = startRotation + totalDelta * eased;
      setRotationDeg(currentRot);

      const angleUnderPointer = ((360 - (currentRot % 360)) + 360) % 360;
      const currentSliceIdx = Math.floor(angleUnderPointer / sliceDeg) % sliceCount;
      if (currentSliceIdx !== lastTickSlice) {
        if (lastTickSlice !== -1) {
          playWheelTick(soundEnabled);
        }
        lastTickSlice = currentSliceIdx;
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
        setIsSpinning(false);
        const landedTreat = safeTreats[winIndex];
        setWinner(landedTreat);
        stopConfettiRef.current?.();
        stopConfettiRef.current = fireAvengersConfettiRain(
          heroId,
          'grand',
          confettiCanvasRef.current
        );
        playHeroThemeSound(heroId, soundEnabled, 'grand');
        playGrandPrizeChord(soundEnabled);
        onTreatWon(landedTreat);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  return (
    <dialog
      ref={dialogRef}
      {...(!isSpinning ? ({ closedby: 'any' } as Record<string, string>) : {})}
      aria-labelledby="spin-wheel-title"
      className="w-full"
    >
      <div className="comic-card relative z-10 overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3px] border-slate-900 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-slate-950" aria-hidden="true" />
            <h2 id="spin-wheel-title" className="font-comic text-2xl tracking-wider text-slate-950">
              TREAT SPIN WHEEL!
            </h2>
          </div>

          <form method="dialog">
            <button
              type="submit"
              value="close"
              disabled={isSpinning}
              aria-label="Close treat wheel dialog"
              className="comic-btn flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 disabled:opacity-40"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="p-4 sm:p-5">
          {/* Status / Instructions */}
          {!wheelUnlocked && !hasSpunThisOpen && (
            <div className="mb-3 flex items-center gap-2.5 rounded-2xl border-2 border-slate-900 bg-amber-100 px-3.5 py-2.5 text-xs font-extrabold text-slate-900">
              <Lock className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
              <span>
                Preview Mode: Memorize <strong>{remainingAyats} more Jadeed Line{remainingAyats === 1 ? '' : 's'}</strong> to unlock your spin!
              </span>
            </div>
          )}

          {/* Wheel Container */}
          <div className="relative mx-auto flex max-w-[310px] flex-col items-center">
            {/* Pointer Flapper */}
            <div
              className="relative z-20 -mb-3 flex flex-col items-center drop-shadow-[0_3px_0_#0f172a]"
              aria-hidden="true"
            >
              <div className="h-0 w-0 border-x-[15px] border-t-[26px] border-x-transparent border-t-red-600" />
            </div>

            {/* Rotating SVG Wheel */}
            <div className="relative w-full aspect-square rounded-full border-[5px] border-slate-900 bg-slate-900 p-1 shadow-comic-lg">
              <svg
                viewBox="0 0 320 320"
                className="h-full w-full"
                style={{
                  transform: `rotate(${rotationDeg}deg)`,
                }}
                role="img"
                aria-label={`Treat prize wheel with ${sliceCount} treats`}
              >
                {sliceCount === 1 ? (
                  <g>
                    <circle cx="160" cy="160" r="154" fill={safeTreats[0].color} stroke="#0f172a" strokeWidth="3" />
                    <text x="160" y="105" textAnchor="middle" fontSize="34">
                      {safeTreats[0].emoji}
                    </text>
                    <text
                      x="160"
                      y="142"
                      textAnchor="middle"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                      paintOrder="stroke"
                      fontWeight="900"
                      fontSize="16"
                    >
                      {safeTreats[0].label.slice(0, 18)}
                    </text>
                  </g>
                ) : (
                  safeTreats.map((treat, idx) => {
                    const startDeg = idx * sliceDeg;
                    const endDeg = (idx + 1) * sliceDeg;
                    const midDeg = startDeg + sliceDeg / 2;
                    const pathData = describeSlicePath(160, 160, 154, startDeg, endDeg);
                    const isWinnerSlice = winner?.id === treat.id;

                    // Position label along slice radius
                    const shortLabel =
                      treat.label.length > 14 ? `${treat.label.slice(0, 13)}…` : treat.label;

                    return (
                      <g key={treat.id}>
                        <path
                          d={pathData}
                          fill={treat.color}
                          stroke="#0f172a"
                          strokeWidth={isWinnerSlice ? '4.5' : '2.5'}
                          opacity={winner && !isWinnerSlice ? 0.72 : 1}
                        />
                        <g transform={`rotate(${midDeg}, 160, 160)`}>
                          <text x="160" y="42" textAnchor="middle" fontSize="22">
                            {treat.emoji}
                          </text>
                          <text
                            x="160"
                            y="66"
                            textAnchor="middle"
                            fill="#ffffff"
                            stroke="#0f172a"
                            strokeWidth="3.2"
                            paintOrder="stroke"
                            fontFamily="Fredoka, Nunito, sans-serif"
                            fontWeight="800"
                            fontSize={sliceCount > 7 ? '10' : '11.5'}
                          >
                            {shortLabel}
                          </text>
                        </g>
                      </g>
                    );
                  })
                )}

                {/* Rim Pegs */}
                {safeTreats.map((_, idx) => {
                  const pt = polarToCartesian(160, 160, 148, idx * sliceDeg);
                  return (
                    <circle
                      key={`peg-${idx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#fef08a"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Center Hub */}
                <circle cx="160" cy="160" r="24" fill="#facc15" stroke="#0f172a" strokeWidth="4" />
                <text x="160" y="167" textAnchor="middle" fontSize="20">
                  ⚡
                </text>
              </svg>
            </div>
          </div>

          {/* Winner Banner (polite live announcement) */}
          <div role="status" aria-live="polite" className="mt-4">
            {winner ? (
              <div className="rounded-2xl border-[3px] border-slate-900 bg-gradient-to-r from-lime-300 via-yellow-200 to-amber-300 p-3.5 text-center shadow-comic-sm">
                <p className="text-xs font-black uppercase tracking-widest text-slate-800">
                  YOU WON THIS TREAT!
                </p>
                <p className="mt-1 font-comic text-3xl tracking-wide text-slate-950">
                  {winner.emoji} {winner.label}
                </p>
                <p className="mt-1 text-xs font-extrabold text-slate-700">
                  Saved to your Treat Vault — show Mom or Dad to claim! 🎉
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-center text-xs font-bold text-slate-600">
                {isSpinning
                  ? 'Spinning at superhero speed... good luck!'
                  : `${sliceCount} awesome treats on the wheel!`}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-2">
            {!winner && (
              <button
                type="button"
                onClick={handleSpin}
                disabled={!wheelUnlocked || isSpinning || hasSpunThisOpen}
                autoFocus={wheelUnlocked}
                className="comic-btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 px-4 py-3 font-comic text-2xl tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Gift className="h-6 w-6 text-yellow-300" aria-hidden="true" />
                <span>{isSpinning ? 'SPINNING...' : wheelUnlocked ? 'SPIN THE WHEEL!' : 'LOCKED — KEEP MEMORIZING!'}</span>
              </button>
            )}

            <form method="dialog">
              <button
                type="submit"
                value="done"
                disabled={isSpinning}
                autoFocus={Boolean(winner) || !wheelUnlocked}
                className={`comic-btn w-full rounded-2xl px-4 py-2.5 font-display text-sm font-black uppercase tracking-wide disabled:opacity-40 ${
                  winner
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {winner ? 'Awesome! Continue Mission' : 'Close'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <canvas
        ref={confettiCanvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20"
        style={{ width: '100dvw', height: '100dvh' }}
      />
    </dialog>
  );
}
