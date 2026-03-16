import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ZapOff } from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
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

  // Track active section with IntersectionObserver
  useEffect(() => {
    const sectionIds = ["hero", "about", "skills", "experience", "projects", "education", "contact"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            // Deep-link hash update
            if (id !== "hero") {
              window.history.replaceState(null, "", `#${id}`);
            } else {
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const toggleLowGPU = useCallback(() => {
    const next = !lowGPU;
    setLowGPU(next);
    try {
      localStorage.setItem("lowGPU", String(next));
      window.dispatchEvent(new Event("lowgpu-toggle"));
    } catch {}
  }, [lowGPU]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-background/60 border-b border-border/20 shadow-lg shadow-background/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-11 flex items-center justify-between">
        <a href="#hero" className="font-display font-bold text-foreground text-base group">
          R<span className="text-primary group-hover:drop-shadow-[0_0_6px_hsl(168_100%_37%/0.6)] transition-all">K</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1 rounded-md text-[11px] font-body transition-all relative ${
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] rounded-full bg-primary"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </a>
            );
          })}

          {/* Low GPU toggle */}
          <button
            onClick={toggleLowGPU}
            className={`ml-3 p-1.5 rounded-md text-xs transition-all ${
              lowGPU ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
            aria-label={lowGPU ? "Enable 3D effects" : "Disable 3D effects for performance"}
            title={lowGPU ? "Enable 3D" : "Low GPU mode"}
          >
            {lowGPU ? <ZapOff className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLowGPU}
            className={`p-1.5 rounded-md ${lowGPU ? "text-accent" : "text-muted-foreground"}`}
            aria-label={lowGPU ? "Enable 3D" : "Low GPU mode"}
          >
            {lowGPU ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="text-foreground"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                      isActive ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
