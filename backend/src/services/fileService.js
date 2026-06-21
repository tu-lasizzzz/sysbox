import fs from 'fs/promises';
import path from 'path';
import { WORKSPACE_DIR } from '../config/constants.js';
import { AppError } from '../middleware/errorHandler.js';
import { assertSafeFileName } from '../middleware/validator.js';

/**
 * Ensure the workspace directory exists. Called once at server start.
 */
export async function initWorkspace() {
  await fs.mkdir(WORKSPACE_DIR, { recursive: true });
}

/**
 * List all files in the workspace with metadata.
 * @returns {Promise<Array<{name: string, size: number, modified: string}>>}
 */
export async function listFiles() {
  await initWorkspace();
  const entries = await fs.readdir(WORKSPACE_DIR, { withFileTypes: true });

  const files = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = path.join(WORKSPACE_DIR, entry.name);
    const stat = await fs.stat(filePath);
    files.push({
      name: entry.name,
      size: stat.size,
      modified: stat.mtime.toISOString(),
    });
  }

  return files;
}

/**
 * Read a file from the workspace.
 * @param {string} fileName
 * @returns {Promise<{name: string, content: string, size: number, modified: string}>}
 */
export async function readFile(fileName) {
  const filePath = assertSafeFileName(fileName);

  try {
    await fs.access(filePath);
  } catch {
    throw new AppError(`File "${fileName}" does not exist.`, 404);
  }

  const content = await fs.readFile(filePath, 'utf-8');
  const stat = await fs.stat(filePath);

  return {
    name: fileName,
    content,
    size: stat.size,
    modified: stat.mtime.toISOString(),
  };
}

/**
 * Create a new file in the workspace.
 * @param {string} fileName
 * @param {string} content
 * @returns {Promise<{name: string, size: number, created: string}>}
 */
export async function createFile(fileName, content) {
  const filePath = assertSafeFileName(fileName);
  await initWorkspace();

  // Prevent overwriting existing files
  try {
    await fs.access(filePath);
    throw new AppError(`File "${fileName}" already exists. Use PUT to update.`, 409);
  } catch (err) {
    if (err instanceof AppError) throw err;
    // File doesn't exist — good, proceed
  }

  await fs.writeFile(filePath, content, 'utf-8');
  const stat = await fs.stat(filePath);

  return {
    name: fileName,
    size: stat.size,
    created: stat.birthtime.toISOString(),
  };
}

/**
 * Update (overwrite) an existing file in the workspace.
 * @param {string} fileName
 * @param {string} content
 * @returns {Promise<{name: string, size: number, modified: string}>}
 */
export async function updateFile(fileName, content) {
  const filePath = assertSafeFileName(fileName);

  try {
    await fs.access(filePath);
  } catch {
    throw new AppError(`File "${fileName}" does not exist.`, 404);
  }

  await fs.writeFile(filePath, content, 'utf-8');
  const stat = await fs.stat(filePath);

  return {
    name: fileName,
    size: stat.size,
    modified: stat.mtime.toISOString(),
  };
}

/**
 * Delete a file from the workspace.
 * @param {string} fileName
 * @returns {Promise<{name: string, deleted: boolean}>}
 */
export async function deleteFile(fileName) {
  const filePath = assertSafeFileName(fileName);

  try {
    await fs.access(filePath);
  } catch {
    throw new AppError(`File "${fileName}" does not exist.`, 404);
  }

  await fs.unlink(filePath);

  return { name: fileName, deleted: true };
}
