import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

const SECTION_COLORS: Record<string, string> = {
  about: "#C9A84C",
  skills: "#A88B35",
  experience: "#C9A84C",
  projects: "#D4B96A",
  education: "#C9A84C",
  activities: "#A88B35",
  contact: "#C9A84C",
};

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor || !overlayRef.current) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const sectionId = href.replace("#", "");
      const section = document.getElementById(sectionId);
      if (!section) return;

      e.preventDefault();
      const color = SECTION_COLORS[sectionId] || "#C9A84C";
      const overlay = overlayRef.current;
      overlay.style.backgroundColor = color;

      const tl = gsap.timeline();
      tl.set(overlay, { clipPath: "inset(100% 0 0 0)", visibility: "visible" })
        .to(overlay, { clipPath: "inset(0 0 0 0)", duration: 0.5, ease: "power4.inOut" })
        .add(() => { section.scrollIntoView({ behavior: "instant" as ScrollBehavior }); })
        .to(overlay, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "power4.inOut", delay: 0.1 })
        .set(overlay, { visibility: "hidden" });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] pointer-events-none invisible"
      style={{ clipPath: "inset(100% 0 0 0)" }}
    />
  );
}
