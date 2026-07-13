export default function MatchPanelSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Scoreboard skeleton */}
      <div className="relative overflow-hidden rounded-xs p-4 bg-surface-1/50">
        <div className="px-6 pt-4 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-2.5 w-40 bg-muted rounded" />
            <div className="h-2.5 w-24 bg-muted rounded" />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
            </div>
            <div className="flex flex-col items-center gap-1.5 px-2">
              <div className="h-14 w-32 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-1 rounded-sm py-5 px-7">
        {/* Prediction skeleton */}
        <div className="pb-5">
          <div className="h-5 w-52 bg-muted rounded mb-5" />

          <div className="grid grid-cols-2 gap-6 items-center mb-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 items-center">
                <div className="h-2.5 w-16 bg-muted rounded" />
                <div
                  className="w-32 bg-muted rounded-md"
                  style={{ height: "96px" }}
                />
                <div className="flex justify-center gap-1.5">
                  <div className="w-[38px] h-7 bg-muted rounded" />
                  <div className="w-[38px] h-7 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <div className="h-2.5 w-16 bg-muted rounded mr-1" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-7 w-12 bg-muted rounded" />
            ))}
          </div>

          <div className="h-10 w-full bg-muted rounded-md" />
        </div>

        {/* Form skeleton */}
        <div className="pt-4 pb-6 rounded-xs">
          <div className="py-4">
            <div className="grid grid-cols-2 gap-6">
              {[0, 1].map((i) => (
                <div key={i}>
                  <div className="h-2.5 w-24 bg-muted rounded mb-3" />
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-2.5 border-b border-border last:border-0"
                    >
                      <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="h-3 w-8 bg-muted rounded" />
                      <div className="h-3 w-4 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Standings skeleton */}
          <div className="pt-4">
            <div className="h-2.5 w-28 bg-muted rounded mb-3" />
            <div className="overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto_auto] items-center gap-x-2 py-2 border-b border-border">
                {[20, 48, 20, 20, 20, 20, 20, 20, 24].map((w, i) => (
                  <div
                    key={i}
                    className="h-2.5 bg-muted rounded"
                    style={{ width: w }}
                  />
                ))}
              </div>
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto_auto] items-center gap-x-2 py-2.5"
                >
                  <div className="w-5 h-3 bg-muted rounded" />
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                  <div className="w-5 h-3 bg-muted rounded" />
                  <div className="w-5 h-3 bg-muted rounded" />
                  <div className="w-5 h-3 bg-muted rounded" />
                  <div className="w-5 h-3 bg-muted rounded" />
                  <div className="w-5 h-3 bg-muted rounded" />
                  <div className="w-5 h-3 bg-muted rounded" />
                  <div className="w-6 h-3 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
