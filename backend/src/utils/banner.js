const COLORS = {
  reset: '\x1b[0m',
  orange: '\x1b[38;5;214m',
  white: '\x1b[37m',
  brightWhite: '\x1b[97m',
  gray: '\x1b[90m',
};

const BANNER_TEXT = `
███████╗██╗   ██╗███████╗██████╗  ██████╗ ██╗  ██╗
██╔════╝╚██╗ ██╔╝██╔════╝██╔══██╗██╔═══██╗╚██╗██╔╝
███████╗ ╚████╔╝ ███████╗██████╔╝██║   ██║ ╚███╔╝
╚════██║  ╚██╔╝  ╚════██║██╔══██╗██║   ██║ ██╔██╗
███████║   ██║   ███████║██████╔╝╚██████╔╝██╔╝ ██╗
╚══════╝   ╚═╝   ╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝`;

function centerText(text, width) {
  const lines = text.split('\n');
  return lines.map((line) => {
    // Strip ANSI codes to get visual length
    const visualLength = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    if (visualLength >= width) return line;
    const padding = Math.floor((width - visualLength) / 2);
    return ' '.repeat(padding > 0 ? padding : 0) + line;
  }).join('\n');
}

export function printBanner() {
  const termWidth = process.stdout.columns || 80;

  // Render the ASCII art in orange
  const coloredBanner = BANNER_TEXT.split('\n')
    .map(line => `${COLORS.orange}${line}${COLORS.reset}`)
    .join('\n');

  console.log(centerText(coloredBanner, termWidth));
  console.log('');
  
  // Title
  const title = `${COLORS.orange}𝙎𝙔𝙎𝘽𝙊𝙓${COLORS.reset}\n${COLORS.brightWhite}Inspect • Manage • Build${COLORS.reset}`;
  console.log(centerText(title, termWidth));
  console.log('');
  
  // Subtitle
  const subtitle = `${COLORS.brightWhite}System Information • Environment Inspector • Workspace Manager${COLORS.reset}\n${COLORS.gray}Version: v1.0.0${COLORS.reset}`;
  console.log(centerText(subtitle, termWidth));
  console.log('');
}
