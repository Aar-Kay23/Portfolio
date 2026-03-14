import { useState } from "react";
import { motion } from "framer-motion";

const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "C++", "SQL"],
  },
  {
    label: "ML & CV",
    items: ["YOLO", "OpenCV", "PyTorch", "TensorFlow", "Scikit-learn", "Object Tracking", "Video Analytics"],
  },
  {
    label: "Backend & AI Systems",
    items: ["FastAPI", "REST APIs", "Celery", "Redis", "LangChain", "LangGraph"],
  },
  {
    label: "Cloud, Data & Infra",
    items: ["Amazon SQS", "GCP (BigQuery, Cloud Composer)", "Apache Airflow", "PostgreSQL", "MongoDB", "Git", "Docker"],
  },
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

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Technical <span className="text-gradient-teal">Skills</span>
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1 }}
            >
              <h3 className="text-sm font-display font-semibold text-primary mb-4 uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <motion.button
                    key={skill}
                    className={`px-3 py-1.5 rounded-full text-sm font-body border transition-all cursor-pointer ${
                      activeSkill === skill
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                    aria-label={`Skill: ${skill}`}
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>
              {/* Mastery note */}
              {group.items.some((s) => s === activeSkill) && activeSkill && masteryNotes[activeSkill] && (
                <motion.p
                  className="mt-3 text-xs text-primary/80 font-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  ✦ {masteryNotes[activeSkill]}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
