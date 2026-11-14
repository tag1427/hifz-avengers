import { useEffect, useState } from 'react';
import { BarChart3, CalendarDays, Compass, Gauge, RotateCcw, TrendingUp } from 'lucide-react';
import type { AppSettings, DailyLogEntry } from '../types/hifz';
import { calculateForecast, computePaceMetrics } from '../utils/hifzMath';

interface TrendsAndForecastProps {
  logs: DailyLogEntry[];
  settings: AppSettings;
}

export function TrendsAndForecast({ logs, settings }: TrendsAndForecastProps) {
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

  // Last 7 days (sorted chronological for chart)
  const recentLogs = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
  const maxJadeedInChart = Math.max(10, ...recentLogs.map((l) => l.jadeedAyats));

  return (
    <div className="space-y-4">
      {/* Real Pace Summary */}
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
              {metrics.avgJadeedAyatsPerDay} Ayats/day
            </p>
          </div>
        </div>

        {/* Interactive What-If Super Pace Slider */}
        <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-indigo-50 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="what-if-pace-slider" className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
              <Gauge className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              <span>
                Test Pace: <strong className="text-indigo-700">{simulatedPace} Jadeed Ayats / day</strong>
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
            <span>1 Ayat/day</span>
            <span>15 Ayats (1 Page/day)</span>
            <span>30 Ayats/day</span>
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
              ~{forecast.monthAyats.toLocaleString()} Jadeed Ayats
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
              {settings.pagesPerSipara} pages/Sipara
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-sky-100 to-blue-50 p-3.5 shadow-comic-sm">
            <p className="text-[11px] font-black uppercase text-blue-800">Full 30 Siparas</p>
            <p className="mt-1 font-comic text-3xl text-slate-950">
              {forecast.yearsForFullQuran ?? '—'} <span className="text-lg">Years</span>
            </p>
            <p className="mt-0.5 text-xs font-extrabold text-slate-700">
              At {simulatedPace} ayats/day pace
            </p>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Compass className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span>
            Based on {settings.ayatsPerPage} ayats/page &amp; {settings.pagesPerSipara} pages/Sipara (changeable in Parent HQ).
          </span>
        </p>
      </section>

      {/* Musaid Averages & 7-Day Bar Chart */}
      <section aria-labelledby="chart-heading" className="comic-card bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-red-600" aria-hidden="true" />
            <h2 id="chart-heading" className="font-comic text-2xl tracking-wide text-slate-900">
              Last 7 Missions &amp; Marks
            </h2>
          </div>
          <span className="rounded-xl border-2 border-slate-900 bg-emerald-300 px-2.5 py-1 text-xs font-black text-slate-950">
            Avg Score: {metrics.overallAvgMark}/10
          </span>
        </div>

        {/* Category Averages */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border-2 border-slate-900 bg-sky-50 p-2">
            <p className="text-[10px] font-black uppercase text-sky-700">Murajaat Avg</p>
            <p className="font-display text-lg font-black text-slate-900">{metrics.avgMurajaatMark}/10</p>
          </div>
          <div className="rounded-xl border-2 border-slate-900 bg-purple-50 p-2">
            <p className="text-[10px] font-black uppercase text-purple-700">Juz Hali Avg</p>
            <p className="font-display text-lg font-black text-slate-900">{metrics.avgJuzHaliMark}/10</p>
          </div>
          <div className="rounded-xl border-2 border-slate-900 bg-amber-50 p-2">
            <p className="text-[10px] font-black uppercase text-orange-700">Jadeed Avg</p>
            <p className="font-display text-lg font-black text-slate-900">{metrics.avgJadeedMark}/10</p>
          </div>
        </div>

        {recentLogs.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-bold text-slate-600">
            Log your first daily mission on the Home tab to unlock your superhero chart!
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-slate-50 p-3.5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-600">
              Daily Jadeed Ayats Memorized
            </p>
            <div className="mt-3 flex h-36 items-end justify-around gap-2">
              {recentLogs.map((log) => {
                const heightPct = Math.max(12, Math.round((log.jadeedAyats / maxJadeedInChart) * 100));
                const avg = Number(
                  ((log.murajaatMark + log.juzHaliMark + log.jadeedMark) / 3).toFixed(1)
                );
                const shortDate = log.date.slice(5); // MM-DD
                return (
                  <div key={log.id} className="flex flex-1 flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[11px] font-black text-orange-600">
                      +{log.jadeedAyats}
                    </span>
                    <div className="relative flex w-full max-w-[34px] flex-1 items-end">
                      <div
                        className="w-full rounded-t-xl border-2 border-slate-900 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-300 transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                        title={`${log.date}: ${log.jadeedAyats} Ayats, Avg Mark ${avg}/10`}
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
      {recentLogs.length > 0 && (
        <section aria-labelledby="history-heading" className="comic-card bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h2 id="history-heading" className="font-comic text-2xl tracking-wide text-slate-900">
              Recent Mission Log
            </h2>
          </div>

          <ul className="mt-3 space-y-2.5">
            {[...recentLogs].reverse().map((log) => (
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
                    Murajaat: <strong>{log.murajaatPages}p</strong> ({log.murajaatMark}/10)
                  </span>
                  <span className="rounded-lg bg-purple-100 px-2 py-1 text-purple-900">
                    Juz Hali: <strong>{log.juzHaliPages}p</strong> ({log.juzHaliMark}/10)
                  </span>
                  <span className="rounded-lg bg-orange-100 px-2 py-1 text-orange-900">
                    Jadeed: <strong>+{log.jadeedAyats}a</strong> ({log.jadeedMark}/10)
                  </span>
                </div>
                {log.jadeedNote && (
                  <p className="mt-1.5 text-[11px] font-extrabold text-slate-600">
                    Note: {log.jadeedNote}
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
