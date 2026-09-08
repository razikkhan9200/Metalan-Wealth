/* services/userService.js: application source file.
 * Profile-related API calls, built on top of services/api.js's
 * get/put helpers (which already attach the auth token and throw
 * real Errors on non-2xx responses).
 */

import { get, put } from "../services/Api";

/**
 * Fetches the current logged-in user's profile.
 *
 * @returns {Promise<object>} the profile object (fullName, email, phone, etc.)
 */
export function getProfile() {
  return get("/users/me");
}

/**
 * Updates the current logged-in user's profile.
 *
 * @param {object} fields - editable fields, e.g. { fullName, email, phone, dateOfBirth, country }
 * @returns {Promise<object>} the updated profile object
 */
export function updateProfile(fields) {
  return put("/users/me", fields);
}

/**
 * TODO: Uploading an avatar needs a multipart/form-data request
 * (not JSON), so it can't reuse api.js's request() as-is — that
 * function always sends Content-Type: application/json and
 * JSON.stringify()'s the body. This will need either:
 *   - a separate fetch() call here that sends FormData directly, or
 *   - a small option added to api.js's request() to skip the
 *     JSON content-type/stringify step when the body is a FormData.
 * Left unimplemented for now; UserProfilePanel only previews the
 * chosen image locally (see handleAvatarChange) until this exists.
 */
// export function uploadAvatar(file) { ... }