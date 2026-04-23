import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, X, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  tech: string[];
  description: string;
  github: string;
}

const projects: Project[] = [
  {
    id: "ai-debate-arena",
    title: "AI Debate Arena",
    tech: ["FastAPI", "React (Vite)", "TypeScript", "LangGraph", "LangChain", "Groq (Llama 3)", "Redis", "PostgreSQL"],
    description: "Real-time event-driven debate platform with Redis Pub/Sub for sub-second sync and LangGraph agentic workflow.",
    github: "{AI_DEBATE_REPO}",
  },
  {
    id: "cv-analyser",
    title: "CV-Analyser",
    tech: ["TF-IDF", "Multinomial Naive Bayes", "Python"],
    description: "Resume classification system trained on 1000+ resumes across 20 domains; 97% test accuracy.",
    github: "{CV_ANALYSER_REPO}",
  },
  {
    id: "chessbot-vision",
    title: "ChessBot Vision System",
    tech: ["Python", "TensorFlow (MobileNetV2)", "OpenCV", "Stockfish", "PyQt5"],
    description: "CV assistant trained on 2400+ images to output FEN & suggest moves via Stockfish.",
    github: "{CHESSBOT_REPO}",
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  // Deep link support: read hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const idx = projects.findIndex((p) => p.id === hash);
    if (idx >= 0) setActiveProject(idx);
  }, []);

  // Update hash when project opens
  useEffect(() => {
    if (activeProject !== null) {
      window.history.replaceState(null, "", `#${projects[activeProject].id}`);
    }
  }, [activeProject]);

  return (
    <section id="projects" className="py-8 md:py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-lg sm:text-xl font-display font-bold text-foreground mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured <span className="text-gradient-teal">Projects</span>
        </motion.h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="glass-card p-4 cursor-pointer group hover:border-primary/25 transition-all relative overflow-hidden"
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6, scale: 1.02, rotateX: 2, rotateY: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveProject(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveProject(i);
              }}
              aria-label={`View details for ${project.title}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, hsl(168 100% 37% / 0.1) 0%, transparent 70%)" }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-display font-semibold text-foreground text-sm">{project.title}</h3>
                  <Github className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-2.5">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full border border-border/40 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-border/40 text-muted-foreground">
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
              transition={{ duration: 0.3 }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setActiveProject(null);
              }}
            >
              <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" onClick={() => setActiveProject(null)} />
              <motion.div
                className="glass-card p-5 sm:p-7 max-w-lg w-full relative z-10 border-primary/20 shadow-[0_0_40px_hsl(168_100%_37%/0.12)]"
                initial={{ scale: 0.88, y: 30, filter: "blur(8px)" }}
                animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ scale: 0.88, y: 30, filter: "blur(8px)" }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              >
                <button
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded p-0.5"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close project details"
                  autoFocus
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-base font-display font-bold text-foreground mb-1.5">
                  {projects[activeProject].title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {projects[activeProject].description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {projects[activeProject].tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-primary/25 text-primary">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={projects[activeProject].github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-xs hover:scale-[1.03] hover:shadow-[0_0_20px_hsl(168_100%_37%/0.4)] active:scale-[0.97] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View on GitHub
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
