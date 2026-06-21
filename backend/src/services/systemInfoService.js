import os from 'os';
import { formatBytes, formatUptime } from '../utils/formatter.js';

/**
 * Safely execute a function and return a fallback on failure.
 * @param {Function} fn
 * @param {*} fallback
 */
function safe(fn, fallback = 'Not Available') {
  try {
    const result = fn();
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Collect comprehensive system information.
 * Every field is individually wrapped so one failure never crashes the whole response.
 * @returns {object}
 */
export function getSystemInfo() {
  const cpus = safe(() => os.cpus(), []);
  const totalMem = safe(() => os.totalmem(), 0);
  const freeMem = safe(() => os.freemem(), 0);

  return {
    operatingSystem: {
      type: safe(() => os.type()),
      release: safe(() => os.release()),
      version: safe(() => os.version()),
    },
    cpu: {
      architecture: safe(() => os.arch()),
      model: safe(() => (Array.isArray(cpus) && cpus.length > 0 ? cpus[0].model : 'Not Available')),
      cores: safe(() => (Array.isArray(cpus) ? cpus.length : 'Not Available')),
    },
    hostname: safe(() => os.hostname()),
    nodeVersion: safe(() => process.version),
    platform: safe(() => process.platform),
    homeDirectory: safe(() => os.homedir()),
    currentWorkingDirectory: safe(() => process.cwd()),
    uptime: safe(() => formatUptime(os.uptime())),
    memory: {
      total: safe(() => formatBytes(totalMem)),
      free: safe(() => formatBytes(freeMem)),
      used: safe(() => formatBytes(totalMem - freeMem)),
      totalBytes: totalMem,
      freeBytes: freeMem,
      usedBytes: totalMem - freeMem,
      usagePercent: safe(() =>
        totalMem > 0 ? parseFloat((((totalMem - freeMem) / totalMem) * 100).toFixed(1)) : 0,
      ),
    },
  };
}
