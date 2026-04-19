"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const ready = useRef(false);

  // Init
  useEffect(() => {
    const nav = navRef.current;
    const curtain = curtainRef.current;
    if (!nav || !curtain) return;

    // Position curtain off-screen and make visible (was hidden to prevent flash)
    gsap.set(curtain, { yPercent: -100, visibility: "visible" });

    // Navbar intro
    gsap.set(nav, { opacity: 0, filter: "blur(10px)" });
    gsap.to(nav, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "back.inOut",
      delay: 2.8,
    });

    ready.current = true;
  }, []);

  // Open/close
  useEffect(() => {
    if (!ready.current) return;

    const curtain = curtainRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const links = linksRef.current;
    if (!curtain || !line1 || !line2 || !links) return;

    const linkEls = Array.from(links.children);

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.to(curtain, { yPercent: 0, duration: 1, ease: "power4.inOut" });
      gsap.to(line1, { rotation: 45, y: 4, duration: 0.4, ease: "power2.inOut" });
      gsap.to(line2, { rotation: -45, y: -4, duration: 0.4, ease: "power2.inOut" });
      gsap.fromTo(linkEls,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out", delay: 0.5 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });
      gsap.to(line1, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" });
      gsap.to(line2, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" });
    }
  }, [open]);

  return (
    <>
      <div
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 mix-blend-difference"
      >
        <span className="text-xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-satoshi)] text-white">
          Bill Apartments
        </span>
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-2 cursor-pointer"
        >
          <span ref={line1Ref} className="block w-10 h-0.5 bg-white origin-center" />
          <span ref={line2Ref} className="block w-10 h-0.5 bg-white origin-center" />
        </button>
      </div>

      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9998] bg-black invisible"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div ref={linksRef} className="flex flex-col items-center justify-center h-full gap-8 text-white">
          <a href="#" className="text-4xl sm:text-6xl font-light hover:opacity-60 transition-opacity font-[family-name:var(--font-melodrama)] cursor-pointer">
            Home
          </a>
          <a href="#" className="text-4xl sm:text-6xl font-light hover:opacity-60 transition-opacity font-[family-name:var(--font-melodrama)] cursor-pointer">
            Apartments
          </a>
          <a href="#" className="text-4xl sm:text-6xl font-light hover:opacity-60 transition-opacity font-[family-name:var(--font-melodrama)] cursor-pointer">
            Gallery
          </a>
          <a href="#" className="text-4xl sm:text-6xl font-light hover:opacity-60 transition-opacity font-[family-name:var(--font-melodrama)] cursor-pointer">
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
