import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Searchable environment variables table — dark theme.
 */
export default function EnvironmentTable({ data, loading }) {
  const [search, setSearch] = useState('');

  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-5 w-44 mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-10 w-full mb-2" />
        ))}
      </div>
    );
  }

  const entries = Object.entries(data || {}).filter(
    ([key, value]) =>
      key.toLowerCase().includes(search.toLowerCase()) ||
      value.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value).then(() => {
      toast.success(`Copied ${key}`);
    });
  };

  return (
    <div className="card p-6 animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
          Environment Variables
        </h2>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="env-search"
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 !w-full sm:!w-56"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg">
              <th className="text-left px-4 py-2.5 font-medium text-text-muted text-xs uppercase tracking-wider">
                Variable
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-text-muted text-xs uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-2.5 w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-text-muted text-sm">
                  No matching variables.
                </td>
              </tr>
            ) : (
              entries.map(([key, value]) => (
                <tr
                  key={key}
                  className="hover:bg-bg/50 transition-colors"
                >
                  <td className="px-4 py-2.5 font-mono font-medium text-primary text-xs">
                    {key}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted max-w-sm truncate font-mono text-xs" title={value}>
                    {value}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => handleCopy(key, value)}
                      className="p-1 rounded hover:bg-border transition-colors"
                      title="Copy"
                    >
                      <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
