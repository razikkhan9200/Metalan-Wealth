/* hooks/useScrollAnimation.js: application source file. See README.md for the folder responsibility. */
import { useLayoutEffect } from "react";

import { gsap } from "../animations/gsap";

/**
 * Creates a scroll-triggered reveal animation.
 *
 * Elements matching the provided selector start slightly
 * below their final position with reduced opacity and
 * animate into view when the referenced section reaches
 * the defined viewport position.
 *
 * @param {React.RefObject} ref - Reference to the scroll trigger container.
 * @param {string} selector - CSS selector for the elements to animate.
 */
export default function useScrollAnimation(
  ref,
  selector = ".reveal"
) {
  useLayoutEffect(() => {
    // Stop execution if the reference element is not available.
    if (!ref?.current) {
      return;
    }

    // Create a GSAP context to scope animations and
    // simplify cleanup when the component unmounts.
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        // Initial vertical position of the elements.
        y: 60,

        // Start the elements as invisible.
        opacity: 0,

        // Duration of the reveal animation.
        duration: 0.9,

        // Delay each element slightly for a staggered effect.
        stagger: 0.1,

        scrollTrigger: {
          // Element that controls the scroll animation.
          trigger: ref.current,

          // Start the animation when the trigger reaches
          // approximately 80% of the viewport height.
          start: "top 80%",
        },
      });
    }, ref);

    // Clean up all GSAP animations and ScrollTrigger
    // instances created inside this context.
    return () => {
      ctx.revert();
    };
  }, [ref, selector]);
}