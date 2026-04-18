"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BookingBar from "./BookingBar";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkMobile);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const startWidth = isMobile ? 90 : 60;
  const startHeight = isMobile ? 40 : 55;
  const width = startWidth + progress * (100 - startWidth);
  const height = startHeight + progress * (100 - startHeight);
  const borderRadius = 24 * (1 - progress);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center overflow-hidden">
        <div className="flex flex-col items-center justify-center pt-28 md:pt-44 text-center px-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-[family-name:var(--font-melodrama)]">
            Bill Apartments Patra
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-stone-600">
            Your perfect stay in the heart of Patra
          </p>
        </div>

        <BookingBar />

        <div
          className="absolute bottom-0 overflow-hidden"
          style={{
            width: `${width}%`,
            height: `${height}vh`,
            borderTopLeftRadius: `${borderRadius}px`,
            borderTopRightRadius: `${borderRadius}px`,
          }}
        >
          <Image
            src="/demo-img.jpg"
            alt="Bill Apartments"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
