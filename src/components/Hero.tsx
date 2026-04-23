import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, FileText, ChevronDown } from "lucide-react";

const LINKS = {
  resume: "{RESUME_PDF_URL}",
  email: "{EMAIL}",
  phone: "{PHONE}",
  linkedin: "{LINKEDIN_URL}",
  github: "{GITHUB_URL}",
};

export default function Hero() {
  const [flipped, setFlipped] = useState(false);

  return (
    <section id="hero" className="min-h-[100svh] flex items-center relative pt-12">
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-8">
          {/* 3D Flip Card */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, x: -50, scale: 0.85, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="w-[280px] sm:w-[320px] md:w-[360px] h-[200px] sm:h-[220px] cursor-pointer"
              style={{ perspective: "1200px" }}
              onClick={() => setFlipped(!flipped)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setFlipped(!flipped);
              }}
              tabIndex={0}
              role="button"
              aria-label={flipped ? "Show front of profile card" : "Flip to see contact details"}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 glass-card gradient-border glow-teal p-5 flex flex-col justify-center items-center text-center overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-40 blur-2xl"
                    style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.6), transparent 70%)" }}
                    aria-hidden="true"
                  />
                  <motion.div
                    className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-2.5 relative z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <span className="text-lg font-display font-bold text-primary">RK</span>
                  </motion.div>
                  <h1 className="text-base sm:text-lg font-display font-bold text-foreground relative z-10">RAJ Khandelwal</h1>
                  <p className="text-[11px] text-primary font-medium mt-0.5 relative z-10">Software Engineer (Gen-AI & Computer Vision)</p>
                  <p className="text-[9px] text-muted-foreground mt-1.5 opacity-60 relative z-10">Click to flip</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 glass-card glow-teal p-5 flex flex-col justify-center items-center gap-2"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <h2 className="text-xs font-display font-semibold text-foreground mb-1">Quick Contact</h2>
                  <a href={`mailto:${LINKS.email}`} className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-3 h-3" /> {LINKS.email}
                  </a>
                  <a href={`tel:${LINKS.phone}`} className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-3 h-3" /> {LINKS.phone}
                  </a>
                  <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </a>
                  <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-3 h-3" /> GitHub
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex-1 text-center md:text-left pt-1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight">
              Hi, I'm <span className="text-gradient-accent">RAJ Khandelwal</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
              Building production-grade AI systems, real-time video analytics, and scalable backend platforms.
            </p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-2.5 mt-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-xs hover:scale-[1.03] hover:shadow-[0_0_20px_hsl(168_100%_37%/0.4)] active:scale-[0.97] transition-all glow-teal"
              >
                <FileText className="w-3.5 h-3.5" /> View Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary font-display font-semibold text-xs hover:bg-primary/10 hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                <Mail className="w-3.5 h-3.5" /> Contact Me
              </a>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              className="flex flex-wrap gap-5 mt-5 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { val: "2+", label: "Years Exp" },
                { val: "15+", label: "ETL Pipelines" },
                { val: "97%", label: "ML Accuracy" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-lg font-display font-bold text-primary">{s.val}</span>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center mt-6 md:mt-10"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
        </motion.div>
      </div>
    </section>
  );
}
