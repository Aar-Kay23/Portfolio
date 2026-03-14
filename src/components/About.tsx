import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4">
            About <span className="text-gradient-teal">Me</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
