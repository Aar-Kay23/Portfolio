import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "./TextReveal";
import { createRipple, removeRipple } from "@/lib/ripple";

interface SkillCategory {
  label: string;
  items: { name: string; weight: number }[];
}

const skillGroups: SkillCategory[] = [
  { label: "Languages", items: [{ name: "Python", weight: 3 }, { name: "C++", weight: 2 }, { name: "SQL", weight: 2 }, { name: "TypeScript", weight: 2 }, { name: "JavaScript", weight: 2 }] },
  { label: "ML & Computer Vision", items: [{ name: "YOLO", weight: 3 }, { name: "OpenCV", weight: 3 }, { name: "PyTorch", weight: 2 }, { name: "TensorFlow", weight: 2 }, { name: "Scikit-learn", weight: 2 }, { name: "Keras", weight: 2 }, { name: "Object Tracking", weight: 2 }, { name: "Video Analytics", weight: 3 }, { name: "MobileNetV2", weight: 1 }] },
  { label: "Gen-AI & LLM", items: [{ name: "LangChain", weight: 3 }, { name: "LangGraph", weight: 3 }, { name: "RAG Pipelines", weight: 3 }, { name: "Groq", weight: 2 }, { name: "Together AI", weight: 2 }, { name: "Prompt Engineering", weight: 2 }] },
  { label: "Backend & APIs", items: [{ name: "FastAPI", weight: 3 }, { name: "REST APIs", weight: 2 }, { name: "Celery", weight: 2 }, { name: "Redis", weight: 2 }, { name: "JWT/RBAC", weight: 1 }, { name: "WebSockets", weight: 2 }, { name: "Pub/Sub", weight: 2 }] },
  { label: "Cloud & Data", items: [{ name: "AWS SQS", weight: 2 }, { name: "GCP BigQuery", weight: 2 }, { name: "Cloud Composer", weight: 2 }, { name: "Apache Airflow", weight: 2 }, { name: "PostgreSQL", weight: 3 }, { name: "MongoDB Atlas", weight: 2 }] },
  { label: "DevOps & Tools", items: [{ name: "Docker", weight: 2 }, { name: "Git", weight: 2 }, { name: "GitHub Actions", weight: 1 }, { name: "Linux", weight: 2 }, { name: "Postman", weight: 1 }] },
  { label: "Frontend", items: [{ name: "React", weight: 2 }, { name: "Vite", weight: 1 }, { name: "TypeScript", weight: 2 }, { name: "HTML/CSS", weight: 1 }, { name: "PyQt5", weight: 1 }] },
];

const WEIGHT_SIZES: Record<number, string> = {
  1: "text-[11px] px-3 py-1.5",
  2: "text-xs px-3.5 py-1.5",
  3: "text-sm px-4 py-2 font-semibold",
};

// Random z-translate for 3D depth
const randomZ = () => Math.round(Math.random() * 40 - 20);

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".skill-category").forEach((cat) => {
        const label = cat.querySelector(".cat-label");
        const tags = cat.querySelectorAll(".skill-tag");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: cat, start: "top 88%", toggleActions: "play none none none", once: true },
        });

        if (label) tl.from(label, { y: "105%", duration: 0.7, ease: "power4.out" });
        tl.from(tags, { opacity: 0, y: 20, rotateX: -15, stagger: 0.05, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3");
      });

      // Depth convergence
      gsap.from(containerRef.current!, {
        scale: 0.97, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current!, start: "top 90%", toggleActions: "play none none none", once: true },
      });
    },
    { scope: containerRef }
  );

  // Tag hover: scale + z-pop + rotation
  const handleTagEnter = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.1, z: 40, rotation: gsap.utils.random(-3, 3),
      duration: 0.3, ease: "power2.out",
    });
  };
  const handleTagLeave = (e: React.MouseEvent) => {
    const origZ = (e.currentTarget as HTMLElement).dataset.z || "0";
    gsap.to(e.currentTarget, {
      scale: 1, z: parseInt(origZ), rotation: 0,
      duration: 0.4, ease: "elastic.out(1, 0.5)",
    });
  };

  const totalSkills = skillGroups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <section id="skills" className="section-padding relative" ref={containerRef} style={{ perspective: "1200px" }}>
      {/* ── Background watermark "ARSENAL" (Change 3) ─────── */}
      <div className="watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw]">
        ARSENAL
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-14">
          <RevealText as="h2" className="section-heading">
            Technical <span className="text-gradient-teal">Arsenal</span>
          </RevealText>
          <RevealText className="section-subheading" delay={0.1}>
            {totalSkills}+ technologies and tools for building intelligent, scalable systems
          </RevealText>
        </div>

        <div className="space-y-10" style={{ transformStyle: "preserve-3d" }}>
          {skillGroups.map((group) => (
            <div key={group.label} className="skill-category">
              <div className="overflow-hidden mb-4 flex items-center gap-3">
                <h3 className="cat-label text-[10px] font-display font-bold uppercase tracking-[0.3em] text-[#C9A84C]/50">
                  {group.label}
                </h3>
                <span className="text-[9px] font-mono text-muted-foreground/30">({group.items.length})</span>
              </div>

              <div className="flex flex-wrap gap-2" style={{ transformStyle: "preserve-3d" }}>
                {group.items.map((skill) => {
                  const zVal = randomZ();
                  return (
                    <span key={skill.name}
                      className={`skill-tag relative overflow-hidden inline-block rounded-full border border-[rgba(201,168,76,0.08)] text-muted-foreground hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.05)] transition-colors will-change-transform ${WEIGHT_SIZES[skill.weight] || WEIGHT_SIZES[2]}`}
                      style={{ transform: `translateZ(${zVal}px)` }}
                      data-z={zVal}
                      onMouseEnter={handleTagEnter}
                      onMouseLeave={handleTagLeave}
                      onClick={(e) => {
                        const ripple = createRipple(e, e.currentTarget);
                        setTimeout(() => removeRipple(ripple), 700);
                      }}
                    >
                      <span className="relative z-10">{skill.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
