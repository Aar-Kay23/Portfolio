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
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-8 md:py-10 px-4 md:px-8">
      <div className="max-w-xl mx-auto">
        <motion.h2
          className="text-lg sm:text-xl font-display font-bold text-foreground mb-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get in <span className="text-gradient-teal">Touch</span>
        </motion.h2>

        <motion.div
          className="glass-card p-4 sm:p-5"
          initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <input type="text" name="website" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-[10px] font-display font-medium text-foreground mb-0.5">Name</label>
                <input id="name" type="text" required maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-[10px] font-display font-medium text-foreground mb-0.5">Email</label>
                <input id="email" type="email" required maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-[10px] font-display font-medium text-foreground mb-0.5">Message</label>
              <textarea id="message" required maxLength={1000} rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-shadow" placeholder="Your message..." />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-xs hover:scale-[1.03] hover:shadow-[0_0_20px_hsl(168_100%_37%/0.4)] active:scale-[0.97] transition-all disabled:opacity-50 glow-teal"
            >
              <Send className="w-3 h-3" />
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "sent" && <p className="text-[10px] text-primary">Message sent! I'll get back to you soon.</p>}
            {status === "error" && (
              <p className="text-[10px] text-accent">
                Failed to send. Email me at <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>
              </p>
            )}
          </form>

          <div className="mt-3 pt-3 border-t border-border/40 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Mail className="w-3 h-3" /> {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="w-3 h-3" /> {CONTACT.phone}
            </a>
          </div>
          <p className="mt-2 text-[9px] text-muted-foreground/60">I typically respond within 2 business days.</p>
        </motion.div>
      </div>
    </section>
  );
}
