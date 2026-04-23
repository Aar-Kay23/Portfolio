import { Linkedin, Github, Mail, FileText, Heart } from "lucide-react";

const LINKS = {
  linkedin: "https://linkedin.com/in/rajkhandelwal23",
  github: "https://github.com/rajkhandelwal23",
  email: "raj.khandelwal2302@gmail.com",
  resume: "/Raj_Khandelwal_Tech_Resume.pdf",
};

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.06)] py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
          <span>© {new Date().getFullYear()}</span>
          <span className="text-foreground font-medium">Raj Khandelwal</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-[#C9A84C] fill-[#C9A84C]" />
          </span>
        </div>
        <div className="flex items-center gap-3">
          {[
            { href: LINKS.github, icon: Github, label: "GitHub", external: true },
            { href: LINKS.linkedin, icon: Linkedin, label: "LinkedIn", external: true },
            { href: `mailto:${LINKS.email}`, icon: Mail, label: "Email", external: false },
            { href: LINKS.resume, icon: FileText, label: "Resume", external: true },
          ].map((link) => (
            <a key={link.label} href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              data-magnetic="true"
              aria-label={link.label}
              className="w-9 h-9 rounded-lg border border-[rgba(201,168,76,0.08)] flex items-center justify-center text-muted-foreground hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.2)] hover:bg-[rgba(201,168,76,0.04)] transition-all">
              <link.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
