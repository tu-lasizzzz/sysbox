/**
 * Lightweight colored console logger.
 * No external dependencies — uses ANSI escape codes.
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info(message, ...args) {
    console.log(
      `${COLORS.gray}[${timestamp()}]${COLORS.reset} ${COLORS.blue}ℹ INFO${COLORS.reset}  ${message}`,
      ...args,
    );
  },

  success(message, ...args) {
    console.log(
      `${COLORS.gray}[${timestamp()}]${COLORS.reset} ${COLORS.green}✓ OK${COLORS.reset}    ${message}`,
      ...args,
    );
  },

  warn(message, ...args) {
    console.warn(
      `${COLORS.gray}[${timestamp()}]${COLORS.reset} ${COLORS.yellow}⚠ WARNING${COLORS.reset} ${message}`,
      ...args,
    );
  },

  error(message, ...args) {
    console.error(
      `${COLORS.gray}[${timestamp()}]${COLORS.reset} ${COLORS.red}✖ ERROR${COLORS.reset} ${message}`,
      ...args,
    );
  },

  /** Print a plain divider line */
  divider(char = '=', length = 50) {
    console.log(char.repeat(length));
  },

  /** Print a section header */
  header(title) {
    console.log('');
    this.divider();
    console.log(`${COLORS.bright}${COLORS.cyan}  ${title}${COLORS.reset}`);
    this.divider();
  },

  /** Print a key → value row (padded) */
  row(key, value, pad = 20) {
    console.log(`  ${key.padEnd(pad)} : ${value}`);
  },
};

export default logger;
