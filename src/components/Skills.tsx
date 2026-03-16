import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const skillGroups = [
  { label: "Languages", items: ["Python", "C++", "SQL"] },
  { label: "ML & CV", items: ["YOLO", "OpenCV", "PyTorch", "TensorFlow", "Scikit-learn", "Object Tracking", "Video Analytics"] },
  { label: "Backend & AI Systems", items: ["FastAPI", "REST APIs", "Celery", "Redis", "LangChain", "LangGraph"] },
  { label: "Cloud, Data & Infra", items: ["Amazon SQS", "GCP (BigQuery, Cloud Composer)", "Apache Airflow", "PostgreSQL", "MongoDB", "Git", "Docker"] },
];

const masteryNotes: Record<string, string> = {
  Python: "Primary language for AI/ML and backend systems",
  "C++": "Systems programming and performance-critical code",
  SQL: "Complex queries, optimization, and database design",
  YOLO: "Real-time object detection for production video analytics",
  OpenCV: "Image processing and computer vision pipelines",
  PyTorch: "Deep learning model training and deployment",
  TensorFlow: "CNN architectures including MobileNetV2",
  "Scikit-learn": "Classical ML — SVM, Random Forest, NB classifiers",
  "Object Tracking": "Multi-object tracking in real-time video streams",
  "Video Analytics": "End-to-end production video intelligence platforms",
  FastAPI: "High-performance async REST APIs in production",
  "REST APIs": "Scalable API design with JWT RBAC",
  Celery: "Distributed async task processing",
  Redis: "Caching, pub/sub, and message brokering",
  LangChain: "LLM orchestration and RAG pipelines",
  LangGraph: "Agentic multi-step LLM workflows",
  "Amazon SQS": "Event-driven pipeline message queuing",
  "GCP (BigQuery, Cloud Composer)": "Cloud data processing at scale",
  "Apache Airflow": "Automated ETL pipeline orchestration",
  PostgreSQL: "Primary relational database for production apps",
  MongoDB: "Document-oriented storage for flexible schemas",
  Git: "Version control and collaborative workflows",
  Docker: "Containerized deployments and dev environments",
};

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section id="skills" className="py-8 md:py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        <motion.h2
          className="text-lg sm:text-xl font-display font-bold text-foreground mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Technical <span className="text-gradient-teal">Skills</span>
        </motion.h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              className="glass-card p-3.5 sm:p-4 group/card hover:border-primary/25 transition-colors"
              initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.06, duration: 0.6 }}
              style={{
                transform: `translate(${mouse.x * (gi % 2 === 0 ? -2 : 2)}px, ${mouse.y * -1.5}px)`,
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <h3 className="text-[10px] font-display font-semibold text-primary mb-2.5 uppercase tracking-widest">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-1">
                {group.items.map((skill) => (
                  <motion.button
                    key={skill}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-body border transition-all cursor-pointer ${
                      activeSkill === skill
                        ? "border-primary bg-primary/15 text-primary shadow-[0_0_12px_hsl(168_100%_37%/0.25)]"
                        : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                    aria-label={`Skill: ${skill}${masteryNotes[skill] ? ` — ${masteryNotes[skill]}` : ""}`}
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {group.items.some((s) => s === activeSkill) && activeSkill && masteryNotes[activeSkill] && (
                  <motion.p
                    className="mt-2 text-[10px] text-primary/80 font-body border-l-2 border-primary/30 pl-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {masteryNotes[activeSkill]}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
