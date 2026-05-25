const SkeletonLine = ({ width = "100%", height = 14 }) => (
  <div
    className="skeleton-shimmer rounded-sm"
    style={{ width, height }}
  />
);

const SkeletonCard = () => (
  <div className="bg-surface border border-border rounded-lg shadow-sm p-6 grid gap-3">
    <SkeletonLine width="40%" height={10} />
    <SkeletonLine width="60%" height={20} />
    <SkeletonLine />
    <SkeletonLine width="80%" />
    <SkeletonLine width="90%" />
  </div>
);

const SkeletonStatCard = () => (
  <div className="bg-surface border border-border rounded-lg shadow-xs flex gap-4 p-5">
    <div className="skeleton-shimmer rounded-md flex-shrink-0" style={{ width: 44, height: 44 }} />
    <div className="grid gap-2 flex-1">
      <SkeletonLine width="50%" height={10} />
      <SkeletonLine width="70%" height={22} />
    </div>
  </div>
);

const SkeletonDashboard = () => (
  <div className="grid gap-5">
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
    <div className="dashboard-grid">
      <div className="grid gap-5">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid gap-5">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

export default SkeletonDashboard;
