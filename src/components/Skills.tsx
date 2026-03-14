import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

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
    <section id="skills" className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        <motion.h2
          className="text-xl sm:text-2xl font-display font-bold text-foreground mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Technical <span className="text-gradient-teal">Skills</span>
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              className="glass-card p-4 sm:p-5"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.08 }}
              style={{
                transform: `translate(${mouse.x * (gi % 2 === 0 ? -3 : 3)}px, ${mouse.y * -2}px)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <h3 className="text-xs font-display font-semibold text-primary mb-3 uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <motion.button
                    key={skill}
                    className={`px-2.5 py-1 rounded-full text-xs font-body border transition-all cursor-pointer ${
                      activeSkill === skill
                        ? "border-primary bg-primary/15 text-primary glow-teal"
                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                    aria-label={`Skill: ${skill}${masteryNotes[skill] ? ` — ${masteryNotes[skill]}` : ""}`}
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>
              {group.items.some((s) => s === activeSkill) && activeSkill && masteryNotes[activeSkill] && (
                <motion.p
                  className="mt-2.5 text-[11px] text-primary/80 font-body border-l-2 border-primary/30 pl-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {masteryNotes[activeSkill]}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
