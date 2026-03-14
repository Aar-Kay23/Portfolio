import { Linkedin, Github, Mail, FileText } from "lucide-react";

const LINKS = {
  linkedin: "{LINKEDIN_URL}",
  github: "{GITHUB_URL}",
  email: "{EMAIL}",
  resume: "{RESUME_PDF_URL}",
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} RAJ Khandelwal. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href={`mailto:${LINKS.email}`} aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="w-5 h-5" />
          </a>
          <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" aria-label="Download Resume" className="text-muted-foreground hover:text-primary transition-colors">
            <FileText className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
