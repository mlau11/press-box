export default function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="bg-surface-1 rounded-xs overflow-hidden flex flex-col gap-2 p-8 animate-pulse">
        <div className="p-4 flex flex-col gap-2">
          <div className="h-2.5 w-20 bg-muted rounded" />
          <div className="h-12 w-52 bg-muted rounded" />
          <div className="h-2.5 w-32 bg-muted rounded" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 bg-surface-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-5 flex flex-col gap-1.5">
              <div className="h-2.5 w-20 bg-muted rounded" />
              <div className="h-9 w-14 bg-muted rounded" />
              <div className="h-2.5 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>

        <div className="rounded-sm px-[18px] py-4">
          <div className="flex justify-between items-center pb-[10px]">
            <div className="h-3.5 w-24 bg-muted rounded" />
            <div className="h-2.5 w-16 bg-muted rounded" />
          </div>
          <div className="flex flex-col">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_190px_1fr_46px] items-center gap-3 py-4"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0" />
                  <div className="h-3.5 w-16 bg-muted rounded" />
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-2.5 w-14 bg-muted rounded" />
                    <div className="h-4 w-12 bg-muted rounded" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 min-w-0">
                  <div className="h-3.5 w-16 bg-muted rounded" />
                  <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0" />
                </div>

                <div className="flex justify-end">
                  <div className="w-[46px] h-6 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
