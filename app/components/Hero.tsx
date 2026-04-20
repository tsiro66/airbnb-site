"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { apartments } from "../data/apartments";
gsap.registerPlugin(ScrollTrigger);

// Survives client-side navigation, resets on full page reload
export let heroIntroPlayed = false;
export function markHeroIntroPlayed() { heroIntroPlayed = true; }

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("select-apartment");
      if (stored !== null) {
        sessionStorage.removeItem("select-apartment");
        return Number(stored);
      }
    }
    return 0;
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const circlesRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  // Listen for apartment selection from navbar
  useEffect(() => {
    const handler = (e: Event) => {
      const index = (e as CustomEvent<number>).detail;
      setActiveIndex(index);
    };
    window.addEventListener("select-apartment", handler);
    return () => window.removeEventListener("select-apartment", handler);
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const titleWrap = titleWrapRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const btn = btnRef.current;
    const image = imageRef.current;
    if (!section || !sticky || !titleWrap || !title || !subtitle || !btn || !image) return;

    const circles = circlesRef.current;
    if (!heroIntroPlayed) {
      // Mark immediately so navigating away mid-animation won't replay it
      markHeroIntroPlayed();

      // Calculate offset to center the h1 text in viewport (not the wrapper)
      const titleRect = title.getBoundingClientRect();
      const titleCenter = titleRect.top + titleRect.height / 2;
      const safeVh = window.visualViewport?.height ?? window.innerHeight;
      const viewportCenter = safeVh / 2;
      const yOffset = viewportCenter - titleCenter;

      // Hide everything except title initially
      gsap.set([subtitle], { autoAlpha: 0, y: 10 });
      if (circles) gsap.set(circles, { autoAlpha: 0, y: 10 });
      gsap.set(btn, { autoAlpha: 0, y: 20 });
      gsap.set(image, { autoAlpha: 0 });
      gsap.set(titleWrap, { y: yOffset });

      // Intro timeline
      const intro = gsap.timeline({ delay: 0.5 });

      // Move title from center to natural position
      intro.to(titleWrap, {
        y: 0,
        duration: 1.2,
        ease: "power3.inOut",
      });

      // Fade in subtitle
      intro.to(
        subtitle,
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      );

      // Fade in circles
      if (circles) {
        intro.to(
          circles,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );
      }

      // Fade in book button with slide up
      intro.to(
        btn,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // Fade in image
      intro.to(
        image,
        { autoAlpha: 1, duration: 1, ease: "power2.out" },
        "-=0.6"
      );
    }

    // Scroll-driven image expansion
    const mm = gsap.matchMedia();

    mm.add(
      {
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
      },
      (context) => {
        const { mobile } = context.conditions!;

        const vw = window.visualViewport?.width ?? window.innerWidth;
        const vh = window.visualViewport?.height ?? window.innerHeight;

        // Measure circles bottom to calculate even gap
        const circlesBottom = circles
          ? circles.getBoundingClientRect().bottom
          : titleWrap.getBoundingClientRect().bottom;
        const gap = mobile ? 20 : 32;
        const btnHeight = mobile ? 44 : 64;
        const btnGap = mobile ? 50 : 40;
        const imageTop = circlesBottom + gap;
        const availableH = vh - imageTop - btnGap - btnHeight - btnGap;
        const startH = Math.max(availableH, 80);
        const startW = mobile ? vw * 0.4 : vw * 0.12;
        // Position from top: convert to bottom value
        const startBottom = vh - imageTop - startH;

        gsap.set(image, {
          width: startW,
          height: startH,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          bottom: startBottom,
          left: "50%",
          xPercent: -50,
        });

        const vignette = vignetteRef.current;

        gsap.to(image, {
          width: vw,
          height: vh,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          borderColor: "rgba(255,255,255,0.05)",
          bottom: 0,
          xPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: false,
          },
        });

        if (vignette) {
          gsap.to(vignette, {
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          });
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative h-[200svh]">
      <div ref={stickyRef} className="sticky top-0 h-[100svh] flex flex-col items-center overflow-hidden">
        <div ref={titleWrapRef} className="flex flex-col items-center justify-center pt-40 text-center px-6">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-7xl font-[family-name:var(--font-melodrama)]"
          >
            Bill Apartments Patra
          </h1>
          <p ref={subtitleRef} className="mt-3 md:mt-5 text-xs md:text-lg text-stone-600">
            Select you apartment and book your stay in the heart of Patras
          </p>
        </div>

        {/* Apartment circles */}
        <div ref={circlesRef} className="flex gap-4 mt-5 md:mt-8">
          {apartments.map((apt, i) => (
            <button
              key={apt.src}
              onClick={() => setActiveIndex(i)}
              className={`relative w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
                i === activeIndex
                  ? "ring-2 ring-stone-800 scale-110"
                  : "ring-1 ring-stone-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={apt.src}
                alt={apt.label}
                fill
                className="object-cover"
                sizes="96px"
                quality={90}
              />
            </button>
          ))}
        </div>

        <Link
          ref={btnRef as React.RefObject<HTMLAnchorElement>}
          href={`/book?apt=${activeIndex}`}
          className="absolute bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black text-white px-8 py-3 text-sm md:px-12 md:py-4 md:text-base font-semibold tracking-wide hover:bg-stone-800 transition-colors cursor-pointer shadow-lg"
        >
          Book
        </Link>

        <div ref={imageRef} className="absolute overflow-hidden border border-white/20">
          {apartments.map((apt, i) => (
            <Image
              key={apt.src}
              src={apt.src}
              alt={apt.label}
              fill
              className={`object-cover transition-opacity duration-700 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              sizes="100vw"
              priority={i === 0}
            />
          ))}
          <div ref={vignetteRef} className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.45)] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
