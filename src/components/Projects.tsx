import { useRef, useState, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "./TextReveal";
import { Github, X, Lightbulb, Wrench, TrendingUp } from "lucide-react";
import { createRipple, removeRipple } from "@/lib/ripple";

const projects = [
  {
    id: "ai-debate-arena",
    title: "AI Debate Arena",
    subtitle: "Real-Time Multi-Agent Debate Platform",
    tech: ["FastAPI", "React", "TypeScript", "LangGraph", "LangChain", "Groq", "Redis", "PostgreSQL"],
    problem: "No platform enabled AI agents to conduct structured, research-backed debates with live audience engagement.",
    solution: "Built a real-time event-driven debate platform using FastAPI and Redis Pub/Sub with sub-second sync. Engineered an agentic workflow with LangGraph orchestrating a 5-phase debate system with RAG-based reasoning.",
    impact: "Sub-100ms message latency, concurrent sessions with live analytics and fact-grounded responses.",
    github: "https://github.com/rajkhandelwal23",
    meshGradient: "radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,69,19,0.06) 0%, transparent 50%)",
  },
  {
    id: "cv-analyser",
    title: "CV-Analyser",
    subtitle: "ML-Powered Resume Classification",
    tech: ["Python", "TF-IDF", "Naive Bayes", "Scikit-learn", "NLP"],
    problem: "Manual resume screening across diverse job domains is inconsistent and cannot scale.",
    solution: "Developed an ML classification system trained on 1,000+ labeled resumes across 20 job domains using TF-IDF and Multinomial Naive Bayes.",
    impact: "97% test accuracy — automated candidate filtering at enterprise scale.",
    github: "https://github.com/rajkhandelwal23",
    meshGradient: "radial-gradient(ellipse at 70% 70%, rgba(168,139,53,0.07) 0%, transparent 50%), radial-gradient(ellipse at 30% 30%, rgba(201,168,76,0.05) 0%, transparent 50%)",
  },
  {
    id: "chessbot-vision",
    title: "ChessBot Vision",
    subtitle: "Computer Vision Chess Assistant",
    tech: ["Python", "TensorFlow", "MobileNetV2", "OpenCV", "Stockfish", "PyQt5"],
    problem: "No accessible tool to analyze physical chessboard states from images and suggest optimal moves.",
    solution: "Built a CV chess assistant trained on 2,400+ labeled images using MobileNetV2 to detect board states, generate FEN notation, and compute optimal moves via Stockfish.",
    impact: "95%+ piece recognition accuracy with real-time optimal move suggestions.",
    github: "https://github.com/rajkhandelwal23",
    meshGradient: "radial-gradient(ellipse at 50% 90%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 10%, rgba(139,69,19,0.04) 0%, transparent 50%)",
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const rippleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      gsap.set(track, { x: 0, force3D: true });

      const horizontalScroll = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          pinSpacing: true,
          onRefresh(self) {
            const ext = self as unknown as { spacer?: HTMLElement, pinSpacer?: HTMLElement };
            const spacer = ext.spacer || ext.pinSpacer;
            if (spacer) {
              spacer.style.backgroundColor = '#0A0805';
              spacer.style.pointerEvents = 'none';
            }
          },
          onEnter: () => gsap.set(track, { x: 0 }),
          onEnterBack: () => {
            gsap.set(track, { x: -(track.scrollWidth - window.innerWidth) });
          },
        }
      });

      gsap.fromTo(
        track.querySelectorAll(".project-card"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          }
        }
      );

      setTimeout(() => ScrollTrigger.refresh(), 200);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // ── 3D tilt with specular highlight & dynamic shadow ──
  const rectCache = useRef(new WeakMap<HTMLElement, DOMRect>());

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    rectCache.current.set(e.currentTarget, e.currentTarget.getBoundingClientRect());
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    let rect = rectCache.current.get(card);
    if (!rect) {
      rect = card.getBoundingClientRect();
      rectCache.current.set(card, rect);
    }
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.willChange = "transform";
    gsap.to(card, {
      rotateY: x * 18,
      rotateX: -y * 12,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 1000,
    });

    const highlight = card.querySelector(".specular-highlight") as HTMLElement;
    if (highlight) {
      const hx = 50 - x * 60;
      const hy = 50 - y * 60;
      highlight.style.background = `radial-gradient(circle at ${hx}% ${hy}%, rgba(255,255,255,0.06) 0%, transparent 60%)`;
    }
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    rectCache.current.delete(card);
    gsap.to(card, {
      rotateY: 0, rotateX: 0,
      duration: 0.6, ease: "elastic.out(1, 0.4)",
    });
    card.style.willChange = "auto";
    const highlight = card.querySelector(".specular-highlight") as HTMLElement;
    if (highlight) highlight.style.background = "transparent";
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveProject(null); };
    if (activeProject !== null) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [activeProject]);

  return (
    <>
      <style>{`
        #education {
          margin-top: 0 !important;
          position: relative !important;
          z-index: 1 !important;
          background: #0A0805 !important;
        }
        .gsap-pin-spacer {
          background-color: #0A0805 !important;
          z-index: 2 !important;
        }
      `}</style>

      <div style={{ backgroundColor: '#0A0805', position: 'relative', zIndex: 2, isolation: 'isolate' }}>
        {/* Heading lives OUTSIDE the pinned section — scrolls normally */}
        <div
          style={{
            backgroundColor: '#0A0805',
            padding: '120px 20px 60px',
            textAlign: 'center',
          }}
        >
          <RevealText as="h2" className="section-heading">
            Featured <span className="text-gradient-teal">Projects</span>
          </RevealText>
          <RevealText className="section-subheading" delay={0.1}>
            End-to-end solutions with real-world impact — scroll to explore
          </RevealText>
        </div>

        {/* This is the ONLY pinned element — pure 100vh, no heading inside */}
        <section
          id="projects"
          ref={containerRef}
          className="relative overflow-hidden"
          style={{
            backgroundColor: '#0A0805',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            height: '100vh',
            margin: 0,
            padding: 0,
            zIndex: 2,
            isolation: 'isolate',
            contain: 'paint',
          }}
        >
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 px-[10vw]"
          style={{
            width: 'fit-content',
            height: '100%',
            alignItems: 'center',
            backgroundColor: '#0A0805',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {projects.map((project, i) => (
            <div key={project.id}
              className="project-card w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] shrink-0 cursor-pointer group relative overflow-hidden rounded-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-shadow duration-500"
              style={{
                transformStyle: "preserve-3d",
                background: project.meshGradient,
                border: "1px solid rgba(201,168,76,0.06)",
                backgroundColor: "#0A0805",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              onClick={() => setActiveProject(i)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setActiveProject(i); }}
            >
              {/* Specular highlight overlay */}
              <div className="specular-highlight absolute inset-0 pointer-events-none rounded-2xl transition-none" />

              <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
                <span className="text-[10px] font-mono text-[#C9A84C]/30 mb-6 tracking-widest">0{i + 1} /</span>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1 group-hover:text-[#C9A84C] transition-colors duration-500">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground/50 mb-6 font-mono">{project.subtitle}</p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">{project.problem}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-[rgba(201,168,76,0.08)] text-muted-foreground/60">{t}</span>
                  ))}
                </div>

                {/* Fix 1: Ripple on code button */}
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(201,168,76,0.06)]">
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="ripple-btn relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(201,168,76,0.1)] text-[10px] font-medium text-foreground/70 hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => { rippleRef.current = createRipple(e, e.currentTarget); }}
                    onMouseLeave={() => { removeRipple(rippleRef.current); rippleRef.current = null; }}>
                    <span className="relative z-10 flex items-center gap-1.5"><Github className="w-3 h-3" /> Code</span>
                  </a>
                  <span className="text-[10px] text-muted-foreground/30 flex items-center gap-1 ml-auto group-hover:gap-2 transition-all">
                    Explore <span className="text-[#C9A84C]/50">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Modal ──────────────────────────────────────────── */}
        {activeProject !== null && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={() => setActiveProject(null)}>
            <div className="absolute inset-0 bg-[#0A0805]/90 backdrop-blur-2xl" />
            <div className="glass-card p-6 md:p-8 max-w-2xl w-full relative z-10 border-[rgba(201,168,76,0.1)] max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg"
                onClick={() => setActiveProject(null)} aria-label="Close" autoFocus>
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-mono text-[#C9A84C]/30 tracking-widest">PROJECT 0{activeProject + 1}</span>
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mt-1 mb-5">{projects[activeProject].title}</h3>

              <div className="space-y-5 mb-6">
                {[
                  { icon: Lightbulb, label: "Problem", text: projects[activeProject].problem, color: "text-amber-400", bg: "bg-amber-500/10" },
                  { icon: Wrench, label: "Solution", text: projects[activeProject].solution, color: "text-[#C9A84C]", bg: "bg-[rgba(201,168,76,0.1)]" },
                  { icon: TrendingUp, label: "Impact", text: projects[activeProject].impact, color: "text-amber-300", bg: "bg-amber-500/10" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-display font-bold text-foreground uppercase tracking-wider mb-1">{item.label}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {projects[activeProject].tech.map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-1 rounded-full border border-[rgba(201,168,76,0.15)] text-[#C9A84C]/70 font-medium">{t}</span>
                ))}
              </div>

              {/* Fix 1: Ripple on modal GitHub button */}
              <a href={projects[activeProject].github} target="_blank" rel="noopener noreferrer"
                className="ripple-btn relative overflow-hidden inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C9A84C] text-[#0A0805] font-display font-semibold text-sm hover:shadow-[0_0_40px_rgba(201,168,76,0.3)] active:scale-[0.96] transition-all"
                onMouseEnter={(e) => { rippleRef.current = createRipple(e, e.currentTarget, { filled: true }); }}
                onMouseLeave={() => { removeRipple(rippleRef.current); rippleRef.current = null; }}>
                <span className="relative z-10 flex items-center gap-2"><Github className="w-4 h-4" /> View on GitHub</span>
              </a>
            </div>
          </div>
        )}
      </section>
      </div>
    </>
  );
}
