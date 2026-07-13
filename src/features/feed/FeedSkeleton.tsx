export default function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-surface-3 border border-border rounded-lg overflow-hidden animate-pulse"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-2.5 w-44 bg-muted rounded" />
              </div>
            </div>
            <div className="h-5 w-20 bg-muted rounded-full flex-shrink-0" />
          </div>
          <div className="px-4 py-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-muted rounded" />
                <div className="h-2.5 w-12 bg-muted rounded" />
              </div>
              <div className="flex flex-col items-center gap-1 min-w-[90px]">
                <div className="h-2.5 w-16 bg-muted rounded" />
                <div className="h-9 w-24 bg-muted rounded" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-muted rounded" />
                <div className="h-2.5 w-12 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
