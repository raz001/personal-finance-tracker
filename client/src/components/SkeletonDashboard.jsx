/**
 * Shown while the initial expense list is loading.
 * Mirrors the real dashboard layout so there's no layout shift.
 */
const SkeletonLine = ({ width = "100%", height = 14 }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius: "var(--radius-sm)" }}
  />
);

const SkeletonCard = () => (
  <div className="panel" style={{ display: "grid", gap: "0.75rem" }}>
    <SkeletonLine width="40%" height={10} />
    <SkeletonLine width="60%" height={20} />
    <SkeletonLine />
    <SkeletonLine width="80%" />
    <SkeletonLine width="90%" />
  </div>
);

const SkeletonStatCard = () => (
  <div className="stat-card">
    <div className="skeleton" style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", flexShrink: 0 }} />
    <div style={{ display: "grid", gap: "0.5rem", flex: 1 }}>
      <SkeletonLine width="50%" height={10} />
      <SkeletonLine width="70%" height={22} />
    </div>
  </div>
);

const SkeletonDashboard = () => (
  <div style={{ display: "grid", gap: "1.25rem" }}>
    {/* Stat cards */}
    <div className="stat-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>

    {/* Main grid */}
    <div className="dashboard-grid">
      <div className="left-column">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="right-column">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

export default SkeletonDashboard;
