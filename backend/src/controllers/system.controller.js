import { getSystemInfo } from '../services/systemInfoService.js';

/**
 * GET /api/system
 */
export function getSystem(_req, res, next) {
  try {
    const info = getSystemInfo();
    res.json(info);
  } catch (err) {
    next(err);
  }
}
