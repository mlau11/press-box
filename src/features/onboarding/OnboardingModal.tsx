import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { STORAGE_KEY } from "@/constants";
import { useEffect, useState } from "react";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setOpen(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && dismiss()}>
      <DialogContent className="max-w-[400px] p-6">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-4 h-px bg-accent flex-shrink-0" />
          <span className="text-[10px] tracking-[0.18em] uppercase text-fg-muted">
            Press Box · Welcome
          </span>
        </div>

        <h1 className="text-[30px] leading-[0.98] tracking-[0.01em] mb-2.5">
          Call the score.
          <br />
          Build a <span className="text-accent">name</span>.
        </h1>

        <p className="italic text-sm leading-[1.45] text-fg-muted mb-4 max-w-[36ch]">
          Every call you make is public. The sharpest callers build a following
          — match by match.
        </p>

        <div className="flex flex-col border-t border-b border-border mb-4">
          <div className="flex items-baseline gap-3 py-[9px] border-b border-dashed border-border text-sm">
            <span className="flex-1 font-medium text-foreground">
              Exact score
            </span>
            <span className="text-[22px] tracking-[0.04em] tabular-nums text-accent">
              3
              <span
                className="text-[9px] tracking-[0.14em] ml-0.5"
                style={{
                  color:
                    "color-mix(in oklch, var(--accent) 70%, var(--fg-muted))",
                }}
              >
                PTS
              </span>
            </span>
          </div>
          <div className="flex items-baseline gap-3 py-[9px] border-b border-dashed border-border text-sm">
            <span className="flex-1 font-medium text-foreground">
              Correct result{" "}
              <span className="italic text-[12px] text-fg-muted ml-1">
                (W / D / L)
              </span>
            </span>
            <span className="text-[16px] tracking-[0.04em] tabular-nums text-foreground">
              1
              <span className="text-[9px] tracking-[0.14em] text-fg-muted ml-0.5">
                PT
              </span>
            </span>
          </div>
          <div className="flex items-baseline gap-3 py-[9px] text-sm">
            <span className="flex-1 font-medium text-fg-muted">Wrong call</span>
            <span className="text-sm tracking-[0.04em] tabular-nums text-foreground-dim">
              0
              <span className="text-[9px] tracking-[0.14em] text-foreground-dim ml-0.5">
                PTS
              </span>
            </span>
          </div>
        </div>

        <div className="flex gap-2.5 items-stretch mb-[18px]">
          <div className="w-[2px] self-stretch bg-accent flex-shrink-0" />
          <p className="italic text-sm leading-[1.5] text-fg-muted m-0">
            <strong className="font-semibold not-italic text-foreground">
              Your rating is your last 100 predictions.{" "}
            </strong>
            Recent form, not all-time. Always current — never resets.
          </p>
        </div>

        <Button
          type="button"
          onClick={dismiss}
          className="w-full py-3 text-[15px] tracking-[0.06em] uppercase"
        >
          Start predicting
        </Button>
      </DialogContent>
    </Dialog>
  );
}
