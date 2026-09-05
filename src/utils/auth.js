/**
 * Temporary client-side authentication session utility.
 *
 * Stores and manages the user's access token in localStorage.
 * This implementation is intended for frontend development only
 * and should be replaced with real API-based authentication
 * when the backend authentication system is integrated.
 */

/**
 * Storage key used to store the authenticated user's access token.
 *
 * @constant {string}
 */
const KEY = "metalan_access_token";

/**
 * Checks whether an active authentication session exists.
 *
 * @returns {boolean} True when an access token exists, otherwise false.
 */
export const isAuthenticated = () =>
  Boolean(localStorage.getItem(KEY));

/**
 * Creates or updates the client-side authentication session.
 *
 * @param {string} token - Access token received from the authentication API.
 * @returns {void}
 */
export const setAuthSession = (token = "demo-access-token") =>
  localStorage.setItem(KEY, token);

/**
 * Clears the current authentication session.
 *
 * Removes the stored access token from localStorage.
 *
 * @returns {void}
 */
export const clearAuthSession = () =>
  localStorage.removeItem(KEY);