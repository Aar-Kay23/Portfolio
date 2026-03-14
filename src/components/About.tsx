import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6">
            About <span className="text-gradient-teal">Me</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
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
