import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import SystemCard from '../components/SystemCard';
import EnvironmentTable from '../components/EnvironmentTable';
import { getSystemInfo, getEnvironment } from '../services/api';

const CARDS = [
  { key: 'os',   label: 'Operating System',  icon: '💻', extract: (d) => `${d.operatingSystem.type} ${d.operatingSystem.release}` },
  { key: 'ver',  label: 'OS Version',         icon: '🏷️', extract: (d) => d.operatingSystem.version },
  { key: 'cpu',  label: 'CPU',                icon: '⚡', extract: (d) => d.cpu.model },
  { key: 'core', label: 'CPU Cores',          icon: '🧮', extract: (d) => `${d.cpu.cores} cores` },
  { key: 'arch', label: 'Architecture',       icon: '🏗️', extract: (d) => d.cpu.architecture },
  { key: 'host', label: 'Hostname',           icon: '🖥️', extract: (d) => d.hostname },
  { key: 'node', label: 'Node Version',       icon: '🟢', extract: (d) => d.nodeVersion },
  { key: 'plat', label: 'Platform',           icon: '📦', extract: (d) => d.platform },
  { key: 'home', label: 'Home Directory',     icon: '🏠', extract: (d) => d.homeDirectory },
  { key: 'cwd',  label: 'Working Directory',  icon: '📂', extract: (d) => d.currentWorkingDirectory },
  { key: 'up',   label: 'Uptime',             icon: '⏱️', extract: (d) => d.uptime },
];

export default function Dashboard() {
  const [systemData, setSystemData] = useState(null);
  const [envData, setEnvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sys, env] = await Promise.all([getSystemInfo(), getEnvironment()]);
        setSystemData(sys);
        setEnvData(env);
      } catch {
        toast.error('Failed to load system data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-main">System Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Real-time system metrics and environment</p>
      </div>

      {/* System cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {CARDS.map((cfg, i) => (
          <SystemCard
            key={cfg.key}
            icon={cfg.icon}
            label={cfg.label}
            value={systemData ? cfg.extract(systemData) : null}
            delay={i * 30}
          />
        ))}
      </div>

      {/* Memory usage */}
      {systemData && (
        <div className="card p-6 animate-slide-up opacity-0" style={{ animationDelay: '180ms' }}>
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
            Memory Usage
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Bar */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">
                  {systemData.memory.used} / {systemData.memory.total}
                </span>
                <span className="text-sm font-bold text-primary">
                  {systemData.memory.usagePercent}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${systemData.memory.usagePercent}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Total</p>
                <p className="text-sm font-bold text-text-main">{systemData.memory.total}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Used</p>
                <p className="text-sm font-bold text-warning">{systemData.memory.used}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Free</p>
                <p className="text-sm font-bold text-success">{systemData.memory.free}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environment table */}
      <EnvironmentTable data={envData} loading={loading} />
    </div>
  );
}
