/**
 * In-memory admin session store.
 * The admin password is NEVER persisted to storage — it only lives in memory for the current page session.
 * On page reload the user must re-enter the password (they are prompted because isAuthenticated flag
 * in sessionStorage is cleared on logout, and the password itself is never stored).
 */

let _adminPassword = '';

export function setAdminPassword(pw: string): void {
  _adminPassword = pw;
}

export function getAdminPassword(): string {
  return _adminPassword;
}

export function clearAdminPassword(): void {
  _adminPassword = '';
}
