"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Calendar from "../components/Calendar";
import { apartments } from "../data/apartments";

function BookingContent() {
  const params = useSearchParams();
  const idx = Number(params.get("apt") ?? 0);
  const apt = apartments[idx] ?? apartments[0];

  return (
    <main className="min-h-screen bg-[#faf4dd] pt-28 pb-20">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors font-[family-name:var(--font-satoshi)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <Calendar apartment={apt.label} />
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookingContent />
    </Suspense>
  );
}
