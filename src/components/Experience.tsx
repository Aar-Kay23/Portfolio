import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Calendar, X } from "lucide-react";

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
    period: "June 2025 – Present",
    bullets: [
      "Built VisionIQ: a production video analytics platform processing multi-camera RTSP streams in real-time producing footfall, crowd density, gender/age estimation, restricted-zone access, PPE detection, fire/anomaly alerts using YOLO and custom CV models.",
      "Designed an event-driven pipeline with SQS, FastAPI, PostgreSQL handling thousands of detections/day; integrated AI chatbot for natural-language surveillance insights (reduced manual effort ~40%).",
      "Developed a scalable email platform with FastAPI, PostgreSQL, MongoDB Atlas, JWT RBAC, Celery+Redis for async dispatch and Together AI real-time summarization.",
    ],
  },
  {
    company: "HCL Technologies",
    title: "Data Engineering & AI/ML Intern",
    location: "Noida",
    period: "Feb 2025 – May 2025",
    bullets: [
      "Deployed 15+ automated ETL pipelines with Apache Airflow and Cloud Composer on GCP; processed 100K+ structured records in BigQuery/Postgres; reduced manual effort ~15%.",
      "Built ML models (SVM, Random Forest, Linear Regression) using Scikit-learn achieving up to 87% classification accuracy.",
    ],
  },
];

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work <span className="text-gradient-teal">Experience</span>
        </motion.h2>

        {/* Horizontal timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-[60px] left-0 right-0 h-px bg-border" />

          <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                className="flex-1 max-w-md"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Node */}
                <div className="hidden md:flex justify-center mb-4">
                  <button
                    onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveIndex(activeIndex === i ? null : i); }}
                    className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                      activeIndex === i
                        ? "border-primary bg-primary glow-teal scale-125"
                        : "border-primary/50 bg-background hover:border-primary hover:scale-110"
                    }`}
                    aria-label={`Expand details for ${role.company}`}
                  />
                </div>

                {/* Card */}
                <motion.div
                  className="glass-card p-5 cursor-pointer hover:border-primary/30 transition-colors"
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveIndex(activeIndex === i ? null : i); }}
                  aria-expanded={activeIndex === i}
                >
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-display font-semibold">{role.company}</span>
                  </div>
                  <p className="text-sm font-display font-medium text-foreground">{role.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
              className="glass-card p-6 mt-8 relative"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setActiveIndex(null)}
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-display font-semibold text-foreground mb-1">
                {roles[activeIndex].title}
              </h3>
              <p className="text-sm text-primary mb-4">{roles[activeIndex].company} — {roles[activeIndex].period}</p>
              <ul className="space-y-3">
                {roles[activeIndex].bullets.map((bullet, bi) => (
                  <li key={bi} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-primary mt-1 shrink-0">▸</span>
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
