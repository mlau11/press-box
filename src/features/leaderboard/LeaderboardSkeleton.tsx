export default function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 gap-4 my-2 md:hidden">
        {[1, 2, 3].map((rank) => (
          <div
            key={rank}
            className={[
              "relative bg-surface-4 border border-border rounded-lg overflow-hidden",
              "flex flex-col items-center gap-3 text-center",
              rank === 1 ? "py-8 px-6" : "py-6 px-6",
            ].join(" ")}
          >
            <div
              className={`bg-muted rounded ${rank === 1 ? "h-8 w-8" : "h-6 w-6"}`}
            />
            <div className="h-4 w-24 bg-muted rounded" />
            <div
              className={`bg-muted rounded ${rank === 1 ? "h-16 w-20" : "h-11 w-14"}`}
            />
            <div className="h-2.5 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-3 gap-4 my-2">
        {[2, 1, 3].map((rank) => (
          <div
            key={rank}
            className={[
              "relative bg-surface-4 border border-border rounded-lg overflow-hidden",
              "flex flex-col items-center gap-3 text-center",
              rank === 1
                ? "py-8 px-6 md:scale-105 md:-translate-y-2"
                : "py-6 px-6",
            ].join(" ")}
          >
            <div
              className={`bg-muted rounded ${rank === 1 ? "h-8 w-8" : "h-6 w-6"}`}
            />
            <div className="h-4 w-24 bg-muted rounded" />
            <div
              className={`bg-muted rounded ${rank === 1 ? "h-16 w-20" : "h-11 w-14"}`}
            />
            <div className="h-2.5 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-sm overflow-hidden bg-surface-2">
        {/* Table - mobile */}
        <div className="flex flex-col md:hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-surface-2"
            >
              <div className="h-4 w-6 bg-muted rounded shrink-0" />
              <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
              <div className="h-5 w-8 bg-muted rounded shrink-0" />
            </div>
          ))}
        </div>

        {/* Table - tablet + desktop */}
        <div className="hidden md:grid md:grid-cols-[56px_1fr_90px_90px_90px] lg:grid-cols-[72px_1fr_150px_150px_150px] gap-x-px gap-y-0 bg-foreground-dim rounded-md">
          <div className="grid grid-cols-subgrid col-span-5 border-b border-border">
            <div className="px-4 py-3 bg-surface-2">
              <div className="h-2.5 w-8 bg-muted rounded" />
            </div>
            <div className="px-4 py-3 bg-surface-2">
              <div className="h-2.5 w-16 bg-muted rounded" />
            </div>
            <div className="px-4 py-3 bg-surface-1 flex justify-end">
              <div className="h-2.5 w-10 bg-muted rounded" />
            </div>
            <div className="px-4 py-3 bg-surface-1 flex justify-end">
              <div className="h-2.5 w-10 bg-muted rounded" />
            </div>
            <div className="px-4 py-3 bg-surface-2 flex justify-end">
              <div className="h-2.5 w-10 bg-muted rounded" />
            </div>
          </div>

          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-subgrid col-span-5">
              <div className="px-4 py-4 bg-surface-2 flex items-center">
                <div className="h-4 w-5 bg-muted rounded" />
              </div>
              <div className="px-4 py-4 bg-surface-2 flex items-center">
                <div className="h-4 w-28 bg-muted rounded" />
              </div>
              <div className="px-4 py-4 bg-surface-1 flex items-center justify-end">
                <div className="h-4 w-8 bg-muted rounded" />
              </div>
              <div className="px-4 py-4 bg-surface-1 flex items-center justify-end">
                <div className="h-4 w-8 bg-muted rounded" />
              </div>
              <div className="px-4 py-4 bg-surface-2 flex items-center justify-end">
                <div className="h-4 w-8 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
