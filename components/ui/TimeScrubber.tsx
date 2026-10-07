"use client";

import { SPEEDS, useStore } from "@/lib/store";
import { DAY_MS, UNIVERSE_END, UNIVERSE_START, clamp, formatMonth } from "@/lib/time";

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
/** Captured once per page load; "PRESENT" means the clock has reached today. */
const LOADED_AT = Date.now();

export function TimeScrubber() {
  const date = useStore((s) => s.date);
  const playing = useStore((s) => s.playing);
  const speed = useStore((s) => s.speed);
  const setDate = useStore((s) => s.setDate);
  const togglePlay = useStore((s) => s.togglePlay);
  const pause = useStore((s) => s.pause);
  const cycleSpeed = useStore((s) => s.cycleSpeed);
  const value = clamp(date, UNIVERSE_START, UNIVERSE_END);
  const readout = date >= LOADED_AT - DAY_MS ? "PRESENT" : formatMonth(date);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center p-3 sm:p-5" data-testid="time-scrubber">
      <div className="hud-panel pointer-events-auto flex w-full max-w-2xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
        <button type="button" className="hud-btn w-9 shrink-0" onClick={togglePlay} aria-label={playing ? "Pause the clock" : "Play the clock"} data-testid="time-play">
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="relative flex-1">
          <input
            type="range"
            className="time-range"
            min={UNIVERSE_START}
            max={UNIVERSE_END}
            step={DAY_MS}
            value={value}
            aria-label="Mission clock"
            aria-valuetext={readout}
            data-testid="time-range"
            onInput={(e) => {
              pause();
              setDate(Number((e.target as HTMLInputElement).value));
            }}
            onChange={(e) => setDate(Number(e.target.value))}
          />
          <div className="pointer-events-none mt-1 flex justify-between font-mono text-[9px] tracking-wider text-muted" aria-hidden>
            {YEARS.map((y) => (
              <span key={y}>{y}</span>
            ))}
          </div>
        </div>
        <output className="w-[4.6rem] shrink-0 text-right font-mono text-xs tracking-wider text-ink" data-testid="time-readout">
          {readout}
        </output>
        <button
          type="button"
          className="hud-btn hidden w-14 shrink-0 sm:block"
          onClick={() => cycleSpeed(SPEEDS.indexOf(speed) >= SPEEDS.length - 1 ? -1 : 1)}
          title="Playback speed (days per second)"
          data-testid="time-speed"
        >
          ×{speed}
        </button>
      </div>
    </div>
  );
}
