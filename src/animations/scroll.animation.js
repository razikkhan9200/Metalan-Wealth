/* animations/scroll.animation.js: application source file. See README.md for the folder responsibility. */
import { gsap, ScrollTrigger } from "./gsap";

export function revealOnScroll(target, trigger = target) {
  return gsap.from(target, {
    y: 70,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start: "top 80%",
      once: true,
    },
  });
}

export { ScrollTrigger };