import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "./TextReveal";
import { Send, Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { createRipple, removeRipple } from "@/lib/ripple";

const CONTACT = {
  email: "raj.khandelwal2302@gmail.com",
  phone: "+91-9811945369",
  linkedin: "https://linkedin.com/in/rajkhandelwal23",
  github: "https://github.com/rajkhandelwal23",
};

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useGSAP(
    () => {
      gsap.from(".contact-info-card", {
        x: -40, autoAlpha: 0, duration: 0.7,
        scrollTrigger: { trigger: ".contact-content", start: "top 85%", toggleActions: "play none none none", once: true },
      });
      gsap.from(".contact-form-card", {
        x: 40, autoAlpha: 0, duration: 0.7,
        scrollTrigger: { trigger: ".contact-content", start: "top 85%", toggleActions: "play none none none", once: true },
      });
      gsap.from(containerRef.current!, {
        scale: 0.97, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current!, start: "top 90%", toggleActions: "play none none none", once: true },
      });
    },
    { scope: containerRef }
  );

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
      if (res.ok) { setStatus("sent"); setFormData({ name: "", email: "", message: "", honeypot: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden" ref={containerRef}>
      {/* ── Ambient "LET'S BUILD" watermark (Change 3) ──── */}
      <div className="watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] whitespace-nowrap">
        LET'S BUILD
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-14">
          <RevealText as="h2" className="section-heading">
            Get in <span className="text-gradient-teal">Touch</span>
          </RevealText>
          <RevealText className="section-subheading" delay={0.1}>
            Have a project in mind? Let's build something incredible together.
          </RevealText>
        </div>

        <div className="contact-content grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 contact-info-card space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-display font-bold text-foreground">Contact</h3>
              {[
                { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
                { icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
                { icon: MapPin, label: "Location", value: "Noida, India", href: "#" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#C9A84C] transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(201,168,76,0.06)] flex items-center justify-center group-hover:bg-[rgba(201,168,76,0.12)] transition-colors">
                    <l.icon className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground/30 uppercase tracking-wider">{l.label}</p>
                    <p className="text-xs font-medium">{l.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* ── Social pills with liquid glass (Change 3) ─── */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-display font-bold text-foreground mb-3">Connect</h3>
              <div className="flex gap-2">
                {[
                  { icon: Github, label: "GitHub", href: CONTACT.github },
                  { icon: Linkedin, label: "LinkedIn", href: CONTACT.linkedin },
                  { icon: Mail, label: "Email", href: `mailto:${CONTACT.email}` },
                ].map((l) => (
                  <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="relative overflow-hidden magnetic-target flex items-center gap-1.5 px-3 py-2 rounded-full border border-[rgba(201,168,76,0.1)] text-[11px] font-medium text-foreground/60 hover:text-foreground transition-colors"
                    aria-label={l.label}
                    onMouseEnter={(e) => createRipple(e, e.currentTarget)}
                    onMouseLeave={(e) => removeRipple(e.currentTarget.querySelector('.ripple-drop'))}>
                    <span className="relative z-10 flex items-center gap-1.5"><l.icon className="w-3.5 h-3.5" /> {l.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Timezone / availability (Change 3) ────────── */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/30 px-1 mt-2">
              <span>📍</span>
              <span>India · IST UTC+5:30 · Open to Remote</span>
            </div>
          </div>

          <div className="md:col-span-3 contact-form-card">
            <div className="glass-card p-5 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="website" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-display font-medium text-foreground mb-1.5">Name</label>
                    <input id="contact-name" type="text" required maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[rgba(201,168,76,0.02)] border border-[rgba(201,168,76,0.08)] text-foreground text-sm placeholder:text-muted-foreground/25 focus:outline-none focus:ring-2 focus:ring-[rgba(201,168,76,0.3)] focus:border-[rgba(201,168,76,0.15)] transition-all" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-display font-medium text-foreground mb-1.5">Email</label>
                    <input id="contact-email" type="email" required maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[rgba(201,168,76,0.02)] border border-[rgba(201,168,76,0.08)] text-foreground text-sm placeholder:text-muted-foreground/25 focus:outline-none focus:ring-2 focus:ring-[rgba(201,168,76,0.3)] focus:border-[rgba(201,168,76,0.15)] transition-all" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-display font-medium text-foreground mb-1.5">Message</label>
                  <textarea id="contact-message" required maxLength={1000} rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(201,168,76,0.02)] border border-[rgba(201,168,76,0.08)] text-foreground text-sm placeholder:text-muted-foreground/25 focus:outline-none focus:ring-2 focus:ring-[rgba(201,168,76,0.3)] focus:border-[rgba(201,168,76,0.15)] resize-none transition-all" placeholder="Tell me about your project..." />
                </div>
                <button type="submit" disabled={status === "sending"} data-magnetic="true"
                  className="magnetic-target relative overflow-hidden inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#C9A84C] text-[#0A0805] font-display font-semibold text-sm hover:shadow-[0_0_40px_rgba(201,168,76,0.3)] active:scale-[0.96] transition-all disabled:opacity-50"
                  onMouseEnter={(e) => createRipple(e, e.currentTarget, { filled: true })}
                  onMouseLeave={(e) => removeRipple(e.currentTarget.querySelector('.ripple-drop'))}>
                  <span className="relative z-10 flex items-center gap-2"><Send className="w-4 h-4" /> {status === "sending" ? "Sending..." : "Send Message"}</span>
                </button>
                {status === "sent" && <p className="text-sm text-[#C9A84C] font-medium">✓ Message sent!</p>}
                {status === "error" && (
                  <p className="text-sm text-red-400">Failed. Email me at <a href={`mailto:${CONTACT.email}`} className="underline text-[#C9A84C]">{CONTACT.email}</a></p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
