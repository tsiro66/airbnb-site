"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookingBar from "./BookingBar";

gsap.registerPlugin(ScrollTrigger);

const apartments = [
  { src: "/demo-img-1.jpg", label: "Apartment 1" },
  { src: "/demo-img-2.jpg", label: "Apartment 2" },
  { src: "/demo-img-3.jpg", label: "Apartment 3" },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const circlesRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const titleWrap = titleWrapRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const bar = barRef.current;
    const image = imageRef.current;
    if (!section || !sticky || !titleWrap || !title || !subtitle || !bar || !image) return;

    // Calculate offset to center the h1 text in viewport (not the wrapper)
    const titleRect = title.getBoundingClientRect();
    const titleCenter = titleRect.top + titleRect.height / 2;
    const safeVh = window.visualViewport?.height ?? window.innerHeight;
    const viewportCenter = safeVh / 2;
    const yOffset = viewportCenter - titleCenter;

    const circles = circlesRef.current;

    // Hide everything except title initially
    gsap.set([subtitle], { autoAlpha: 0, y: 10 });
    if (circles) gsap.set(circles, { autoAlpha: 0, y: 10 });
    gsap.set(bar, { autoAlpha: 0, y: 20 });
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

    // Fade in booking bar with slide up
    intro.to(
      bar,
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
        const startW = mobile ? vw * 0.3 : vw * 0.12;
        const startH = mobile ? vh * 0.3 : vh * 0.4;
        const startBottom = mobile ? 50 : 120;

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
    <section ref={sectionRef} className="relative h-[200dvh]">
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] flex flex-col items-center overflow-hidden">
        <div ref={titleWrapRef} className="flex flex-col items-center justify-center pt-20 md:pt-44 text-center px-6">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-7xl font-[family-name:var(--font-melodrama)]"
          >
            Bill Apartments Patra
          </h1>
          <p ref={subtitleRef} className="mt-2 md:mt-4 mb-2 md:mb-0 text-xs md:text-lg text-stone-600">
            Select you apartment and book your stay in the heart of Patras
          </p>
        </div>

        {/* Apartment circles */}
        <div ref={circlesRef} className="flex gap-4 mt-4 md:mt-6">
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

        <div ref={barRef} className="w-full flex justify-center">
          <BookingBar />
        </div>

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
