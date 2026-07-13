export default function FixturesSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Matchday navigator skeleton */}
      <div className="flex items-center justify-between py-3 px-4">
        <div className="w-5 h-5 bg-muted rounded" />
        <div className="h-3 w-28 bg-muted rounded" />
        <div className="w-5 h-5 bg-muted rounded" />
      </div>

      {/* Match card skeletons */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="px-5 py-3.5">
          {/* Top row — date + time */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="h-2.5 w-20 bg-muted rounded" />
            <div className="h-2.5 w-10 bg-muted rounded" />
          </div>

          {/* Teams */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
