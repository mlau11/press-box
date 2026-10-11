import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/typography";
import { supabase } from "@/lib/supabase";
import { useState, type SubmitEvent } from "react";
import { useAuthContext } from "./context/AuthContext";
import { useUsernameAvailability } from "./hooks/useUsernameAvailability";
import { USERNAME_RULE, validateUsername } from "./utils/validateUsername";

export default function UsernameSetupModal() {
  const { user, profile, loading, refreshProfile } = useAuthContext();

  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsUsername = !loading && !!user && !!profile && !profile.username;
  const { checking, available } = useUsernameAvailability(
    username,
    needsUsername,
  );
  const formatError =
    username.trim() === "" ? null : validateUsername(username);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = username.trim().toLowerCase();
    const invalid = validateUsername(value);
    if (invalid) {
      setError(invalid);
      return;
    }

    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("users")
      .update({ username: value })
      .eq("id", user!.id);

    if (updateError) {
      setError(
        updateError.code === "23505"
          ? "That username is taken. Try another."
          : updateError.message,
      );
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
  };

  return (
    <Dialog open={needsUsername}>
      <DialogContent
        className="max-w-[420px] p-0 overflow-hidden bg-surface-1 rounded-sm"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="px-7 pt-7 pb-7 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-display">
              Press <span className="text-primary">Box</span>
            </Label>
            <h2 className="text-[36px] leading-none tracking-[0.02em]">
              Pick a username.
            </h2>
            <p className="text-sm leading-[1.45] text-foreground-muted m-0">
              This is how you'll appear on the leaderboard and in the feed.
            </p>
          </div>

          {error && (
            <div className="flex gap-2.5 items-start bg-destructive/10 rounded-md px-3.5 py-3">
              <span className="text-2xs tracking-[0.1em] text-destructive pt-px flex-shrink-0">
                Error
              </span>
              <p className="m-0 text-sm leading-[1.4] text-foreground">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Username</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. goatpredictor99"
                required
                autoComplete="off"
                className="focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 focus:border-accent"
              />
              {formatError ? (
                <Label className="text-destructive">{formatError}</Label>
              ) : checking ? (
                <Label>Checking…</Label>
              ) : available === false ? (
                <Label className="text-destructive">Already taken</Label>
              ) : available === true ? (
                <Label className="text-success">Available</Label>
              ) : (
                <Label>{USERNAME_RULE}</Label>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                saving ||
                checking ||
                available === false ||
                validateUsername(username) !== null
              }
              className="w-full py-3 text-sm rounded-sm"
            >
              {saving ? "Saving…" : "Continue"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
