export default function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
        {[2, 1, 3].map((rank) => (
          <div
            key={rank}
            className={[
              "relative bg-surface-3 border border-border rounded-lg overflow-hidden",
              "flex flex-col items-center gap-3 text-center",
              rank === 1 ? "p-9" : "p-6",
            ].join(" ")}
          >
            <div className="h-8 w-8 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div
              className={`bg-muted rounded ${rank === 1 ? "h-16 w-20" : "h-12 w-16"}`}
            />
            <div className="h-2.5 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="bg-surface-3 border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_100px_80px] gap-3 px-4 py-3 border-b border-border">
          {[24, 56, 40, 32].map((w, i) => (
            <div
              key={i}
              className={`h-2.5 bg-muted rounded ${i > 1 ? "ml-auto" : ""}`}
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="flex flex-col">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[40px_1fr_100px_80px] gap-3 px-4 py-3 border-b border-border last:border-b-0 items-center"
            >
              <div className="h-5 w-6 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-12 bg-muted rounded ml-auto" />
              <div className="h-5 w-10 bg-muted rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
