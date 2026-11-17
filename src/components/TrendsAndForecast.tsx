import { useEffect, useState } from 'react';
import {
  Award,
  BarChart3,
  BookMarked,
  CalendarDays,
  Compass,
  Gauge,
  Grid,
  List,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { getLocalDateString } from '../data/defaultState';
import { QURAN_JUZ_LIST, getJuzInfo, getSurahInfo, getSurahLineFromPosition } from '../data/quranMetadata';
import type { AppSettings, DailyLogEntry, QuranPosition } from '../types/hifz';
import { calculateForecast, computePaceMetrics, getMarkFeedback } from '../utils/hifzMath';

type TimeframeKey = '7d' | '14d' | '21d' | '30d' | 'all';

interface TimeframeOption {
  key: TimeframeKey;
  label: string;
  days: number | null;
}

const TIMEFRAMES: TimeframeOption[] = [
  { key: '7d', label: '1 Week', days: 7 },
  { key: '14d', label: '2 Weeks', days: 14 },
  { key: '21d', label: '3 Weeks', days: 21 },
  { key: '30d', label: 'Monthly', days: 30 },
  { key: 'all', label: 'All Time', days: null },
];

interface SiparaSummary {
  juzNumber: number;
  juzName: string;
  count: number;
  avgMark: number;
  lastDate: string;
}

interface TrendsAndForecastProps {
  logs: DailyLogEntry[];
  settings: AppSettings;
  quranPosition: QuranPosition;
}

function getCutoffDateString(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  return getLocalDateString(d);
}

export function TrendsAndForecast({ logs, settings, quranPosition }: TrendsAndForecastProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('7d');
  const [siparaViewMode, setSiparaViewMode] = useState<'revised' | 'all30'>('revised');

  const metrics = computePaceMetrics(logs);
  const defaultSliderPace = metrics.avgJadeedAyatsPerDay > 0 ? metrics.avgJadeedAyatsPerDay : 5;
  const [simulatedPace, setSimulatedPace] = useState<number>(defaultSliderPace);

  useEffect(() => {
    setSimulatedPace(metrics.avgJadeedAyatsPerDay > 0 ? metrics.avgJadeedAyatsPerDay : 5);
  }, [metrics.avgJadeedAyatsPerDay]);

  const forecast = calculateForecast(simulatedPace, settings);
  const isCustomPace =
    metrics.avgJadeedAyatsPerDay > 0 &&
    Math.abs(simulatedPace - metrics.avgJadeedAyatsPerDay) >= 0.1;

  // Filter logs for the selected timeframe
  const selectedTf = TIMEFRAMES.find((t) => t.key === timeframe) ?? TIMEFRAMES[0];
  const cutoffDate = selectedTf.days !== null ? getCutoffDateString(selectedTf.days) : null;
  const periodLogs = cutoffDate ? logs.filter((l) => l.date >= cutoffDate) : logs;

  // Period totals & averages
  const periodJadeedAyats = periodLogs.reduce((sum, l) => sum + l.jadeedAyats, 0);
  const periodTotalXp = periodLogs.reduce((sum, l) => sum + l.xpEarned, 0);
  const periodAvgMurajaat =
    periodLogs.length > 0
      ? Number(
          (periodLogs.reduce((s, l) => s + l.murajaatMark, 0) / periodLogs.length).toFixed(1)
        )
      : 0;
  const periodAvgJadeed =
    periodLogs.length > 0
      ? Number((periodLogs.reduce((s, l) => s + l.jadeedMark, 0) / periodLogs.length).toFixed(1))
      : 0;
  const periodAvgJuzHali =
    periodLogs.length > 0
      ? Number(
          (periodLogs.reduce((s, l) => s + l.juzHaliMark, 0) / periodLogs.length).toFixed(1)
        )
      : 0;

  // Aggregate Murajaat Sipara stats (Juz 1–30)
  const siparaMap = new Map<number, { count: number; totalMark: number; lastDate: string }>();
  for (const log of periodLogs) {
    if (!log.murajaatJuz) continue;
    const prev = siparaMap.get(log.murajaatJuz);
    if (!prev) {
      siparaMap.set(log.murajaatJuz, {
        count: 1,
        totalMark: log.murajaatMark,
        lastDate: log.date,
      });
    } else {
      siparaMap.set(log.murajaatJuz, {
        count: prev.count + 1,
        totalMark: prev.totalMark + log.murajaatMark,
        lastDate: log.date > prev.lastDate ? log.date : prev.lastDate,
      });
    }
  }

  const siparaSummaries: SiparaSummary[] = Array.from(siparaMap.entries())
    .map(([juzNumber, stats]) => ({
      juzNumber,
      juzName: getJuzInfo(juzNumber).name,
      count: stats.count,
      avgMark: Number((stats.totalMark / stats.count).toFixed(1)),
      lastDate: stats.lastDate,
    }))
    .sort((a, b) => b.count - a.count || b.avgMark - a.avgMark || a.juzNumber - b.juzNumber);

  const totalSiparaRevisions = Array.from(siparaMap.values()).reduce((s, v) => s + v.count, 0);
  const uniqueSiparasCount = siparaMap.size;

  // Current Surah bookmark progress (in 15-line Misri Mushaf lines)
  const currentSurah = getSurahInfo(quranPosition.surahNumber);
  const currentLine = getSurahLineFromPosition(quranPosition, currentSurah);
  const surahPct = Math.min(
    100,
    Math.round((currentLine / Math.max(1, currentSurah.totalLines)) * 100)
  );

  // Chart logs: show up to last 10 days inside the selected period
  const chartLogs = [...periodLogs].sort((a, b) => a.date.localeCompare(b.date)).slice(-10);
  const maxJadeedInChart = Math.max(10, ...chartLogs.map((l) => l.jadeedAyats));

  return (
    <div className="space-y-4">
      {/* Multi-Timeframe Overall Progress Report */}
      <section aria-labelledby="progress-report-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-amber-300 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-900">
              <Award className="h-3 w-3" aria-hidden="true" />
              Hero Battle Report
            </span>
            <h2 id="progress-report-heading" className="mt-1 font-comic text-2xl tracking-wide text-slate-900">
              Overall Hifz Progress
            </h2>
          </div>

          <span className="rounded-xl border-2 border-slate-900 bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-900">
            {periodLogs.length} Mission{periodLogs.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Timeframe Selector Pills */}
        <div
          role="group"
          aria-label="Select progress report timeframe"
          className="mt-3 flex flex-wrap gap-1.5"
        >
          {TIMEFRAMES.map((tf) => {
            const active = tf.key === timeframe;
            return (
              <button
                key={tf.key}
                type="button"
                aria-pressed={active}
                onClick={() => setTimeframe(tf.key)}
                className={`comic-btn rounded-xl px-3 py-1.5 text-xs font-black uppercase transition-colors ${
                  active
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-amber-100'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Current Quran Bookmark Power Bar */}
        <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-3.5 shadow-comic-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
              <span className="text-xs font-black uppercase text-slate-700">
                Current Quran Position
              </span>
            </div>
            <span className="rounded-lg border border-slate-900 bg-white px-2 py-0.5 text-xs font-black text-orange-700">
              Juz {quranPosition.juz} • {currentSurah.name} (Line {currentLine}/{currentSurah.totalLines})
            </span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-slate-900 bg-white">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-lime-400 transition-all duration-500"
              style={{ width: `${surahPct}%` }}
            />
          </div>
        </div>

        {/* 4 Summary Stat Tiles */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-sky-100 to-blue-50 p-3 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-sky-800">Murajaat Siparas</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              {totalSiparaRevisions} <span className="text-base">Revised</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              {uniqueSiparasCount} unique Juz • Avg {periodAvgMurajaat}/10
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-orange-100 to-amber-50 p-3 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-orange-800">Jadeed Done</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              +{periodJadeedAyats} <span className="text-base">Lines</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              ~{(periodJadeedAyats / Math.max(1, settings.ayatsPerPage)).toFixed(1)} pgs • Avg {periodAvgJadeed}/10
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-purple-100 to-fuchsia-50 p-3 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-purple-800">Juz Hali Avg</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              {periodAvgJuzHali} <span className="text-base">/ 10</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              Recent revision score
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-emerald-100 to-lime-50 p-3 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-emerald-800">XP Earned</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              +{periodTotalXp.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              In {selectedTf.label.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      {/* Sipara-by-Sipara Murajaat Mastery & Average Marks */}
      <section aria-labelledby="sipara-mastery-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-600" aria-hidden="true" />
            <h2 id="sipara-mastery-heading" className="font-comic text-2xl tracking-wide text-slate-900">
              Murajaat Sipara Marks ({selectedTf.label})
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-xl border-2 border-slate-900 bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => setSiparaViewMode('revised')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-black transition-colors ${
                siparaViewMode === 'revised' ? 'bg-slate-900 text-white' : 'text-slate-700'
              }`}
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Revised ({uniqueSiparasCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSiparaViewMode('all30')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-black transition-colors ${
                siparaViewMode === 'all30' ? 'bg-slate-900 text-white' : 'text-slate-700'
              }`}
            >
              <Grid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>All 30 Map</span>
            </button>
          </div>
        </div>

        {siparaViewMode === 'revised' ? (
          siparaSummaries.length === 0 ? (
            <div className="mt-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center text-xs font-bold text-slate-600">
              No Murajaat Sipara logs recorded in {selectedTf.label} yet! Log today&apos;s Juz on the Mission tab.
            </div>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {siparaSummaries.map((item) => {
                const fb = getMarkFeedback(Math.round(item.avgMark));
                const barPct = Math.min(100, Math.round((item.avgMark / 10) * 100));
                return (
                  <li
                    key={item.juzNumber}
                    className="rounded-2xl border-2 border-slate-900 bg-sky-50/70 p-3 shadow-comic-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-display text-base font-black text-slate-900">
                          Juz {item.juzNumber} — {item.juzName}
                        </span>
                        <p className="text-[11px] font-bold text-slate-600">
                          Last revised: {item.lastDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="rounded-xl border-2 border-slate-900 bg-white px-2.5 py-0.5 text-xs font-black text-sky-700">
                          {item.count}× Done
                        </span>
                        <span
                          className={`rounded-xl border-2 px-2.5 py-0.5 text-xs font-black ${fb.badgeColor} ${fb.textColor}`}
                        >
                          {fb.emoji} {item.avgMark}/10
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full border border-slate-900 bg-white">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        ) : (
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {QURAN_JUZ_LIST.map((juz) => {
              const stats = siparaMap.get(juz.number);
              const avg = stats ? Number((stats.totalMark / stats.count).toFixed(1)) : null;
              let tileStyle = 'border-slate-300 bg-slate-100 text-slate-400';
              if (stats && avg !== null) {
                if (avg >= 9) tileStyle = 'border-slate-900 bg-amber-300 text-slate-950 shadow-comic-sm';
                else if (avg >= 7.5) tileStyle = 'border-slate-900 bg-emerald-300 text-slate-950 shadow-comic-sm';
                else tileStyle = 'border-slate-900 bg-sky-300 text-slate-950 shadow-comic-sm';
              }

              return (
                <div
                  key={juz.number}
                  title={
                    stats
                      ? `Juz ${juz.number} (${juz.name}): Revised ${stats.count}x, Avg ${avg}/10`
                      : `Juz ${juz.number} (${juz.name}): Not revised in ${selectedTf.label}`
                  }
                  className={`flex flex-col items-center justify-center rounded-xl border-2 p-2 text-center ${tileStyle}`}
                >
                  <span className="font-comic text-base leading-none">J{juz.number}</span>
                  {stats && avg !== null ? (
                    <>
                      <span className="mt-1 text-[10px] font-black leading-none">{avg}★</span>
                      <span className="mt-0.5 text-[9px] font-extrabold leading-none">
                        {stats.count}×
                      </span>
                    </>
                  ) : (
                    <span className="mt-1 text-[10px] font-bold leading-none">—</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Real Pace Summary & Future Predictor */}
      <section aria-labelledby="pace-overview-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-sky-300 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-900">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Super Pace Radar
            </span>
            <h2 id="pace-overview-heading" className="mt-1 font-comic text-2xl tracking-wide text-slate-900">
              Future Hifz Predictor
            </h2>
          </div>
          <div className="rounded-2xl border-2 border-slate-900 bg-amber-100 px-3 py-1.5 text-right">
            <p className="text-[10px] font-black uppercase text-slate-600">Real Pace</p>
            <p className="font-display text-lg font-black text-orange-600">
              {metrics.avgJadeedAyatsPerDay} Lines/day
            </p>
          </div>
        </div>

        {/* Interactive What-If Super Pace Slider */}
        <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-indigo-50 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="what-if-pace-slider" className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
              <Gauge className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              <span>
                Test Pace: <strong className="text-indigo-700">{simulatedPace} Misri Lines / day</strong>
              </span>
            </label>

            {isCustomPace && (
              <button
                type="button"
                onClick={() => setSimulatedPace(metrics.avgJadeedAyatsPerDay)}
                className="inline-flex items-center gap-1 rounded-xl border-2 border-slate-900 bg-white px-2.5 py-1 text-xs font-black text-slate-900 hover:bg-amber-100"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>Use My Real Pace ({metrics.avgJadeedAyatsPerDay})</span>
              </button>
            )}
          </div>

          <input
            id="what-if-pace-slider"
            type="range"
            min={1}
            max={30}
            step={0.5}
            value={simulatedPace}
            onChange={(e) => setSimulatedPace(parseFloat(e.target.value))}
            className="mt-2.5 w-full accent-indigo-600 cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[11px] font-bold text-slate-500">
            <span>1 Line/day</span>
            <span>15 Lines (1 Page/day)</span>
            <span>30 Lines (2 Pgs/day)</span>
          </div>
        </div>

        {/* Forecast Cards Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-amber-100 to-yellow-50 p-3.5 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-orange-700">In 1 Month (30d)</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              {forecast.monthPages} <span className="text-lg">Pages</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              ~{forecast.monthAyats.toLocaleString()} Misri Lines
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-purple-100 to-fuchsia-50 p-3.5 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-purple-800">In 1 Year (365d)</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              {forecast.yearSiparas} <span className="text-lg">Siparas</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              ~{forecast.yearPages.toLocaleString()} Pages memorized!
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-emerald-100 to-teal-50 p-3.5 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-emerald-800">1 Full Sipara</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              {forecast.daysPerSipara ?? '—'} <span className="text-lg">Days</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              {settings.pagesPerSipara} pages/Sipara ({settings.pagesPerSipara * settings.ayatsPerPage} lines)
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-sky-100 to-blue-50 p-3.5 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-blue-800">Full 30 Siparas</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              {forecast.yearsForFullQuran ?? '—'} <span className="text-lg">Years</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              At {simulatedPace} lines/day pace
            </p>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Compass className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span>
            Based on {settings.ayatsPerPage} lines/page (15-line Misri) &amp; {settings.pagesPerSipara} pages/Sipara.
          </span>
        </p>
      </section>

      {/* Period Bar Chart */}
      <section aria-labelledby="chart-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-red-600" aria-hidden="true" />
            <h2 id="chart-heading" className="font-comic text-2xl tracking-wide text-slate-900">
              Daily Jadeed &amp; Marks ({selectedTf.label})
            </h2>
          </div>
          <span className="rounded-xl border-2 border-slate-900 bg-emerald-300 px-2.5 py-1 text-xs font-black text-slate-950">
            All-Time Avg: {metrics.overallAvgMark}/10
          </span>
        </div>

        {chartLogs.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-bold text-slate-600">
            No missions logged in {selectedTf.label} yet!
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-slate-50 p-3.5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-600">
              Daily Jadeed Misri Lines Memorized (Last {chartLogs.length} Active Days)
            </p>
            <div className="mt-3 flex h-36 items-end justify-around gap-2">
              {chartLogs.map((log) => {
                const heightPct = Math.max(12, Math.round((log.jadeedAyats / maxJadeedInChart) * 100));
                const avg = Number(
                  ((log.murajaatMark + log.juzHaliMark + log.jadeedMark) / 3).toFixed(1)
                );
                const shortDate = log.date.slice(5);
                return (
                  <div key={log.id} className="flex flex-1 flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[11px] font-black text-orange-600">
                      +{log.jadeedAyats}
                    </span>
                    <div className="relative flex w-full max-w-[34px] flex-1 items-end">
                      <div
                        className="w-full rounded-t-xl border-2 border-slate-900 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-300 transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                        title={`${log.date}: ${log.jadeedAyats} Lines, Avg Mark ${avg}/10`}
                      />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-700">{shortDate}</span>
                    <span className="rounded bg-slate-900 px-1 text-[9px] font-black text-yellow-300">
                      {avg}★
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Recent Mission History */}
      {periodLogs.length > 0 && (
        <section aria-labelledby="history-heading" className="comic-card bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h2 id="history-heading" className="font-comic text-2xl tracking-wide text-slate-900">
              Mission Log ({selectedTf.label})
            </h2>
          </div>

          <ul className="mt-3 space-y-2.5">
            {[...periodLogs]
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .slice(0, 15)
              .map((log) => (
                <li
                  key={log.id}
                  className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-3 text-xs font-bold text-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-sm font-black text-slate-900">{log.date}</span>
                    <span className="rounded-full border border-slate-900 bg-amber-300 px-2 py-0.5 font-black text-slate-900">
                      +{log.xpEarned} XP
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1.5 text-[11px]">
                    <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-900">
                      Murajaat:{' '}
                      <strong>
                        {log.murajaatJuz ? `Juz ${log.murajaatJuz}` : `${log.murajaatPages}p`}
                      </strong>{' '}
                      ({log.murajaatMark}/10)
                    </span>
                    <span className="rounded-lg bg-purple-100 px-2 py-1 text-purple-900">
                      Juz Hali: <strong>{log.juzHaliPages}p</strong> ({log.juzHaliMark}/10)
                    </span>
                    <span className="rounded-lg bg-orange-100 px-2 py-1 text-orange-900">
                      Jadeed: <strong>+{log.jadeedAyats}L</strong> ({log.jadeedMark}/10)
                    </span>
                  </div>
                  {log.jadeedNote && (
                    <p className="mt-1.5 text-[11px] font-extrabold text-slate-600">
                      📖 {log.jadeedNote}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
