import getPort from 'get-port';
import logger from './logger.js';

/**
 * Finds an available port starting from the preferred port.
 * Checks preferredPort, then tries sequentially up to +10, then random.
 */
export async function findAvailablePort(preferredPort) {
  // Use getPort to check the preferred port and fallbacks
  const availablePort = await getPort({
    port: [
      preferredPort,
      preferredPort + 1,
      preferredPort + 2,
      preferredPort + 3,
      preferredPort + 4,
    ],
  });

  return availablePort;
}

/**
 * Safely starts the Express server with automatic port recovery.
 */
export async function startServer(app, initialPort, prefix) {
  try {
    const finalPort = await findAvailablePort(initialPort);

    if (finalPort !== initialPort) {
      logger.warn(`Port ${initialPort} is already in use.`);
      logger.info('Automatically searching for another available port...');
      logger.success(`Port ${finalPort} selected.`);
    }

    const server = app.listen(finalPort, () => {
      logger.success(`Server running on http://localhost:${finalPort}`);
      logger.info(`API prefix: ${prefix}`);
      logger.info('Press Ctrl+C to stop.');
    });

    server.on('error', (err) => {
      // If we still hit EADDRINUSE (e.g., race condition), handle gracefully
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${finalPort} is already in use.`);
      } else {
        logger.error('Server error:', err.message);
      }
      process.exit(1);
    });

    return finalPort;
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
}
