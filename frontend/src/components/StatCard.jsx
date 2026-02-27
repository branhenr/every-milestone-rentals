export default function StatCard({ label, value, color }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
}
