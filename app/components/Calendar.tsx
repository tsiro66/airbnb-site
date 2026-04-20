"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Demo unavailable dates (scattered across next few months)
const UNAVAILABLE: Set<string> = new Set([
  "2026-04-22", "2026-04-23", "2026-04-24",
  "2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04",
  "2026-05-14", "2026-05-15", "2026-05-16",
  "2026-05-28", "2026-05-29", "2026-05-30", "2026-05-31",
  "2026-06-05", "2026-06-06", "2026-06-07",
  "2026-06-18", "2026-06-19", "2026-06-20", "2026-06-21",
  "2026-07-10", "2026-07-11", "2026-07-12", "2026-07-13", "2026-07-14",
  "2026-07-25", "2026-07-26",
]);

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function isPast(y: number, m: number, d: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(y, m, d) < today;
}

interface CalendarProps {
  apartment: string;
}

export default function Calendar({ apartment }: CalendarProps) {
  const today = new Date();
  const [baseMonth, setBaseMonth] = useState(today.getMonth());
  const [baseYear, setBaseYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const monthNavRef = useRef<HTMLDivElement>(null);
  const gridsRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Intro animation
  useGSAP(() => {
    const els = [titleRef.current, subtitleRef.current, monthNavRef.current, gridsRef.current, legendRef.current, summaryRef.current].filter(Boolean);
    gsap.from(els, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.2,
    });
  }, []);

  const handleDayClick = useCallback((key: string) => {
    if (UNAVAILABLE.has(key)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      setCheckIn(key);
      setCheckOut(null);
    } else {
      // Set check-out
      if (key <= checkIn) {
        // Clicked before check-in — reset
        setCheckIn(key);
        setCheckOut(null);
      } else {
        // Verify no unavailable dates in range
        const start = new Date(checkIn);
        const end = new Date(key);
        let blocked = false;
        const cursor = new Date(start);
        while (cursor <= end) {
          if (UNAVAILABLE.has(toKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()))) {
            blocked = true;
            break;
          }
          cursor.setDate(cursor.getDate() + 1);
        }
        if (blocked) {
          setCheckIn(key);
          setCheckOut(null);
        } else {
          setCheckOut(key);
        }
      }
    }
  }, [checkIn, checkOut]);

  const isInRange = useCallback((key: string) => {
    if (!checkIn || !checkOut) return false;
    return key > checkIn && key < checkOut;
  }, [checkIn, checkOut]);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  function navigateMonth(dir: -1 | 1) {
    let m = baseMonth + dir;
    let y = baseYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setBaseMonth(m);
    setBaseYear(y);
  }

  // Second month
  const month2 = baseMonth === 11 ? 0 : baseMonth + 1;
  const year2 = baseMonth === 11 ? baseYear + 1 : baseYear;

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <h2
        ref={titleRef}
        className="text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-melodrama)] text-center mb-3"
      >
        {apartment}
      </h2>
      <p ref={subtitleRef} className="text-stone-500 text-center text-sm md:text-base mb-10">
        Select your check-in and check-out dates
      </p>

      {/* Month navigation */}
      <div ref={monthNavRef} className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm sm:text-base font-medium tracking-wide font-[family-name:var(--font-satoshi)]">
          {MONTHS[baseMonth]} {baseYear} — {MONTHS[month2]} {year2}
        </span>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Two-month grid */}
      <div ref={gridsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <MonthGrid
          year={baseYear}
          month={baseMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          onDayClick={handleDayClick}
          isInRange={isInRange}
        />
        <MonthGrid
          year={year2}
          month={month2}
          checkIn={checkIn}
          checkOut={checkOut}
          onDayClick={handleDayClick}
          isInRange={isInRange}
        />
      </div>

      {/* Legend */}
      <div ref={legendRef} className="flex items-center justify-center gap-6 mt-10 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-black" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-stone-300" />
          In range
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-stone-200 relative">
            <span className="absolute inset-0 flex items-center justify-center text-stone-400 text-[8px] leading-none">×</span>
          </span>
          Unavailable
        </span>
      </div>

      {/* Summary bar */}
      <div
        ref={summaryRef}
        className="mt-10 p-6 rounded-2xl bg-white/60 backdrop-blur border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex flex-col sm:flex-row gap-6 text-sm">
          <div>
            <span className="text-stone-400 block text-xs tracking-wide uppercase mb-1">Check-in</span>
            <span className="font-medium font-[family-name:var(--font-satoshi)]">
              {checkIn ? formatDate(checkIn) : "—"}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-xs tracking-wide uppercase mb-1">Check-out</span>
            <span className="font-medium font-[family-name:var(--font-satoshi)]">
              {checkOut ? formatDate(checkOut) : "—"}
            </span>
          </div>
          {nights > 0 && (
            <div>
              <span className="text-stone-400 block text-xs tracking-wide uppercase mb-1">Nights</span>
              <span className="font-medium font-[family-name:var(--font-satoshi)]">{nights}</span>
            </div>
          )}
        </div>
        <button
          disabled={!checkIn || !checkOut}
          className="rounded-full bg-black text-white px-8 py-3 text-sm font-semibold tracking-wide hover:bg-stone-800 transition-colors cursor-pointer shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

/* ── Month Grid ────────────────────────────────────────── */

interface MonthGridProps {
  year: number;
  month: number;
  checkIn: string | null;
  checkOut: string | null;
  onDayClick: (key: string) => void;
  isInRange: (key: string) => boolean;
}

function MonthGrid({ year, month, checkIn, checkOut, onDayClick, isInRange }: MonthGridProps) {
  const firstDay = new Date(year, month, 1);
  // Monday-based: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <h3 className="text-center font-medium mb-4 font-[family-name:var(--font-satoshi)] text-sm tracking-wide">
        {MONTHS[month]} {year}
      </h3>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <span key={d} className="text-center text-[10px] text-stone-400 font-medium tracking-wider uppercase">
            {d}
          </span>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />;

          const key = toKey(year, month, day);
          const unavailable = UNAVAILABLE.has(key);
          const past = isPast(year, month, day);
          const disabled = unavailable || past;
          const isCheckIn = key === checkIn;
          const isCheckOut = key === checkOut;
          const selected = isCheckIn || isCheckOut;
          const inRange = isInRange(key);

          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => onDayClick(key)}
              className={`
                relative aspect-square flex items-center justify-center rounded-full text-sm
                transition-colors duration-200 cursor-pointer
                ${disabled
                  ? "text-stone-300 cursor-not-allowed"
                  : selected
                    ? "bg-black text-white font-semibold"
                    : inRange
                      ? "bg-stone-200 text-stone-800"
                      : "hover:bg-stone-100 text-stone-700"
                }
              `}
            >
              {day}
              {unavailable && !past && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="block w-[60%] h-px bg-stone-300 rotate-45" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────── */

function formatDate(key: string) {
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
