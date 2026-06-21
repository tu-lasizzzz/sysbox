import { useState } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

/**
 * File Explorer — dark theme, clean layout.
 */
export default function FileExplorer({ files, loading, onFileSelect, selectedFile, onRefresh }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async () => {
    if (!newFileName.trim()) {
      toast.error('File name is required.');
      return;
    }
    setCreating(true);
    try {
      await api.createFile(newFileName.trim(), '');
      toast.success(`Created "${newFileName.trim()}"`);
      setNewFileName('');
      setShowCreate(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create file.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteFile(deleteTarget);
      toast.success(`Deleted "${deleteTarget}"`);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete file.');
    } finally {
      setDeleting(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="card p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Files</h2>
        <div className="flex items-center gap-1.5">
          <button onClick={onRefresh} className="btn-ghost !p-1.5 !rounded-md" title="Refresh">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            id="create-file-btn"
            onClick={() => setShowCreate(!showCreate)}
            className="btn-primary !py-1.5 !px-2.5 !text-xs"
          >
            + New
          </button>
        </div>
      </div>

      {/* Create file form */}
      {showCreate && (
        <div className="flex gap-2 mb-3 px-1 animate-fade-in">
          <input
            id="new-file-name"
            type="text"
            placeholder="filename.js"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="input-field flex-1 !py-1.5 !text-xs"
            autoFocus
          />
          <button onClick={handleCreate} disabled={creating} className="btn-primary !py-1.5 !px-3 !text-xs">
            {creating ? '…' : 'Add'}
          </button>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" />
          ))
        ) : files.length === 0 ? (
          <div className="text-center py-10 text-text-muted">
            <p className="text-2xl mb-1">📂</p>
            <p className="text-xs">No files yet</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.name}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 group ${
                selectedFile === file.name
                  ? 'bg-primary/10 border-l-2 border-primary -ml-px'
                  : 'hover:bg-border/50'
              }`}
              onClick={() => onFileSelect(file.name)}
            >
              <svg className={`w-4 h-4 flex-shrink-0 ${selectedFile === file.name ? 'text-primary' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${selectedFile === file.name ? 'text-primary' : 'text-text-main'}`}>
                  {file.name}
                </p>
                <p className="text-[10px] text-text-muted">
                  {formatSize(file.size)}
                </p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(file.name); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger/20 transition-all"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
          <div className="card p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold text-text-main mb-2">Delete File</h3>
            <p className="text-sm text-text-muted mb-5">
              Delete <strong className="text-text-main">"{deleteTarget}"</strong>? This can't be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost" disabled={deleting}>
                Cancel
              </button>
              <button id="confirm-delete-btn" onClick={handleDelete} disabled={deleting} className="btn-danger">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
