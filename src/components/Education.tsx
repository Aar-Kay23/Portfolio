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
    <section id="education" className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient-teal">Education</span>
        </motion.h2>

        <div className="space-y-3">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              className="glass-card p-4 flex gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <edu.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm">{edu.institution}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{edu.degree}</p>
                <div className="flex gap-3 mt-1 text-[11px] text-muted-foreground">
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
