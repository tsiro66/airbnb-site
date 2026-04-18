"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookingBar from "./BookingBar";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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
    const viewportCenter = window.innerHeight / 2;
    const yOffset = viewportCenter - titleCenter;

    // Hide everything except title initially
    gsap.set([subtitle], { opacity: 0, filter: "blur(10px)" });
    gsap.set(bar, { opacity: 0, filter: "blur(10px)", y: 20 });
    gsap.set(image, { opacity: 0, filter: "blur(10px)" });
    gsap.set(titleWrap, { y: yOffset });

    // Intro timeline
    const intro = gsap.timeline({ delay: 0.5 });

    // Move title from center to natural position
    intro.to(titleWrap, {
      y: 0,
      duration: 1.2,
      ease: "power3.inOut",
    });

    // Blur in subtitle
    intro.to(
      subtitle,
      { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );

    // Blur in booking bar with slide up
    intro.to(
      bar,
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          // Re-add backdrop blur after intro filter animation is done
          bar.querySelector(":first-child")?.classList.add("backdrop-blur-sm");
        },
      },
      "-=0.4"
    );

    // Blur in image
    intro.to(
      image,
      { opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" },
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

        gsap.set(image, {
          width: mobile ? "30%" : "12%",
          height: mobile ? "30vh" : "40vh",
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          bottom: mobile ? 80 : 120,
        });

        gsap.to(image, {
          width: "100%",
          height: "100vh",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          bottom: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div ref={stickyRef} className="sticky top-0 h-screen flex flex-col items-center overflow-hidden">
        <div ref={titleWrapRef} className="flex flex-col items-center justify-center pt-28 md:pt-44 text-center px-6">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-7xl font-[family-name:var(--font-melodrama)]"
          >
            Bill Apartments Patra
          </h1>
          <p ref={subtitleRef} className="mt-3 md:mt-4 text-base md:text-lg text-stone-600">
            Your perfect stay in the heart of Patra
          </p>
        </div>

        <div ref={barRef} className="w-full flex justify-center">
          <BookingBar />
        </div>

        <div ref={imageRef} className="absolute overflow-hidden">
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
