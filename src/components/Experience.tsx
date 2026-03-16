import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Role {
  company: string;
  title: string;
  location: string;
  period: string;
  bullets: string[];
}

const roles: Role[] = [
  {
    company: "Prismberry Technologies",
    title: "Software Engineer Gen-AI",
    location: "Noida",
    period: "Jun 2025 – Present",
    bullets: [
      "Built VisionIQ: real-time multi-camera RTSP video analytics (YOLO + custom CV); footfall, crowd density, PPE, fire/anomaly alerts.",
      "Event-driven pipeline: SQS + FastAPI + PostgreSQL; integrated AI chatbot for natural-language surveillance queries (↓ manual effort ~40%).",
      "Scalable email platform: FastAPI + PostgreSQL + MongoDB Atlas + Celery + Redis; Together AI real-time summarization.",
    ],
  },
  {
    company: "HCL Technologies",
    title: "Data Engineering & AI/ML Intern",
    location: "Noida",
    period: "Feb 2025 – May 2025",
    bullets: [
      "Deployed 15+ ETL pipelines via Apache Airflow & GCP Cloud Composer; processed 100K+ records (BigQuery/Postgres).",
      "Built ML models (SVM / Random Forest / Linear Regression) using Scikit-learn → up to 87% accuracy.",
    ],
  },
];

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" && (activeIndex === null || activeIndex < roles.length - 1)) {
        setActiveIndex((prev) => (prev === null ? 0 : prev + 1));
      } else if (e.key === "ArrowLeft" && activeIndex !== null && activeIndex > 0) {
        setActiveIndex((prev) => (prev ?? 1) - 1);
      } else if (e.key === "Escape") {
        setActiveIndex(null);
      }
    },
    [activeIndex]
  );

  return (
    <section id="experience" className="py-8 md:py-10 px-4 md:px-8" onKeyDown={handleKey}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-lg sm:text-xl font-display font-bold text-foreground mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work <span className="text-gradient-teal">Experience</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Rail line */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

          <div className="hidden md:flex justify-center mb-1.5 gap-1 text-[9px] text-muted-foreground/40">
            <ChevronLeft className="w-2.5 h-2.5" /> <ChevronRight className="w-2.5 h-2.5" /> Navigate
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:gap-5 justify-center">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                className="flex-1 max-w-md"
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                {/* Node */}
                <div className="hidden md:flex justify-center mb-2.5">
                  <button
                    onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-background ${
                      activeIndex === i
                        ? "border-primary bg-primary shadow-[0_0_14px_hsl(168_100%_37%/0.5)] scale-150"
                        : "border-primary/40 bg-background hover:border-primary hover:scale-125"
                    }`}
                    aria-label={`Expand details for ${role.company}`}
                  />
                </div>

                {/* Card */}
                <motion.div
                  className={`glass-card p-3.5 cursor-pointer transition-all ${
                    activeIndex === i ? "border-primary/30 shadow-[0_0_20px_hsl(168_100%_37%/0.15)]" : "hover:border-primary/15"
                  }`}
                  whileHover={{ y: -4, scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={activeIndex === i}
                >
                  <div className="flex items-center gap-1.5 text-primary mb-0.5">
                    <Briefcase className="w-3 h-3" />
                    <span className="text-[11px] font-display font-semibold">{role.company}</span>
                  </div>
                  <p className="text-xs font-display font-medium text-foreground">{role.title}</p>
                  <div className="flex items-center gap-2.5 mt-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {role.period}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              className="glass-card p-4 mt-3 relative border-primary/15 shadow-[0_4px_30px_hsl(168_100%_37%/0.08)]"
              initial={{ opacity: 0, y: 12, scaleY: 0.96, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scaleY: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, scaleY: 0.96, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top" }}
            >
              <button
                className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded p-0.5"
                onClick={() => setActiveIndex(null)}
                aria-label="Close details"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <h3 className="font-display font-semibold text-foreground text-xs mb-0.5">
                {roles[activeIndex].title}
              </h3>
              <p className="text-[10px] text-primary mb-2.5">
                {roles[activeIndex].company} — {roles[activeIndex].period}
              </p>
              <ul className="space-y-1.5">
                {roles[activeIndex].bullets.map((bullet, bi) => (
                  <motion.li
                    key={bi}
                    className="text-xs text-muted-foreground leading-relaxed flex gap-1.5"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: bi * 0.08 }}
                  >
                    <span className="text-primary mt-0.5 shrink-0">▸</span>
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
