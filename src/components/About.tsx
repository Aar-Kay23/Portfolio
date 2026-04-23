import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "./TextReveal";
import { Code, Cpu, Rocket } from "lucide-react";

const highlights = [
  { icon: Code, label: "Production AI", value: "Real-time video analytics & LLM systems" },
  { icon: Cpu, label: "ML & CV", value: "YOLO, PyTorch, TensorFlow, OpenCV" },
  { icon: Rocket, label: "Backend", value: "FastAPI, event-driven microservices" },
];

const countUpStats = [
  { value: 1, suffix: "+", label: "Year Experience" },
  { value: 15, suffix: "+", label: "ETL Pipelines" },
  { value: 97, suffix: "%", label: "ML Accuracy" },
  { value: 10, suffix: "K+", label: "Daily Events" },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-text", {
        y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.15,
        scrollTrigger: { trigger: ".about-texts", start: "top 85%", toggleActions: "play none none none", once: true },
      });

      gsap.from(".about-card", {
        y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.6,
        scrollTrigger: { trigger: ".about-cards", start: "top 85%", toggleActions: "play none none none", once: true },
      });

      // ── Change 3: CountUp stats on scroll ─────────────────
      containerRef.current!.querySelectorAll<HTMLElement>(".count-up-stat").forEach((el) => {
        const target = parseFloat(el.dataset.target || "0");
        const obj = { value: 0 };
        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: "elastic.out(1, 0.5)",
          roundProps: "value",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
          onUpdate: () => {
            const numEl = el.querySelector(".count-num");
            if (numEl) numEl.textContent = String(Math.round(obj.value));
          },
        });
      });

      // ── Change 4: Scroll depth — sections start at scale(0.97) ──
      gsap.from(containerRef.current!, {
        scale: 0.97,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current!, start: "top 90%", toggleActions: "play none none none", once: true },
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="about" className="section-padding relative" ref={containerRef}>
      {/* ── Decorative diagonal line (Change 3) ──────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <line x1="80%" y1="0%" x2="20%" y2="100%" stroke="rgba(201,168,76,0.03)" strokeWidth="1" />
      </svg>

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-14">
          <RevealText as="h2" className="section-heading">
            About <span className="text-gradient-teal">Me</span>
          </RevealText>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* ── Bio text ────────────────────────────────────── */}
          <div className="md:col-span-3 about-texts space-y-4">
            <p className="about-text text-sm md:text-base text-muted-foreground leading-relaxed">
              I'm a <span className="text-foreground font-medium">Software Engineer</span> with a B.Tech in Computer Engineering
              from J.C. Bose University. I specialize in building{" "}
              <span className="text-[#C9A84C] font-medium">production-grade AI systems</span>,
              real-time computer vision pipelines, and scalable backend architectures.
            </p>
            <p className="about-text text-sm md:text-base text-muted-foreground leading-relaxed">
              Currently at <span className="text-foreground font-medium">Prismberry Technologies</span>, I architect real-time
              video analytics platforms processing multi-camera RTSP streams, design event-driven pipelines handling
              10,000+ daily detection events, and build agentic LLM workflows that automate insights.
            </p>
            <p className="about-text text-sm md:text-base text-muted-foreground leading-relaxed">
              I'm driven by making machines understand the world — through
              real-time video streams, multi-agent debate systems, or ML pipelines
              classifying thousands of documents with 97% accuracy.
            </p>

            {/* ── Highlight cards ───────────────────────────── */}
            <div className="about-cards space-y-3 mt-6">
              {highlights.map((h) => (
                <div key={h.label} className="about-card glass-card p-4 flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.06)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(201,168,76,0.12)] transition-colors">
                    <h.icon className="w-5 h-5 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-semibold text-foreground">{h.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{h.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: CountUp stats (Change 3) ─────── */}
          <div className="md:col-span-2 space-y-6 md:pl-4">
            {countUpStats.map((stat) => (
              <div key={stat.label}
                className="count-up-stat glass-card p-5 text-center group hover:border-[rgba(201,168,76,0.15)] transition-all"
                data-target={stat.value}
                style={{ transform: "rotateY(4deg)", transformStyle: "preserve-3d", transition: "transform 0.4s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotateY(0deg)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotateY(4deg)"; }}
              >
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="count-num text-3xl md:text-4xl font-display font-bold text-[#C9A84C]">0</span>
                  <span className="text-lg md:text-xl font-display font-bold text-[#C9A84C]/60">{stat.suffix}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-2 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
