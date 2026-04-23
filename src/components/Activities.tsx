import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "./TextReveal";
import { Gamepad2, Search, BookOpen } from "lucide-react";

const activities = [
  { icon: BookOpen, title: "AI & Security Workshops", description: "Participated in workshops on AI, Cryptography, and Cybersecurity — deepening understanding of cutting-edge technology." },
  { icon: Search, title: "Emerging Tech Explorer", description: "Actively explore emerging technologies in data engineering, automation, and AI systems." },
  { icon: Gamepad2, title: "Strategic Thinking", description: "Passionate about strategic gaming and technology research, applying systems thinking to engineering challenges." },
];

export default function Activities() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".act-card", {
        y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.6,
        scrollTrigger: { trigger: ".act-grid", start: "top 88%", toggleActions: "play none none none", once: true },
      });
      gsap.from(containerRef.current!, {
        scale: 0.97, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current!, start: "top 90%", toggleActions: "play none none none", once: true },
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="activities" className="section-padding" ref={containerRef}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <RevealText as="h2" className="section-heading">
            Beyond <span className="text-gradient-teal">Code</span>
          </RevealText>
        </div>
        <div className="act-grid grid gap-4 md:grid-cols-3">
          {activities.map((act) => (
            <div key={act.title} className="act-card glass-card p-5 group">
              <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.06)] flex items-center justify-center mb-4 group-hover:bg-[rgba(201,168,76,0.12)] transition-colors">
                <act.icon className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h3 className="text-sm font-display font-bold text-foreground mb-2">{act.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
