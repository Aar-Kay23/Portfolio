import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const WORDS = ["RAJ", "KHANDELWAL", "ENGINEER", "VISION", "AI"];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ onComplete });

      // 1. Counter 0 → 100
      const counterObj = { value: 0 };
      tl.to(counterObj, {
        value: 100, duration: 2.8, ease: "power2.inOut", roundProps: "value",
        onUpdate: () => {
          if (counterRef.current) counterRef.current.textContent = String(Math.round(counterObj.value));
        },
      });

      // 2. Flicker words
      const wordEls = containerRef.current!.querySelectorAll(".preloader-word");
      wordEls.forEach((word, i) => {
        const delay = 0.3 + i * 0.5;
        tl.fromTo(word, { autoAlpha: 0, y: 20, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }, delay)
          .to(word, { autoAlpha: 0, y: -15, filter: "blur(4px)", duration: 0.3 }, delay + 0.35);
      });

      // 3. Clip-path wipe reveal
      tl.to(".preloader-panel", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.inOut" }, "+=0.2");
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <div className="preloader-panel fixed inset-0 z-[100] bg-[#0A0805] flex items-center justify-center" style={{ clipPath: "inset(0 0 0 0)" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {WORDS.map((word) => (
            <span key={word} className="preloader-word absolute text-5xl sm:text-7xl md:text-8xl font-display font-extrabold text-[rgba(240,235,225,0.06)] select-none invisible" style={{ opacity: 0 }}>
              {word}
            </span>
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span ref={counterRef} className="text-7xl sm:text-8xl md:text-9xl font-display font-extrabold text-gradient-teal tabular-nums">0</span>
            <span className="text-2xl md:text-3xl font-display font-bold text-[rgba(201,168,76,0.3)]">%</span>
          </div>
          <div className="w-48 h-[1px] bg-[rgba(201,168,76,0.1)] mt-6 relative overflow-hidden">
            <div className="preloader-progress absolute inset-y-0 left-0 bg-[rgba(201,168,76,0.5)]" style={{ width: "0%" }} />
          </div>
        </div>
        <span className="absolute bottom-6 left-6 text-[10px] font-mono text-[rgba(138,127,110,0.3)] tracking-widest uppercase">
          Loading experience
        </span>
      </div>
    </div>
  );
}
