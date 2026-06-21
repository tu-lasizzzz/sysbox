/**
 * Clean dark card for a single system metric.
 * Orange icon, no gradients, no glow.
 */
export default function SystemCard({ icon, label, value, delay = 0 }) {
  return (
    <div
      className="card p-5 animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">{icon}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-sm font-semibold text-text-main truncate" title={value}>
            {value ?? <span className="skeleton w-24 h-4 inline-block" />}
          </p>
        </div>
      </div>
    </div>
  );
}
