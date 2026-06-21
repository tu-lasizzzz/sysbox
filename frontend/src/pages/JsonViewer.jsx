import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSystemInfo, getEnvironment } from '../services/api';

export default function JsonViewer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sys, env] = await Promise.all([getSystemInfo(), getEnvironment()]);
        setData({ system: sys, environment: env });
      } catch {
        toast.error('Failed to load JSON data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sysbox-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-main">JSON Export</h1>
        <p className="text-text-muted text-sm mt-1">System report — download or copy</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 animate-fade-in">
        <button id="download-json-btn" onClick={handleDownload} disabled={!data} className="btn-primary">
          ↓ Download
        </button>
        <button onClick={handleCopy} disabled={!data} className="btn-ghost">
          ⎘ Copy JSON
        </button>
      </div>

      {/* JSON */}
      <div className="card p-5 animate-slide-up opacity-0" style={{ animationDelay: '80ms' }}>
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton h-4 rounded" style={{ width: `${50 + Math.random() * 50}%` }} />
            ))}
          </div>
        ) : (
          <pre className="font-mono text-xs leading-relaxed text-text-main overflow-x-auto whitespace-pre">
            <JsonHighlight json={JSON.stringify(data, null, 2)} />
          </pre>
        )}
      </div>
    </div>
  );
}

/**
 * Minimal JSON syntax highlighter.
 */
function JsonHighlight({ json }) {
  const parts = json.split(/("(?:[^"\\]|\\.)*")/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('"') && part.endsWith('"')) {
          const rest = parts.slice(i + 1).join('');
          const isKey = /^\s*:/.test(rest);
          return (
            <span key={i} className={isKey ? 'text-primary' : 'text-success'}>
              {part}
            </span>
          );
        }

        const highlighted = part.replace(
          /\b(true|false|null|\d+\.?\d*)\b/g,
          (match) => {
            if (match === 'true' || match === 'false')
              return `<span class="text-purple-400">${match}</span>`;
            if (match === 'null')
              return `<span class="text-danger">${match}</span>`;
            return `<span class="text-warning">${match}</span>`;
          },
        );
        return <span key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />;
      })}
    </>
  );
}
