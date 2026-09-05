/* hooks/useLenis.js: application source file. See README.md for the folder responsibility. */
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initializes smooth scrolling using Lenis.
 *
 * The Lenis animation loop is connected to the browser's
 * requestAnimationFrame cycle to provide smooth and
 * consistent scrolling performance.
 *
 * Configuration:
 * - duration: Controls the smooth scroll animation duration.
 * - smoothWheel: Enables smooth scrolling for mouse wheel input.
 * - smoothTouch: Disabled to preserve native touch scrolling.
 */
export default function useLenis() {
  useEffect(() => {
    // Create a Lenis smooth scrolling instance.
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    });

    let frameId;

    /**
     * Updates the Lenis animation on every animation frame.
     *
     * @param {number} time - Current animation frame timestamp.
     */
    const raf = (time) => {
      lenis.raf(time);

      frameId = requestAnimationFrame(raf);
    };

    // Start the animation loop.
    frameId = requestAnimationFrame(raf);

    // Clean up the animation frame and Lenis instance
    // when the component using this hook is unmounted.
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);
}