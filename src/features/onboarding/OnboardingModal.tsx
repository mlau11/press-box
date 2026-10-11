import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/typography";
import { STORAGE_KEY } from "@/constants";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useState } from "react";

export default function OnboardingModal() {
  const { profile, user } = useAuthContext();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== null,
  );

  // Wait until the username gate is done; same condition UsernameSetupModal uses.
  const blockedByUsernameGate = !!user && !!profile && !profile.username;
  const open = !dismissed && !blockedByUsernameGate;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && dismiss()}>
      <DialogContent
        className="max-w-[400px] p-6 bg-surface-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2">
          <Label className="text-sm font-display">
            Press <span className="text-primary">Box</span>
          </Label>
        </div>

        <h1 className="text-[30px] leading-[1.05] tracking-[0.01em] mb-2.5">
          Call the score.
          <br />
          Build a name.
        </h1>

        <p className="text-sm leading-[1.45] text-foreground-muted mb-5 max-w-[36ch]">
          Every call you make is public. The sharpest callers build a following,
          match by match.
        </p>

        <div className="flex flex-col bg-surface-4 rounded-sm mb-5">
          <div className="flex items-baseline gap-3 px-4 py-3 text-sm">
            <span className="flex-1 font-medium text-foreground">
              Exact score
            </span>
            <span className="text-[22px] tracking-[0.02em] tabular-nums text-foreground">
              3
              <span className="text-2xs tracking-[0.1em] text-foreground-muted ml-0.5">
                pts
              </span>
            </span>
          </div>
          <div className="flex items-baseline gap-3 px-4 py-3 text-sm">
            <span className="flex-1 font-medium text-foreground">
              Correct result{" "}
              <span className="text-xs text-foreground-muted ml-1">
                (W / D / L)
              </span>
            </span>
            <span className="text-[16px] tracking-[0.02em] tabular-nums text-foreground">
              1
              <span className="text-2xs tracking-[0.1em] text-foreground-muted ml-0.5">
                pt
              </span>
            </span>
          </div>
          <div className="flex items-baseline gap-3 px-4 py-3 text-sm">
            <span className="flex-1 font-medium text-foreground-muted">
              Wrong call
            </span>
            <span className="text-sm tracking-[0.02em] tabular-nums text-foreground-dim">
              0
              <span className="text-2xs tracking-[0.1em] text-foreground-dim ml-0.5">
                pts
              </span>
            </span>
          </div>
        </div>

        <div className="rounded-sm mb-5">
          <p className="text-sm leading-[1.5] text-foreground-muted m-0">
            <strong className="font-semibold text-foreground">
              Your rating is your last 100 predictions.{" "}
            </strong>
            Recent form, not all-time. Always current, never resets.
          </p>
        </div>

        <Button
          type="button"
          onClick={dismiss}
          className="w-full py-3 text-sm rounded-sm"
        >
          Start predicting
        </Button>
      </DialogContent>
    </Dialog>
  );
}
