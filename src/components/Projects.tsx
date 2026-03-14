import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, X, ExternalLink } from "lucide-react";

interface Project {
  title: string;
  tech: string[];
  description: string;
  github: string;
}

const projects: Project[] = [
  {
    title: "AI Debate Arena",
    tech: ["FastAPI", "React (Vite)", "TypeScript", "LangGraph", "LangChain", "Groq (Llama 3)", "Redis", "PostgreSQL"],
    description: "Real-time event-driven debate platform with Redis Pub/Sub for sub-second sync and LangGraph agentic workflow.",
    github: "{AI_DEBATE_REPO}",
  },
  {
    title: "CV-Analyser",
    tech: ["TF-IDF", "Multinomial Naive Bayes", "Python"],
    description: "Resume classification system trained on 1000+ resumes across 20 domains; 97% test accuracy.",
    github: "{CV_ANALYSER_REPO}",
  },
  {
    title: "ChessBot Vision System",
    tech: ["Python", "TensorFlow (MobileNetV2)", "OpenCV", "Stockfish", "PyQt5"],
    description: "CV assistant trained on 2400+ images to output FEN & suggest moves via Stockfish.",
    github: "{CHESSBOT_REPO}",
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <section id="projects" className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-xl sm:text-2xl font-display font-bold text-foreground mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured <span className="text-gradient-teal">Projects</span>
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className="glass-card p-5 cursor-pointer group hover:border-primary/30 transition-all relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02, rotateX: 2 }}
              onClick={() => setActiveProject(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveProject(i); }}
              aria-label={`View details for ${project.title}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, hsl(168 100% 37% / 0.08) 0%, transparent 70%)" }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold text-foreground text-base">{project.title}</h3>
                  <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full overlay */}
        <AnimatePresence>
          {activeProject !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onKeyDown={(e) => { if (e.key === "Escape") setActiveProject(null); }}
            >
              <div className="absolute inset-0 bg-background/85 backdrop-blur-md" onClick={() => setActiveProject(null)} />
              <motion.div
                className="glass-card p-6 sm:p-8 max-w-lg w-full relative z-10 border-primary/20 glow-teal"
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close project details"
                  autoFocus
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-display font-bold text-foreground mb-2">
                  {projects[activeProject].title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {projects[activeProject].description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {projects[activeProject].tech.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-0.5 rounded-full border border-primary/30 text-primary">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={projects[activeProject].github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" /> View on GitHub
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
