import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── System ──────────────────────────────────────────────────────────
export const getSystemInfo = () => api.get('/system').then((r) => r.data);

// ─── Environment ─────────────────────────────────────────────────────
export const getEnvironment = () => api.get('/environment').then((r) => r.data.data);

// ─── Files ───────────────────────────────────────────────────────────
export const listFiles = () => api.get('/files').then((r) => r.data);

export const readFile = (name) =>
  api.get(`/files/${encodeURIComponent(name)}`).then((r) => r.data);

export const createFile = (fileName, content) =>
  api.post('/files', { fileName, content }).then((r) => r.data);

export const updateFile = (name, content) =>
  api.put(`/files/${encodeURIComponent(name)}`, { content }).then((r) => r.data);

export const deleteFile = (name) =>
  api.delete(`/files/${encodeURIComponent(name)}`).then((r) => r.data);

// ─── Health ──────────────────────────────────────────────────────────
export const healthCheck = () => api.get('/health').then((r) => r.data);

export default api;
