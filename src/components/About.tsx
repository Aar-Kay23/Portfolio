import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-8 md:py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3">
            About <span className="text-gradient-teal">Me</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            I am a B.Tech (Computer Engineering) candidate at J.C. Bose University of Science and Technology,
            Faridabad (2021–2025) focused on production-grade AI systems, machine vision, and scalable backend
            architectures. I design real-time video analytics platforms, event-driven pipelines, and agentic LLM
            workflows to automate insights and accelerate decision-making.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
