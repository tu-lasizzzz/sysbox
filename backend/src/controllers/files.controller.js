import * as fileService from '../services/fileService.js';

/**
 * GET /api/files
 */
export async function list(_req, res, next) {
  try {
    const files = await fileService.listFiles();
    res.json({ files, count: files.length });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/files/:name
 */
export async function read(req, res, next) {
  try {
    const file = await fileService.readFile(req.params.name);
    res.json(file);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/files
 */
export async function create(req, res, next) {
  try {
    const { fileName, content } = req.body;
    const file = await fileService.createFile(fileName, content);
    res.status(201).json({ message: `File "${fileName}" created successfully.`, file });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/files/:name
 */
export async function update(req, res, next) {
  try {
    const { content } = req.body;
    const file = await fileService.updateFile(req.params.name, content);
    res.json({ message: `File "${req.params.name}" updated successfully.`, file });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/files/:name
 */
export async function remove(req, res, next) {
  try {
    const result = await fileService.deleteFile(req.params.name);
    res.json({ message: `File "${req.params.name}" deleted successfully.`, ...result });
  } catch (err) {
    next(err);
  }
}
