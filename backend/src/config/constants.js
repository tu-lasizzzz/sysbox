import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Server port — override with PORT env var */
export const PORT = process.env.PORT || 3001;

/** API route prefix */
export const API_PREFIX = '/api';

/** Absolute path to the sandboxed workspace directory */
export const WORKSPACE_DIR = path.resolve(__dirname, '..', '..', 'workspace');

/** Only these environment variables are exposed through the API */
export const ALLOWED_ENV_VARS = [
  'PATH',
  'HOME',
  'USERNAME',
  'USERPROFILE',
  'SHELL',
  'NODE_ENV',
];
