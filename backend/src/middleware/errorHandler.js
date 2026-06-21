/**
 * Custom application error class.
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

/**
 * Global Express error-handling middleware.
 * Must have 4 parameters so Express recognises it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error server-side
  console.error(`[ERROR] ${statusCode} — ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    statusCode,
  });
}
