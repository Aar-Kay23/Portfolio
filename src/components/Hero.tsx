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
    <section id="hero" className="min-h-[100svh] flex items-center relative pt-14">
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* 3D Flip Card — left side */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, x: -40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div
              className="w-[300px] sm:w-[340px] md:w-[380px] h-[220px] sm:h-[240px] cursor-pointer"
              style={{ perspective: "1200px" }}
              onClick={() => setFlipped(!flipped)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setFlipped(!flipped); }}
              tabIndex={0}
              role="button"
              aria-label={flipped ? "Show front of profile card" : "Flip to see contact details"}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 glass-card glow-teal p-5 sm:p-6 flex flex-col justify-center items-center text-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-3">
                    <span className="text-xl font-display font-bold text-primary">RK</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-display font-bold text-foreground">RAJ Khandelwal</h1>
                  <p className="text-xs text-primary font-medium mt-1">Software Engineer (Gen-AI & Computer Vision)</p>
                  <p className="text-[10px] text-muted-foreground mt-2 opacity-70">Click to flip</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 glass-card glow-teal p-5 sm:p-6 flex flex-col justify-center items-center gap-2.5"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <h2 className="text-sm font-display font-semibold text-foreground mb-1">Quick Contact</h2>
                  <a href={`mailto:${LINKS.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {LINKS.email}
                  </a>
                  <a href={`tel:${LINKS.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {LINKS.phone}
                  </a>
                  <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text — right side */}
          <motion.div
            className="flex-1 text-center md:text-left pt-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
              Hi, I'm <span className="text-gradient-teal">RAJ Khandelwal</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              Building production-grade AI systems, real-time video analytics, and scalable backend platforms.
            </p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity glow-teal"
              >
                <FileText className="w-4 h-4" /> View Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 text-primary font-display font-semibold text-sm hover:bg-primary/10 transition-colors"
              >
                <Mail className="w-4 h-4" /> Contact Me
              </a>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { val: "2+", label: "Years Exp" },
                { val: "15+", label: "ETL Pipelines" },
                { val: "97%", label: "ML Accuracy" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-xl font-display font-bold text-primary">{s.val}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center mt-8 md:mt-12"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/60" />
        </motion.div>
      </div>
    </section>
  );
}
