import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone } from "lucide-react";

const CONTACT = {
  email: "{EMAIL}",
  phone: "{PHONE}",
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message }),
      });
      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "", honeypot: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-xl mx-auto">
        <motion.h2
          className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get in <span className="text-gradient-teal">Touch</span>
        </motion.h2>

        <motion.div
          className="glass-card p-5 sm:p-6"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="website" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-xs font-display font-medium text-foreground mb-1">Name</label>
                <input id="name" type="text" required maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-display font-medium text-foreground mb-1">Email</label>
                <input id="email" type="email" required maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-display font-medium text-foreground mb-1">Message</label>
              <textarea id="message" required maxLength={1000} rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Your message..." />
            </div>

            <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 glow-teal">
              <Send className="w-3.5 h-3.5" />
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "sent" && <p className="text-xs text-primary">Message sent! I'll get back to you soon.</p>}
            {status === "error" && (
              <p className="text-xs text-accent">
                Failed to send. Email me at <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>
              </p>
            )}
          </form>

          <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5" /> {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5" /> {CONTACT.phone}
            </a>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground/70">I typically respond within 2 business days.</p>
        </motion.div>
      </div>
    </section>
  );
}
