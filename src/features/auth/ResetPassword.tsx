import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/typography";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkmark() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 7.5l3 3 7-7" />
    </svg>
  );
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    }

    setLoading(false);
  };

  const inputFocus =
    "focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 focus:border-accent";

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-12 pb-16">
      <div className="flex flex-col items-center gap-1.5 pb-8 w-full max-w-[420px]">
        <Label>The matchday journal</Label>
        <span className="font-display text-[36px] leading-none tracking-[0.04em] uppercase text-foreground">
          Press <span className="text-primary">Box</span>
        </span>
        <Label>Account · Password reset</Label>
      </div>

      <div className="w-full max-w-[420px] overflow-hidden rounded-lg bg-surface-1">
        <div className="px-7 pt-7 pb-7 flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <Label>Step 2 of 2</Label>
            <h2 className="text-[42px] leading-none tracking-[0.02em]">
              New password.
            </h2>
          </div>

          {success ? (
            <div className="flex flex-col gap-2 py-1">
              <div className="w-7 h-7 rounded-full grid place-items-center bg-accent/20 border border-accent/50 text-accent mb-1">
                <Checkmark />
              </div>
              <h3 className="text-[22px] leading-none tracking-[0.02em] text-foreground m-0">
                Password updated.
              </h3>
              <p className="text-sm leading-[1.45] text-foreground-muted m-0">
                Taking you back to the fixtures…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="flex gap-2.5 items-start bg-destructive/10 rounded-md px-3.5 py-3">
                  <span className="text-[10px] tracking-[0.1em] text-destructive pt-px flex-shrink-0">
                    Error
                  </span>
                  <p className="m-0 text-sm leading-[1.4] text-foreground">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label>New password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className={inputFocus}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Confirm password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputFocus}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm"
              >
                {loading ? "Updating…" : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
