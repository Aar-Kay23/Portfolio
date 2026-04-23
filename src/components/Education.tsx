import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "./TextReveal";
import { GraduationCap, Award, BookOpen } from "lucide-react";

const education = [
  {
    institution: "J.C. Bose University of Science and Technology, Faridabad",
    degree: "B.Tech in Computer Engineering",
    score: "8.08 / 10 CGPA",
    period: "2021 – 2025",
    icon: GraduationCap,
    highlights: ["Computer Vision & AI", "DSA", "Database Systems"],
  },
  {
    institution: "DAV Public School, Sahibabad",
    degree: "Class 12 — CBSE Board",
    score: "98%",
    period: "2020 – 2021",
    icon: Award,
    highlights: ["Science Stream", "Mathematics & CS"],
  },
];

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".edu-timeline-line-fill", {
        scaleY: 0, transformOrigin: "top center", ease: "none",
        scrollTrigger: { trigger: ".edu-timeline", start: "top 80%", end: "bottom 70%", scrub: 1 },
      });
      gsap.utils.toArray<HTMLElement>(".edu-card").forEach((card) => {
        gsap.from(card, {
          x: -40, autoAlpha: 0, duration: 0.7,
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none", once: true },
        });
      });
      gsap.from(containerRef.current!, {
        scale: 0.97, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current!, start: "top 90%", toggleActions: "play none none none", once: true },
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="education" className="section-padding" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <RevealText as="h2" className="section-heading">
            <span className="text-gradient-teal">Education</span>
          </RevealText>
        </div>

        <div className="edu-timeline relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-[rgba(201,168,76,0.04)]">
            <div className="edu-timeline-line-fill absolute inset-0 pointer-events-none bg-gradient-to-b from-[rgba(201,168,76,0.4)] via-[rgba(201,168,76,0.15)] to-transparent" />
          </div>

          <div className="space-y-6">
            {education.map((edu, i) => (
              <div key={i} className="edu-card relative pl-16 md:pl-20">
                <div className="absolute left-[14px] md:left-[22px] top-6 w-5 h-5 rounded-full border-[3px] border-[#C9A84C] bg-background z-10">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="glass-card p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.06)] flex items-center justify-center shrink-0">
                      <edu.icon className="w-5 h-5 text-[#C9A84C]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-display font-bold text-foreground">{edu.institution}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{edu.degree}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#C9A84C] bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.1)]">{edu.score}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono"><BookOpen className="w-3 h-3" /> {edu.period}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {edu.highlights.map((h) => (
                          <span key={h} className="text-[10px] px-2 py-0.5 rounded-full border border-[rgba(201,168,76,0.08)] text-muted-foreground/50">{h}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
