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
    <section id="education" className="py-8 md:py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-lg sm:text-xl font-display font-bold text-foreground mb-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient-teal">Education</span>
        </motion.h2>

        <div className="space-y-2.5">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              className="glass-card p-3.5 flex gap-3 hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ x: 4, scale: 1.005 }}
            >
              <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <edu.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-xs">{edu.institution}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{edu.degree}</p>
                <div className="flex gap-2.5 mt-0.5 text-[10px] text-muted-foreground">
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
