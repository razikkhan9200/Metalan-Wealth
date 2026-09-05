/* hooks/useParallax.js: application source file. See README.md for the folder responsibility. */
import { useLayoutEffect } from "react";

import { gsap, ScrollTrigger } from "../animations/gsap";

/**
 * Creates a scroll-based parallax animation for a target element.
 *
 * The selected element moves vertically while the user scrolls
 * through the section referenced by `ref`.
 *
 * @param {React.RefObject} ref - Reference to the scroll trigger container.
 * @param {string} selector - CSS selector for the element to animate.
 * @param {number} distance - Maximum vertical parallax distance.
 */
export default function useParallax(
  ref,
  selector,
  distance = 120
) {
  useLayoutEffect(() => {
    // Stop execution if the reference element is not available.
    if (!ref?.current) {
      return;
    }

    // Create a GSAP context so all animations can be
    // automatically cleaned up when the component unmounts.
    const ctx = gsap.context(() => {
      gsap.to(selector, {
        // Move the target element upward during scrolling.
        y: -distance,

        // Disable easing for a smooth scroll-linked animation.
        ease: "none",

        scrollTrigger: {
          // Element that controls the ScrollTrigger animation.
          trigger: ref.current,

          // Start when the trigger enters the viewport.
          start: "top bottom",

          // End when the trigger leaves the viewport.
          end: "bottom top",

          // Synchronize animation progress with scroll position.
          scrub: true,
        },
      });
    }, ref);

    // Revert the GSAP context and clean up all animations
    // and ScrollTrigger instances created inside it.
    return () => {
      ctx.revert();
    };
  }, [ref, selector, distance]);
}