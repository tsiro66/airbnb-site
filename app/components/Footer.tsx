"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!footerRef.current || !contentRef.current) return;

    const els = contentRef.current.children;

    gsap.from(els, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 80%",
      },
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="sticky bottom-0 z-0 h-screen bg-black text-white flex flex-col items-center justify-center px-6 md:px-16 relative"
    >
      <div ref={contentRef} className="flex flex-col items-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-[family-name:var(--font-melodrama)] text-center">
          Bill Apartments
        </h2>
        <p className="mt-4 text-base md:text-lg text-stone-400 text-center max-w-md">
          Your perfect stay in the heart of Patra
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-8 sm:gap-16 text-sm text-stone-400">
          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold mb-1">Contact</span>
            <span className="cursor-pointer hover:text-white transition-colors">hello@billapartments.gr</span>
            <span className="cursor-pointer hover:text-white transition-colors">+30 2610 123 456</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold mb-1">Location</span>
            <span>Patra, Greece</span>
            <span>26221</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold mb-1">Social</span>
            <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
            <span className="cursor-pointer hover:text-white transition-colors">Airbnb</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 text-xs text-stone-600">
        &copy; 2026 Bill Apartments. All rights reserved.
      </div>
    </footer>
  );
}
