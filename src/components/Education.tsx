import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

const education = [
  {
    institution: "J.C. Bose University of Science and Technology, Faridabad",
    degree: "B.Tech in Computer Engineering",
    score: "CGPA 8.08/10",
    period: "2021–2025",
    icon: GraduationCap,
  },
  {
    institution: "DAV Public School, Sahibabad",
    degree: "Class 12 CBSE",
    score: "98%",
    period: "2020–2021",
    icon: Award,
  },
];

export default function Education() {
  return (
    <section id="education" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient-teal">Education</span>
        </motion.h2>

        <div className="space-y-4">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 flex gap-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <edu.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">{edu.institution}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{edu.degree}</p>
                <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="text-primary font-medium">{edu.score}</span>
                  <span>{edu.period}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
