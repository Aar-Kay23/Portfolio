import { useRef } from "react";
import type { ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that applies the line-reveal animation to all elements
 * matching the selector within the scope container.
 * Wraps each target in overflow:hidden and slides from y:105%.
 */
export function useLineReveal(
  containerRef: React.RefObject<HTMLElement>,
  selector = ".line-reveal-target"
) {
  useGSAP(
    () => {
      const targets = containerRef.current?.querySelectorAll(selector);
      if (!targets?.length) return;

      targets.forEach((el) => {
        gsap.from(el, {
          y: "105%",
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });
    },
    { scope: containerRef }
  );
}

/**
 * Component for line-reveal text — wrap text in this.
 * Usage: <RevealText>Your heading text</RevealText>
 */
export function RevealText({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const inner = ref.current.querySelector(".rv-inner");
      if (!inner) return;

      gsap.from(inner, {
        y: "105%",
        duration: 0.9,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <Tag className="rv-inner block will-change-transform">
        {children}
      </Tag>
    </div>
  );
}