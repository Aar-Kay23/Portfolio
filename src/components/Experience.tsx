import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { RevealText } from "./TextReveal";
import { Briefcase, MapPin, Calendar, ChevronRight } from "lucide-react";

const roles = [
  {
    company: "Prismberry Technologies",
    title: "Software Engineer, Gen-AI",
    location: "Noida",
    period: "Jun 2025 – Present",
    type: "Full-time",
    current: true,
    initial: "P",
    bullets: [
      "Architected VisionIQ, a production-grade video analytics platform processing multi-camera RTSP streams in real-time — delivering footfall counting, crowd density analysis, gender/age estimation, restricted-zone intrusion, PPE compliance, and fire/anomaly alerting powered by YOLO and custom CV models.",
      "Engineered an event-driven pipeline using Amazon SQS, FastAPI, and PostgreSQL processing 10,000+ detection events daily, with a conversational AI chatbot enabling natural language analytics queries — reducing manual monitoring by ~40%.",
      "Developed a scalable email platform with FastAPI, PostgreSQL, MongoDB Atlas, JWT-based RBAC, and Celery + Redis async dispatch, exposing 10+ RESTful endpoints with Together AI-powered content summarization.",
    ],
  },
  {
    company: "HCL Technologies",
    title: "Data Engineering & AI/ML Intern",
    location: "Noida",
    period: "Feb 2025 – May 2025",
    type: "Internship",
    current: false,
    initial: "H",
    bullets: [
      "Designed and deployed 15+ automated ETL pipelines using Apache Airflow and Cloud Composer on GCP, streamlining data ingestion and reducing manual processing by ~15% while handling 100K+ records through BigQuery and PostgreSQL.",
      "Developed and benchmarked ML models (SVM, Random Forest, Linear Regression) using Scikit-learn, achieving 87% classification accuracy through systematic feature engineering and cross-validated evaluation.",
    ],
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".timeline-line-fill", {
        scaleY: 0, transformOrigin: "top center", ease: "none",
        scrollTrigger: { trigger: ".timeline-container", start: "top 75%", end: "bottom 50%", scrub: 1.5 },
      });

      gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -40 : 40, autoAlpha: 0, duration: 0.9, ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none", once: true },
        });
        const node = card.querySelector(".timeline-node");
        if (node) {
          gsap.from(node, { scale: 0, duration: 0.5, ease: "back.out(2)",
            scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none none", once: true },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card) => {
        ScrollTrigger.create({
          trigger: card, start: "top 50%", end: "bottom 50%",
          onEnter: () => card.classList.add("exp-active"),
          onLeave: () => card.classList.remove("exp-active"),
          onEnterBack: () => card.classList.add("exp-active"),
          onLeaveBack: () => card.classList.remove("exp-active"),
        });
      });

      gsap.utils.toArray<HTMLElement>(".exp-bullets").forEach((list) => {
        gsap.from(list.querySelectorAll("li"), {
          x: -20, autoAlpha: 0, stagger: 0.1, duration: 0.5,
          scrollTrigger: { trigger: list, start: "top 88%", toggleActions: "play none none none", once: true },
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
    <section id="experience" className="section-padding" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <RevealText as="h2" className="section-heading">
            Work <span className="text-gradient-teal">Experience</span>
          </RevealText>
          <RevealText className="section-subheading" delay={0.1}>
            Building production systems at scale
          </RevealText>
        </div>

        <div className="timeline-container relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-[rgba(201,168,76,0.04)]">
            <div className="timeline-line-fill absolute inset-0 pointer-events-none bg-gradient-to-b from-[rgba(201,168,76,0.5)] via-[rgba(201,168,76,0.2)] to-transparent" />
          </div>

          <div className="space-y-8">
            {roles.map((role, i) => (
              <div key={i} className="exp-card relative pl-16 md:pl-20 transition-all duration-500">
                {/* Timeline node */}
                <div className="timeline-node absolute left-[14px] md:left-[22px] top-6 w-5 h-5 rounded-full border-[3px] border-[#C9A84C] bg-background flex items-center justify-center z-10 transition-shadow duration-500">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                </div>

                <div className="glass-card p-5 md:p-6 relative overflow-hidden transition-all duration-500">
                  {/* ── Company initial watermark (Change 3) ─────── */}
                  <div className="absolute top-3 right-4 text-[80px] font-display font-extrabold leading-none text-[rgba(201,168,76,0.03)] select-none pointer-events-none">
                    {role.initial}
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="w-4 h-4 text-[#C9A84C]" />
                          <h3 className="text-lg font-display font-bold text-foreground exp-title transition-colors duration-500">
                            {role.company}
                          </h3>
                          {/* ── Currently indicator (Change 3) ──────── */}
                          {role.current && <div className="pulse-live ml-1 mt-1" title="Currently working here" />}
                        </div>
                        <p className="text-sm font-display font-medium text-[#C9A84C]/70">{role.title}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-[rgba(201,168,76,0.15)] text-[#C9A84C]/60">
                        {role.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {role.location}</span>
                      <span className="flex items-center gap-1 font-mono"><Calendar className="w-3 h-3" /> {role.period}</span>
                    </div>

                    <ul className="exp-bullets space-y-3">
                      {role.bullets.map((bullet, bi) => (
                        <li key={bi} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                          <ChevronRight className="w-4 h-4 text-[#C9A84C]/40 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .exp-card.exp-active .glass-card {
          border-color: rgba(201, 168, 76, 0.12);
          box-shadow: 0 0 40px rgba(201, 168, 76, 0.04);
        }
        .exp-card.exp-active .exp-title { color: #C9A84C; }
        .exp-card.exp-active .timeline-node { box-shadow: 0 0 20px rgba(201, 168, 76, 0.25); }
      `}</style>
    </section>
  );
}
