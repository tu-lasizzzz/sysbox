import path from 'path';

function safeValue(value) {
  return value ?? "Not Available";
}

function getMaskedPath(pathStr) {
  if (!pathStr) return '[Hidden for privacy] (0 entries)';
  const count = pathStr.split(path.delimiter).length;
  return `[Hidden for privacy] (${count} entries)`;
}

/**
 * Retrieve environment variables with platform-aware fallbacks.
 * @returns {object}
 */
export function getEnvironmentInfo() {
  return {
    PATH: getMaskedPath(process.env.PATH),
    HOME: safeValue(process.env.HOME || process.env.USERPROFILE),
    USERNAME: safeValue(process.env.USERNAME || process.env.USER),
    USERPROFILE: safeValue(process.env.USERPROFILE),
    SHELL: safeValue(process.env.SHELL || process.env.ComSpec),
    NODE_ENV: process.env.NODE_ENV || "Not Set"
  };
}
