// Feed.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Rss } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FeedCard from "./FeedCard";
import FeedSkeleton from "./FeedSkeleton";
import { useFeed } from "./hooks/useFeed";

type Filter = "all" | "settled" | "pending";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "settled", label: "SETTLED" },
  { key: "pending", label: "PENDING" },
];

export default function Feed() {
  const [filter, setFilter] = useState<Filter>("all");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed();

  const observer = useRef<IntersectionObserver | null>(null);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["feed"] });
  };

  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const allItems = data?.pages.flatMap((page) => page) ?? [];
  const filteredItems = allItems.filter((item) => {
    if (filter === "settled") return item.is_scored;
    if (filter === "pending") return !item.is_scored;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 border-b border-border flex-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                "px-3.5 py-2.5 text-sm tracking-[0.06em] uppercase transition-colors",
                "border-b-2 -mb-px",
                filter === key
                  ? "text-foreground border-accent"
                  : "text-foreground-muted border-transparent hover:text-foreground",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={handleRefresh}
          aria-label="Refresh feed"
          className="w-9 h-9 grid place-items-center rounded-md hover:bg-surface-5 text-foreground-muted hover:text-foreground border border-transparent hover:border-border-strong transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <p className="py-12 text-center">
          <Label>Failed to load feed. Please try again later.</Label>
        </p>
      ) : allItems.length === 0 ? (
        <div className="text-center py-24">
          <Rss className="w-8 h-8 text-foreground-muted mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">No predictions yet</p>
          <p className="text-sm text-foreground-muted mb-4">Be the first.</p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Go to fixtures</Link>
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <p className="py-12 text-center">
          <Label>No {filter} predictions to show</Label>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredItems.map((item, index) => {
            const isLast = index === filteredItems.length - 1;
            return (
              <div
                key={item.prediction_id}
                ref={isLast ? lastCardRef : undefined}
              >
                <FeedCard item={item} />
              </div>
            );
          })}
          {isFetchingNextPage && (
            <div className="bg-surface-1 rounded-lg h-28 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
