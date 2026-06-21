import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { PORT, API_PREFIX } from './config/constants.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initWorkspace } from './services/fileService.js';
import { getSystemInfo } from './services/systemInfoService.js';
import { getEnvironmentInfo } from './services/envService.js';
import { formatConsoleOutput } from './utils/formatter.js';
import logger from './utils/logger.js';

import systemRoutes from './routes/system.routes.js';
import envRoutes from './routes/env.routes.js';
import filesRoutes from './routes/files.routes.js';

// ─── CLI Mode: --json ────────────────────────────────────────────────
if (process.argv.includes('--json')) {
  const output = {
    system: getSystemInfo(),
    environment: getEnvironmentInfo(),
  };
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

// ─── Console Output ──────────────────────────────────────────────────
import { printBanner } from './utils/banner.js';
printBanner();

const systemInfo = getSystemInfo();
const envVars = getEnvironmentInfo();
console.log(formatConsoleOutput(systemInfo, envVars));

// ─── Express Server ──────────────────────────────────────────────────
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Routes
app.use(`${API_PREFIX}/system`, systemRoutes);
app.use(`${API_PREFIX}/environment`, envRoutes);
app.use(`${API_PREFIX}/files`, filesRoutes);

// Health check
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

import { startServer } from './utils/portManager.js';

// ─── Start ───────────────────────────────────────────────────────────
async function start() {
  try {
    await initWorkspace();
    logger.success('Workspace directory initialised.');

    await startServer(app, PORT, API_PREFIX);
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
