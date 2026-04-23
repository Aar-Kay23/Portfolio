import { useState, useEffect, useCallback, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Menu, X, Zap, ZapOff } from "lucide-react";
import { createRipple, removeRipple } from "@/lib/ripple";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [lowGPU, setLowGPU] = useState(() => {
    try { return localStorage.getItem("lowGPU") === "true"; } catch { return false; }
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", "about", "skills", "experience", "projects", "education", "contact"];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (!indicatorRef.current || !navRef.current) return;
    const link = navRef.current.querySelector(`a[href="#${activeSection}"]`) as HTMLElement;
    if (link && activeSection !== "hero") {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      gsap.to(indicatorRef.current, {
        x: linkRect.left - navRect.left + linkRect.width / 2 - 8,
        width: 16, autoAlpha: 1, duration: 0.4, ease: "power3.out",
      });
    } else {
      gsap.to(indicatorRef.current, { autoAlpha: 0, duration: 0.3 });
    }
  }, [activeSection]);

  const toggleLowGPU = useCallback(() => {
    const next = !lowGPU;
    setLowGPU(next);
    try { localStorage.setItem("lowGPU", String(next)); window.dispatchEvent(new Event("lowgpu-toggle")); } catch {}
  }, [lowGPU]);

  useGSAP(() => {
    gsap.from(".nav-inner", { y: -20, autoAlpha: 0, duration: 0.8, delay: 0.2 });

    // ── Scroll compression micro-interaction ──────────────
    const nav = navRef.current;
    if (!nav) return;
    let scrollTimer: ReturnType<typeof setTimeout>;

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: () => {
        gsap.to(nav, { scaleY: 0.96, duration: 0.3, overwrite: true });
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          gsap.to(nav, { scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.5)", overwrite: true });
        }, 150);
      },
    });
  }, { scope: navRef });

  return (
    <nav ref={navRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-2xl bg-[rgba(10,8,5,0.7)] border-b border-[rgba(201,168,76,0.06)] shadow-2xl shadow-[rgba(10,8,5,0.5)]"
          : "bg-transparent"
      }`}>
      <div className="nav-inner max-w-6xl mx-auto px-5 h-14 flex items-center justify-between relative">
        <a href="#hero" className="font-display font-bold text-foreground text-lg group flex items-center gap-0.5 magnetic-target" data-magnetic="true">
          <span className="text-[#C9A84C]">R</span>
          <span className="group-hover:text-[#C9A84C] transition-colors">K</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        <div className="hidden md:flex items-center gap-0.5 relative">
          <div ref={indicatorRef} className="absolute bottom-0 h-[2px] rounded-full bg-[#C9A84C]" style={{ visibility: "hidden" }} />
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a key={item.href} href={item.href} data-magnetic="true"
                className={`relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all will-change-transform ${
                  isActive ? "text-[#C9A84C]" : "text-muted-foreground hover:text-foreground"
                }`}
                onMouseEnter={(e) => createRipple(e, e.currentTarget)}
                onMouseLeave={(e) => removeRipple(e.currentTarget.querySelector('.ripple-drop'))}>
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
          <button onClick={toggleLowGPU} data-magnetic="true"
            className={`ml-3 p-2 rounded-lg text-xs transition-all ${lowGPU ? "text-[#C9A84C] bg-[rgba(201,168,76,0.1)]" : "text-muted-foreground hover:text-foreground"}`}
            aria-label={lowGPU ? "Enable 3D effects" : "Low GPU mode"}>
            {lowGPU ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleLowGPU} className={`p-2 rounded-lg ${lowGPU ? "text-[#C9A84C]" : "text-muted-foreground"}`}>
            {lowGPU ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} aria-label={open ? "Close" : "Open"} className="text-foreground p-1" data-magnetic="true">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[rgba(10,8,5,0.95)] backdrop-blur-2xl border-b border-[rgba(201,168,76,0.06)]">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a key={item.href} href={item.href}
                  className={`relative overflow-hidden block px-4 py-2.5 rounded-xl text-sm font-body font-medium ${isActive ? "text-[#C9A84C] bg-[rgba(201,168,76,0.06)]" : "text-muted-foreground hover:text-[#C9A84C]"}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={(e) => createRipple(e, e.currentTarget)}
                  onMouseLeave={(e) => removeRipple(e.currentTarget.querySelector('.ripple-drop'))}>
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
