import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import FilesPage from './pages/FilesPage';
import JsonViewer from './pages/JsonViewer';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🟧' },
  { to: '/files', label: 'Files', icon: '📁' },
  { to: '/json', label: 'JSON Export', icon: '📄' },
];

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg flex">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-card !text-text-main !border !border-border !rounded-lg !shadow-sm',
          duration: 3000,
        }}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-56 bg-sidebar border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            🟧 SYSBOX
          </h1>
          <p className="text-xs text-text-muted mt-0.5">System Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary -ml-px'
                    : 'text-text-muted hover:text-text-main hover:bg-border/50'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-text-muted">v1.0.0 · Developer Utility</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-sidebar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-border text-text-muted"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-bold text-text-main">
            🟧 SYSBOX
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/json" element={<JsonViewer />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
