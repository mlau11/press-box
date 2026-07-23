export default function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-surface-1 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-2.5 w-44 bg-muted rounded" />
            </div>
            <div className="h-5 w-20 bg-muted rounded-full flex-shrink-0" />
          </div>

          <div className="px-4 py-4 border-t border-border">
            <div className="grid grid-cols-[1fr_180px_1fr] items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-muted rounded-full" />
                <div className="h-2.5 w-12 bg-muted rounded" />
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-2.5 w-14 bg-muted rounded" />
                  <div className="h-6 w-12 bg-muted rounded" />
                </div>
                <div className="w-px h-7 bg-border" />
                <div className="flex flex-col items-center gap-1">
                  <div className="h-2.5 w-10 bg-muted rounded" />
                  <div className="h-6 w-12 bg-muted rounded" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-muted rounded-full" />
                <div className="h-2.5 w-12 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
