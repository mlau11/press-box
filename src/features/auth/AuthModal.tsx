import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/typography";
import { useState, type SubmitEvent } from "react";
import { useAuthModal } from "./context/AuthModalContext";
import { useAuth } from "./hooks/useAuth";
import { useUsernameAvailability } from "./hooks/useUsernameAvailability";
import { USERNAME_RULE, validateUsername } from "./utils/validateUsername";

type AuthMode = "signin" | "signup" | "forgot";

const DEFAULT_MODE: AuthMode = "signup";

const titles: Record<AuthMode, string> = {
  signin: "Welcome back.",
  signup: "Get your press pass.",
  forgot: "Reset password.",
};

const secondaryButton =
  "w-full rounded-sm bg-surface-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-5 transition-colors";

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

  const [mode, setMode] = useState<AuthMode>(DEFAULT_MODE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { checking, available } = useUsernameAvailability(
    username,
    mode === "signup",
  );

  const formatError =
    mode !== "signup" || username.trim() === ""
      ? null
      : validateUsername(username);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setMode(DEFAULT_MODE);
    setResetSent(false);
    setFormError(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      resetForm();
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (mode === "signup") {
      const invalid = validateUsername(username);
      if (invalid) {
        setFormError(invalid);
        return;
      }
    }

    const success =
      mode === "signup"
        ? await signUpWithEmail(email, password, username.trim().toLowerCase())
        : await signInWithEmail(email, password);
    if (success) {
      closeAuthModal();
      resetForm();
    }
  };

  const handleGoogle = async () => {
    const success = await signInWithGoogle();
    if (success) closeAuthModal();
  };

  const inputFocus =
    "focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 focus:border-accent";

  const submitDisabled =
    loading ||
    (mode === "signup" &&
      (checking || available === false || validateUsername(username) !== null));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden bg-surface-1">
        <div className="px-7 pt-7 pb-7 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-display">
                Press <span className="text-primary">Box</span>
              </Label>
            </div>
            <h2 className="text-[36px] leading-none tracking-[0.02em]">
              {titles[mode]}
            </h2>
          </div>

          {(formError || error) && (
            <div className="flex gap-2.5 items-start bg-destructive/10 rounded-md px-3.5 py-3">
              <span className="text-2xs tracking-[0.1em] text-destructive pt-px flex-shrink-0">
                Error
              </span>
              <p className="m-0 text-sm leading-[1.4] text-foreground">
                {formError ?? error}
              </p>
            </div>
          )}

          {mode === "forgot" ? (
            resetSent ? (
              <div className="flex flex-col gap-2 py-1">
                <h3 className="text-[22px] leading-none tracking-[0.02em] text-foreground m-0">
                  Check your inbox.
                </h3>
                <p className="text-sm leading-[1.45] text-foreground-muted m-0">
                  We've sent a reset link to{" "}
                  <span className="text-xs text-foreground bg-surface-4 px-1.5 py-px rounded-xs">
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
                  className={secondaryButton}
                >
                  Back to sign in
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
                <p className="text-sm leading-[1.45] text-foreground-muted m-0">
                  Enter your email and we'll send a reset link.
                </p>
                <div className="flex flex-col gap-1.5">
                  <Label>Email</Label>
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
                  className="w-full py-3 text-sm rounded-sm"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={secondaryButton}
                >
                  Back to sign in
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <Label>Username</Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. goatpredictor99"
                    required
                    autoComplete="off"
                    className={inputFocus}
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
              )}
              <div className="flex flex-col gap-1.5">
                <Label>Email</Label>
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
                  <Label>Password</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-foreground-muted hover:text-accent transition-colors"
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

              <Button
                type="submit"
                disabled={submitDisabled}
                className="w-full py-3 text-sm rounded-sm"
              >
                {loading
                  ? "Loading…"
                  : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
              </Button>
            </form>
          )}

          {!resetSent && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <Label>or</Label>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2.5 rounded-sm bg-surface-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-5 disabled:opacity-50 transition-colors"
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
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setFormError(null);
                }}
                className="text-accent hover:opacity-80 transition-opacity"
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
