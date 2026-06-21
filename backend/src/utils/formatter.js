/**
 * Formatting utilities for console and JSON output.
 */

/**
 * Convert bytes to a human-readable string (e.g. "8.00 GB").
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || bytes == null) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format seconds to a human-readable uptime string.
 * @param {number} seconds
 * @returns {string}
 */
export function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

/**
 * Print system information in a structured console table.
 * @param {object} systemInfo
 * @param {object} envVars
 */
export function formatConsoleOutput(systemInfo, envVars) {
  const PAD = 20;

  const lines = [];
  lines.push('');
  lines.push('='.repeat(50));
  lines.push('  SYSTEM INFORMATION');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`  ${'Operating System'.padEnd(PAD)} : ${systemInfo.operatingSystem.type}`);
  lines.push(`  ${'OS Release'.padEnd(PAD)} : ${systemInfo.operatingSystem.release}`);
  lines.push(`  ${'OS Version'.padEnd(PAD)} : ${systemInfo.operatingSystem.version}`);
  lines.push(`  ${'Architecture'.padEnd(PAD)} : ${systemInfo.cpu.architecture}`);
  lines.push(`  ${'CPU Model'.padEnd(PAD)} : ${systemInfo.cpu.model}`);
  lines.push(`  ${'CPU Cores'.padEnd(PAD)} : ${systemInfo.cpu.cores}`);
  lines.push(`  ${'Hostname'.padEnd(PAD)} : ${systemInfo.hostname}`);
  lines.push(`  ${'Node Version'.padEnd(PAD)} : ${systemInfo.nodeVersion}`);
  lines.push(`  ${'Platform'.padEnd(PAD)} : ${systemInfo.platform}`);
  lines.push(`  ${'Home Directory'.padEnd(PAD)} : ${systemInfo.homeDirectory}`);
  lines.push(`  ${'Working Directory'.padEnd(PAD)} : ${systemInfo.currentWorkingDirectory}`);
  lines.push(`  ${'Uptime'.padEnd(PAD)} : ${systemInfo.uptime}`);
  lines.push(`  ${'Total Memory'.padEnd(PAD)} : ${systemInfo.memory.total}`);
  lines.push(`  ${'Free Memory'.padEnd(PAD)} : ${systemInfo.memory.free}`);
  lines.push('');
  lines.push('='.repeat(50));
  lines.push('  ENVIRONMENT VARIABLES');
  lines.push('='.repeat(50));
  lines.push('');

  for (const [key, value] of Object.entries(envVars)) {
    const display = value.length > 60 ? value.substring(0, 57) + '...' : value;
    lines.push(`  ${key.padEnd(PAD)} : ${display}`);
  }

  lines.push('');
  lines.push('='.repeat(50));
  return lines.join('\n');
}
