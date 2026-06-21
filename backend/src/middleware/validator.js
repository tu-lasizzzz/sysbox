import path from 'path';
import { AppError } from './errorHandler.js';
import { WORKSPACE_DIR } from '../config/constants.js';

/**
 * Validate that a file name is safe and resolves inside the workspace.
 * @param {string} fileName
 * @throws {AppError} if the name is invalid or escapes the workspace
 */
export function assertSafeFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    throw new AppError('File name is required.', 400);
  }

  // Reject null bytes
  if (fileName.includes('\0')) {
    throw new AppError('File name contains invalid characters.', 400);
  }

  // Reject path traversal patterns
  if (fileName.includes('..') || fileName.includes('~')) {
    throw new AppError('Path traversal is not allowed.', 403);
  }

  // Reject absolute paths
  if (path.isAbsolute(fileName)) {
    throw new AppError('Absolute paths are not allowed.', 403);
  }

  // Reject slashes (only flat files allowed in workspace)
  if (fileName.includes('/') || fileName.includes('\\')) {
    throw new AppError('Subdirectory paths are not allowed.', 403);
  }

  // Resolve and verify the path stays inside the workspace
  const resolved = path.resolve(WORKSPACE_DIR, fileName);
  if (!resolved.startsWith(WORKSPACE_DIR)) {
    throw new AppError('Access denied — path is outside the workspace.', 403);
  }

  return resolved;
}

/**
 * Express middleware: validate the `:name` route parameter.
 */
export function validateFileName(req, _res, next) {
  try {
    const name = req.params.name;
    assertSafeFileName(name);
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Express middleware: validate POST/PUT body for file creation / update.
 */
export function validateFileBody(req, _res, next) {
  try {
    const { fileName, content } = req.body;

    // For POST (create), fileName is required in the body
    if (req.method === 'POST') {
      assertSafeFileName(fileName);
    }

    if (content === undefined || content === null) {
      throw new AppError('File content is required.', 400);
    }

    if (typeof content !== 'string') {
      throw new AppError('File content must be a string.', 400);
    }

    next();
  } catch (err) {
    next(err);
  }
}
