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

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" && (activeIndex === null || activeIndex < roles.length - 1)) {
      setActiveIndex(prev => prev === null ? 0 : prev + 1);
    } else if (e.key === "ArrowLeft" && activeIndex !== null && activeIndex > 0) {
      setActiveIndex(prev => (prev ?? 1) - 1);
    } else if (e.key === "Escape") {
      setActiveIndex(null);
    }
  }, [activeIndex]);

  return (
    <section id="experience" className="py-10 md:py-14 px-4 md:px-8" onKeyDown={handleKey}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-xl sm:text-2xl font-display font-bold text-foreground mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work <span className="text-gradient-teal">Experience</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Rail line */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Keyboard nav hint */}
          <div className="hidden md:flex justify-center mb-2 gap-1 text-[10px] text-muted-foreground/50">
            <ChevronLeft className="w-3 h-3" /> <ChevronRight className="w-3 h-3" /> Navigate
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                className="flex-1 max-w-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                {/* Node */}
                <div className="hidden md:flex justify-center mb-3">
                  <button
                    onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                    className={`w-4 h-4 rounded-full border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background ${
                      activeIndex === i
                        ? "border-primary bg-primary glow-teal scale-150"
                        : "border-primary/40 bg-background hover:border-primary hover:scale-125"
                    }`}
                    aria-label={`Expand details for ${role.company}`}
                  />
                </div>

                {/* Card */}
                <motion.div
                  className={`glass-card p-4 cursor-pointer transition-all ${
                    activeIndex === i ? "border-primary/40 glow-teal" : "hover:border-primary/20"
                  }`}
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={activeIndex === i}
                >
                  <div className="flex items-center gap-2 text-primary mb-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-xs font-display font-semibold">{role.company}</span>
                  </div>
                  <p className="text-sm font-display font-medium text-foreground">{role.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{role.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{role.period}</span>
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
              className="glass-card p-5 mt-4 relative border-primary/20"
              initial={{ opacity: 0, y: 15, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
              transition={{ duration: 0.25 }}
              style={{ transformOrigin: "top" }}
            >
              <button
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                onClick={() => setActiveIndex(null)}
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-display font-semibold text-foreground text-sm mb-0.5">
                {roles[activeIndex].title}
              </h3>
              <p className="text-xs text-primary mb-3">{roles[activeIndex].company} — {roles[activeIndex].period}</p>
              <ul className="space-y-2">
                {roles[activeIndex].bullets.map((bullet, bi) => (
                  <li key={bi} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-primary mt-0.5 shrink-0">▸</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
