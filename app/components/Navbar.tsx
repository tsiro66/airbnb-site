"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { apartments } from "../data/apartments";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [apartmentsOpen, setApartmentsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const circlesRef = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const dropdownUsed = useRef(false);

  // Init
  useEffect(() => {
    const nav = navRef.current;
    const curtain = curtainRef.current;
    const circles = circlesRef.current;
    if (!nav || !curtain) return;

    gsap.set(curtain, { yPercent: -100, visibility: "visible" });

    // Hide circles from the start — no CSS `hidden` needed
    if (circles) {
      gsap.set(circles, { display: "none", opacity: 0, y: -10 });
    }

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

    // Only animate nav links, not the circles row
    const linkEls = Array.from(links.children).filter(
      (el) => el !== circlesRef.current
    );

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.to(curtain, { yPercent: 0, duration: 1, ease: "power4.inOut" });
      gsap.to(line1, { rotation: 45, y: 4, duration: 0.4, ease: "power2.inOut" });
      gsap.to(line2, { rotation: -45, y: -4, duration: 0.4, ease: "power2.inOut" });
      gsap.fromTo(linkEls,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power2.out", delay: 0.5 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(curtain, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });
      gsap.to(line1, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" });
      gsap.to(line2, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" });

      // Hide circles immediately on close
      const circles = circlesRef.current;
      if (circles) {
        gsap.killTweensOf(circles);
        gsap.killTweensOf(Array.from(circles.children));
        gsap.set(circles, { display: "none", opacity: 0, y: -10 });
      }
    }
  }, [open]);

  // Animate circles dropdown
  useEffect(() => {
    const circles = circlesRef.current;
    if (!circles) return;

    // Kill any in-flight tweens
    gsap.killTweensOf(circles);
    gsap.killTweensOf(Array.from(circles.children));

    if (apartmentsOpen) {
      dropdownUsed.current = true;

      const tl = gsap.timeline();
      tl.set(circles, { display: "flex" });
      tl.fromTo(
        circles,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      tl.fromTo(
        Array.from(circles.children),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2)" },
        "-=0.3"
      );
    } else if (dropdownUsed.current) {
      // Only run close animation after dropdown has been opened at least once
      gsap.to(circles, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => gsap.set(circles, { display: "none" }),
      });
    }
  }, [apartmentsOpen]);

  const router = useRouter();
  const pathname = usePathname();

  const handleApartmentClick = (index: number) => {
    setOpen(false);

    if (pathname === "/") {
      // Already on home — dispatch event and scroll
      window.dispatchEvent(new CustomEvent("select-apartment", { detail: index }));
      const hero = document.getElementById("hero");
      if (hero) hero.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate home, Hero will pick up the index from the hash/event after mount
      // Store selected index so Hero can read it on mount
      sessionStorage.setItem("select-apartment", String(index));
      router.push("/");
    }
  };

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
          onClick={() => {
            setApartmentsOpen(false);
            setOpen(!open);
          }}
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
        {/* Links — all direct children so stagger animation is uniform */}
        <div ref={linksRef} className="flex flex-col items-center justify-center h-full gap-8 text-white">
          <a href="#" className="text-4xl sm:text-6xl font-light hover:opacity-60 transition-opacity font-[family-name:var(--font-melodrama)] cursor-pointer">
            Home
          </a>
          <button
            onClick={() => setApartmentsOpen(!apartmentsOpen)}
            className="text-4xl sm:text-6xl font-light hover:opacity-60 transition-opacity font-[family-name:var(--font-melodrama)] cursor-pointer flex items-center gap-3"
          >
            Apartments
            <svg
              className={`w-5 h-5 sm:w-7 sm:h-7 transition-transform duration-300 ${apartmentsOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* Circles — in flow between Apartments and Gallery, filtered out of link stagger */}
          <div
            ref={circlesRef}
            className="flex gap-5"
          >
            {apartments.map((apt, i) => (
              <button
                key={apt.src}
                onClick={() => handleApartmentClick(i)}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden cursor-pointer ring-1 ring-white/30 hover:ring-2 hover:ring-white hover:scale-110 transition-[box-shadow] duration-300"
              >
                <Image
                  src={apt.src}
                  alt={apt.label}
                  fill
                  className="object-cover"
                  sizes="80px"
                  quality={90}
                />
              </button>
            ))}
          </div>
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
