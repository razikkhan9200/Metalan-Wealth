/**
 * Combines multiple CSS class names into a single string.
 *
 * Removes any falsy values such as:
 * - false
 * - null
 * - undefined
 * - empty strings
 *
 * Useful for conditionally applying Tailwind CSS classes.
 *
 * @param {...(string|false|null|undefined)} classes - CSS class names
 * @returns {string} A single space-separated class name string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}