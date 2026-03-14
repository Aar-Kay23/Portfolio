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
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center section-padding relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        {/* 3D Flip Card */}
        <div
          className="w-[340px] sm:w-[400px] h-[240px] sm:h-[260px] cursor-pointer"
          style={{ perspective: "1000px" }}
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
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 glass-card glow-teal p-6 sm:p-8 flex flex-col justify-center items-center text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4">
                <span className="text-2xl font-display font-bold text-primary">RK</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">RAJ Khandelwal</h1>
              <p className="text-sm text-primary font-medium mt-1">Software Engineer (Gen-AI & Computer Vision)</p>
              <p className="text-xs text-muted-foreground mt-2 hidden sm:block">Click to flip for contact</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 glass-card glow-teal p-6 sm:p-8 flex flex-col justify-center items-center gap-3"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <h2 className="text-lg font-display font-semibold text-foreground mb-2">Quick Contact</h2>
              <a href={`mailto:${LINKS.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> {LINKS.email}
              </a>
              <a href={`tel:${LINKS.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> {LINKS.phone}
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            Hi, I'm <span className="text-gradient-teal">RAJ Khandelwal</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Building production-grade AI systems, real-time video analytics, and scalable backend platforms.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a
            href={LINKS.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity glow-teal"
          >
            <FileText className="w-4 h-4" /> View Resume
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 text-primary font-display font-semibold text-sm hover:bg-primary/10 transition-colors"
          >
            <Mail className="w-4 h-4" /> Contact Me
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
}
