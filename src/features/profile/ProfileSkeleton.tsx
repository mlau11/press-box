export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="border-t-2 border-muted pt-6 flex items-end gap-6">
        <div className="w-20 h-20 rounded-full bg-muted flex-shrink-0" />
        <div className="flex flex-col gap-2 min-w-0">
          <div className="h-2.5 w-20 bg-muted rounded" />
          <div className="h-10 w-52 bg-muted rounded" />
          <div className="h-2.5 w-32 bg-muted rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-3 border border-border rounded-lg p-5 flex flex-col gap-2">
            <div className="h-2.5 w-24 bg-muted rounded" />
            <div className="h-12 w-16 bg-muted rounded" />
            <div className="h-2.5 w-20 bg-muted rounded" />
          </div>
          <div className="bg-surface-3 border border-border rounded-lg p-5 flex flex-col gap-2">
            <div className="h-2.5 w-24 bg-muted rounded" />
            <div className="h-12 w-16 bg-muted rounded" />
            <div className="h-2.5 w-20 bg-muted rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-3 border border-border rounded-lg p-5 flex flex-col gap-2">
            <div className="h-2.5 w-24 bg-muted rounded" />
            <div className="h-12 w-16 bg-muted rounded" />
            <div className="h-2.5 w-20 bg-muted rounded" />
          </div>
          <div className="bg-surface-3 border border-border rounded-lg p-5 flex flex-col gap-2">
            <div className="h-2.5 w-24 bg-muted rounded" />
            <div className="h-12 w-16 bg-muted rounded" />
            <div className="h-2.5 w-20 bg-muted rounded" />
          </div>
        </div>

        <div className="bg-surface-3 border border-border rounded-lg px-[18px] py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="h-3.5 w-24 bg-muted rounded" />
            <div className="h-2.5 w-16 bg-muted rounded" />
          </div>
          <div className="flex flex-col">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_auto_auto_1fr_46px] items-center gap-3 py-[10px] ${i < 4 ? "border-b border-dashed border-border" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-muted rounded flex-shrink-0" />
                  <div className="h-3.5 w-16 bg-muted rounded" />
                </div>
                <div className="flex flex-col items-center gap-1 min-w-[52px]">
                  <div className="h-4 w-12 bg-muted rounded" />
                  <div className="h-2 w-10 bg-muted rounded" />
                </div>
                <div className="flex flex-col items-center gap-1 min-w-[52px]">
                  <div className="h-4 w-12 bg-muted rounded" />
                  <div className="h-2 w-10 bg-muted rounded" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="h-3.5 w-16 bg-muted rounded" />
                  <div className="w-5 h-5 bg-muted rounded flex-shrink-0" />
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
