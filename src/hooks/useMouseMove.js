/* hooks/useMouseMove.js: application source file. See README.md for the folder responsibility. */
import { useEffect } from "react";

import { gsap } from "../animations/gsap";

/**
 * Adds a mouse-based 3D tilt effect to a selected element.
 *
 * The element rotates according to the user's mouse position
 * relative to the viewport center.
 *
 * @param {string} selector - CSS selector used to find the target element.
 * @param {number} intensity - Controls the amount of 3D rotation.
 */
export default function useMouseMove(selector, intensity = 12) {
  useEffect(() => {
    // Find the target element using the provided selector.
    const element = document.querySelector(selector);

    // Stop execution if the target element does not exist.
    if (!element) {
      return;
    }

    /**
     * Handles mouse movement and calculates the
     * corresponding 3D rotation values.
     *
     * @param {MouseEvent} event - Browser mouse movement event.
     */
    const onMove = (event) => {
      // Convert mouse position into a centered value.
      const x =
        (event.clientX / window.innerWidth - 0.5) * intensity;

      const y =
        (event.clientY / window.innerHeight - 0.5) * intensity;

      // Animate the target element toward the calculated rotation.
      gsap.to(element, {
        rotateY: x,
        rotateX: -y,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    // Listen for mouse movement across the window.
    window.addEventListener("mousemove", onMove);

    // Remove the event listener when the component unmounts
    // or when selector/intensity changes.
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [selector, intensity]);
}