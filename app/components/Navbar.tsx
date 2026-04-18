"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar — always visible, z-50 so it's above the curtain */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 mix-blend-difference">
        <span className="text-xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-satoshi)] text-white">
          Bill Apartments
        </span>
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-2 relative z-50 cursor-pointer"
        >
          <span
            className={`block w-10 h-0.5 bg-white transition-transform duration-500 ease-in-out origin-center ${
              open ? "rotate-45 translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block w-10 h-0.5 bg-white transition-transform duration-500 ease-in-out origin-center ${
              open ? "-rotate-45 -translate-y-[4px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Curtain overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-transform duration-700 ease-in-out origin-top ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-white">
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
