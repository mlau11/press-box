import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label, Ticker } from "@/components/ui/typography";
import { useState } from "react";
import { useAuthModal } from "./context/AuthModalContext";
import { useAuth } from "./hooks/useAuth";
import { Button } from "@/components/ui/button";

type AuthMode = "signin" | "signup" | "forgot";

const titles: Record<AuthMode, string> = {
  signin: "Welcome Back.",
  signup: "Join the Box.",
  forgot: "Reset Password.",
};

function GoogleMono() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.6 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.05.78 3.75 1.45l2.55-2.45C16.85 4.05 14.65 3 12 3 6.95 3 3 6.95 3 12s3.95 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.6-.05-1.05-.15-1.5z" />
    </svg>
  );
}

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

export default function AuthModal() {
  const { isOpen, closeAuthModal } = useAuthModal();
  const {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    sendPasswordReset,
    loading,
    error,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setMode("signin");
    setResetSent(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      await signUpWithEmail(email, password, username);
    } else {
      await signInWithEmail(email, password);
    }
    if (!error) {
      closeAuthModal();
      resetForm();
    }
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
    closeAuthModal();
  };

  const inputFocus =
    "focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 focus:border-accent";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden">
        <div className="border-t-4 border-primary" />
        <div className="px-7 pt-6 pb-7 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center w-6 h-6 rounded-[3px] bg-primary text-primary-foreground text-sm leading-none">
                PB
              </span>
              <Label>Press Box</Label>
            </div>
            <h2 className="text-[42px] leading-none tracking-[0.02em]">
              {titles[mode]}
            </h2>
          </div>

          {error && (
            <div className="flex gap-2.5 items-start py-2.5 border-t border-b border-destructive">
              <span className="text-[10px] tracking-[0.16em] uppercase text-destructive pt-px flex-shrink-0">
                Err
              </span>
              <p className="m-0 text-sm leading-[1.4] text-foreground">
                {error}
              </p>
            </div>
          )}

          {mode === "forgot" ? (
            resetSent ? (
              <div className="flex flex-col gap-2 py-1">
                <div className="w-7 h-7 rounded-full grid place-items-center bg-accent/20 border border-accent/50 text-accent mb-1">
                  <Checkmark />
                </div>
                <h3 className="text-[22px] leading-none tracking-[0.04em] text-foreground m-0">
                  Check your inbox.
                </h3>
                <p className="italic text-sm leading-[1.45] text-fg-muted m-0">
                  We've sent a reset link to{" "}
                  <span className="not-italic text-[12px] text-foreground bg-surface-1 px-1.5 py-px rounded-[3px]">
                    {email}
                  </span>
                  . It should arrive within a minute.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setResetSent(false);
                  }}
                  className="self-start mt-3 text-xs tracking-[0.06em] uppercase text-fg-muted hover:text-foreground border-b border-transparent hover:border-border-strong transition-colors pb-px"
                >
                  ← Back to sign in
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const success = await sendPasswordReset(email);
                  if (success) setResetSent(true);
                }}
                className="flex flex-col gap-4"
              >
                <p className="italic text-sm leading-[1.45] text-fg-muted m-0">
                  Enter your email and we'll send a reset link.
                </p>
                <div className="flex flex-col gap-1.5">
                  <Ticker className="uppercase">Email</Ticker>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={inputFocus}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm tracking-[0.06em] uppercase"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="self-center  text-xs tracking-[0.06em] uppercase text-fg-muted hover:text-foreground border-b border-transparent hover:border-border-strong transition-colors pb-px"
                >
                  ← Back to sign in
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <Ticker className="uppercase">Username</Ticker>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. goatpredictor99"
                    required
                    className={inputFocus}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <Ticker className="uppercase">Email</Ticker>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputFocus}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Ticker className="uppercase">Password</Ticker>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-fg-muted hover:text-accent transition-colors pb-px"
                      style={{
                        borderBottom: "1px dotted var(--border-strong)",
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputFocus}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary py-3 text-sm tracking-[0.06em] uppercase text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? "Loading…"
                  : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>
          )}

          {!resetSent && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <Ticker>or</Ticker>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2.5 rounded-md border border-border py-2.5 text-sm font-medium text-foreground hover:bg-surface-5 hover:border-border-strong disabled:opacity-50 transition-colors"
              >
                <GoogleMono />
                Continue with Google
              </button>
            </>
          )}

          {mode !== "forgot" && (
            <p className="text-center text-xs text-foreground-dim">
              {mode === "signin" ? "No account? " : "Already a member? "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-accent border-b border-accent/40 hover:border-accent pb-px transition-colors"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
