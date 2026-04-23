import { gsap } from "@/lib/gsap";

/**
 * Water-drop ripple effect.
 * Call onMouseEnter with the event and the button element.
 * The ripple originates from the cursor position.
 */
export function createRipple(
  e: React.MouseEvent<HTMLElement> | MouseEvent,
  el: HTMLElement,
  opts: { filled?: boolean } = {}
) {
  const rect = el.getBoundingClientRect();
  const x = (e as MouseEvent).clientX - rect.left;
  const y = (e as MouseEvent).clientY - rect.top;

  const ripple = document.createElement("span");
  ripple.className = "ripple-drop";
  ripple.style.cssText = `
    position: absolute;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: ${opts.filled ? "#C9A84C" : "#C9A84C"};
    transform: translate(-50%, -50%);
    pointer-events: none;
    left: ${x}px;
    top: ${y}px;
    z-index: 0;
  `;
  el.style.position = "relative";
  el.style.overflow = "hidden";
  el.appendChild(ripple);

  const maxDim = Math.max(rect.width, rect.height) * 2.5;
  gsap.fromTo(
    ripple,
    { width: 0, height: 0, opacity: 0.9 },
    {
      width: maxDim,
      height: maxDim,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    }
  );

  return ripple;
}

export function removeRipple(ripple: HTMLElement | null) {
  // Ripples auto-remove now per user request, this is just a fallback stub to not break imports
}
