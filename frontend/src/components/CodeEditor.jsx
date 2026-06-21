import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

/**
 * Dark-themed code editor with save.
 */
export default function CodeEditor({ fileName, onSaved }) {
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!fileName) return;
    setLoading(true);
    api
      .readFile(fileName)
      .then((data) => {
        setContent(data.content);
        setOriginalContent(data.content);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to read file.');
      })
      .finally(() => setLoading(false));
  }, [fileName]);

  const hasChanges = content !== originalContent;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateFile(fileName, content);
      setOriginalContent(content);
      toast.success(`Saved "${fileName}"`);
      onSaved?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (hasChanges) handleSave();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      });
    }
  };

  if (!fileName) {
    return (
      <div className="card h-full flex items-center justify-center p-6">
        <div className="text-center text-text-muted">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-sm">Select a file to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-main font-mono">{fileName}</span>
          {hasChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-warning" title="Unsaved changes" />
          )}
        </div>
        <button
          id="save-file-btn"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="btn-primary !py-1 !px-3 !text-xs"
        >
          {saving ? 'Saving…' : 'Save'}
          <span className="ml-1 opacity-50 text-[10px]">⌘S</span>
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <textarea
            id="code-editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 resize-none bg-transparent font-mono text-sm leading-relaxed text-text-main focus:outline-none placeholder-text-muted/30"
            placeholder="Start typing…"
            spellCheck={false}
          />
        )}
      </div>

      {/* Status bar */}
      <div className="px-4 py-1.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-mono">
        <span>{content.split('\n').length} lines</span>
        <span>{content.length} chars</span>
      </div>
    </div>
  );
}
