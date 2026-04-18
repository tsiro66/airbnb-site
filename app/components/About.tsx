"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const els = [titleRef.current, textRef.current, mapRef.current].filter(Boolean);

    gsap.from(els, {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#faf4dd] px-6 md:px-16 lg:px-32 py-24 md:py-36">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        <div className="flex flex-col gap-6">
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-melodrama)] leading-tight"
          >
            A place to call home in Patra
          </h2>
          <div ref={textRef} className="flex flex-col gap-6">
            <p className="text-base md:text-lg text-stone-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </div>

        <div ref={mapRef} className="w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25090.732279498882!2d21.7234!3d38.2466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135e4b6b4b4b4b4b%3A0x400bd2ce2b980e0!2sPatra%2C%20Greece!5e0!3m2!1sen!2sgr!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location map"
          />
        </div>
      </div>
    </section>
  );
}
