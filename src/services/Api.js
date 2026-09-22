/* services/api.js: application source file. Core HTTP functions — get, post, put, delete.
 *
 * EXAMPLE USAGE (from any component or another service file):
 *
 *   import { get, post, put, del } from "../services/api";
 *
 *   // GET — fetch a list
 *   const properties = await get("/properties");
 *
 *   // GET — fetch one item
 *   const property = await get("/properties/marina-bay");
 *
 *   // POST — create something / log in
 *   const { token } = await post("/auth/login", {
 *     email: "user@example.com",
 *     password: "secret123",
 *   });
 *
 *   // PUT — update something
 *   const updatedProfile = await put("/users/me", {
 *     fullName: "Alexander Mitchell",
 *     phone: "+1 (555) 234-5678",
 *   });
 *
 *   // DELETE — remove something
 *   await del("/wallet/transactions/123");
 *
 *   // Every call above already sends the stored token automatically as
 *   // "Authorization: Bearer <token>" — nothing extra to pass in.
 *
 *   // Errors: a non-2xx response throws a real Error, so use try/catch
 *   // instead of checking response.ok yourself:
 *   try {
 *     await post("/auth/login", { email, password });
 *   } catch (err) {
 *     console.log(err.message);  // e.g. "Invalid credentials"
 *     console.log(err.status);   // e.g. 401
 *   }
 */
import { getToken, clearAuthSession } from "../utils/auth";

// Falls back to the same default as .env.example if VITE_API_BASE_URL
// isn't set, so the app doesn't silently call a blank/relative URL in
// a misconfigured environment.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Every request funnels through here. Centralizing this is what makes
 * two things automatic for every call, with nothing for get/post/put/
 * delete below to repeat:
 * 1. The stored auth token is attached as `Authorization: Bearer …`
 *    whenever one exists — this is the "send token in header" part.
 * 2. Non-2xx responses throw a real `Error` (with `.status` and
 *    `.data` attached) instead of resolving successfully, so callers
 *    can use ordinary try/catch instead of checking `response.ok`
 *    themselves every time.
 *
 * @param {string} path - endpoint path, e.g. "/users/me"
 * @param {{ method?: string, body?: any, headers?: object }} [options]
 * @returns {Promise<any>} parsed JSON (or raw text if the response isn't JSON)
 */
async function request(path, { method = "GET", body, headers, ...rest } = {}) {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  // Read the body once, in whatever shape the server actually sent —
  // some error responses are plain text, not JSON.
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : await response.text();

  // A 401 means the stored token is missing/expired/invalid. Clearing
  // the session here means every call site gets this behavior for
  // free, instead of every page needing its own 401-handling logic.
  if (response.status === 401) {
    clearAuthSession();
  }

  if (!response.ok) {
    const message =
      (isJson && data && (data.message || data.error)) ||
      response.statusText ||
      "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * GET request.
 *
 * @param {string} path - e.g. "/properties"
 * @param {object} [options] - extra fetch options (headers, etc.)
 * @returns {Promise<any>}
 */
export function get(path, options) {
  return request(path, { ...options, method: "GET" });
}

/**
 * POST request.
 *
 * @param {string} path - e.g. "/auth/login"
 * @param {object} [body] - JSON-serializable request payload
 * @param {object} [options] - extra fetch options (headers, etc.)
 * @returns {Promise<any>}
 */
export function post(path, body, options) {
  return request(path, { ...options, method: "POST", body });
}

/**
 * PUT request.
 *
 * @param {string} path - e.g. "/users/me"
 * @param {object} [body] - JSON-serializable request payload
 * @param {object} [options] - extra fetch options (headers, etc.)
 * @returns {Promise<any>}
 */
export function put(path, body, options) {
  return request(path, { ...options, method: "PUT", body });
}

/**
 * DELETE request.
 *
 * @param {string} path - e.g. "/wallet/transactions/123"
 * @param {object} [options] - extra fetch options (headers, etc.)
 * @returns {Promise<any>}
 */
export function del(path, options) {
  return request(path, { ...options, method: "DELETE" });
}