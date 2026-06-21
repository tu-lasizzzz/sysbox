import { getEnvironmentInfo } from '../services/envService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Handles GET /api/environment
 */
export async function getEnvironment(req, res, next) {
  try {
    const vars = getEnvironmentInfo();
    res.json({ success: true, data: vars });
  } catch (err) {
    next(err);
  }
}
