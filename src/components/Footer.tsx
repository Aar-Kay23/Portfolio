import { Linkedin, Github, Mail, FileText } from "lucide-react";

const LINKS = {
  linkedin: "{LINKEDIN_URL}",
  github: "{GITHUB_URL}",
  email: "{EMAIL}",
  resume: "{RESUME_PDF_URL}",
};

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-muted-foreground/70">
          © {new Date().getFullYear()} RAJ Khandelwal
        </p>
        <div className="flex items-center gap-3">
          {[
            { href: LINKS.linkedin, icon: Linkedin, label: "LinkedIn", external: true },
            { href: LINKS.github, icon: Github, label: "GitHub", external: true },
            { href: `mailto:${LINKS.email}`, icon: Mail, label: "Email", external: false },
            { href: LINKS.resume, icon: FileText, label: "Resume", external: true },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              className="text-muted-foreground hover:text-primary hover:scale-110 active:scale-95 transition-all"
            >
              <link.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
