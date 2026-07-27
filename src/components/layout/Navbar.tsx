import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/constants";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function UserGlyph({ username }: { username?: string }) {
  const initial = username?.trim()?.[0]?.toUpperCase();
  if (!initial) return <User className="w-4 h-4" />;
  return (
    <span className="text-sm leading-none tracking-[0.04em]">{initial}</span>
  );
}

export default function Navbar() {
  const { user, profile } = useAuthContext();
  const { openAuthModal } = useAuthModal();
  const { signOut } = useAuth();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClasses = (path: string) =>
    `relative px-3.5 py-2 rounded-[4px] text-base tracking-[0.06em] transition-colors ${
      isActive(path)
        ? "text-foreground"
        : "text-foreground-muted hover:text-foreground"
    }`;

  const mobileLinkClasses = (path: string) =>
    `px-3.5 py-2.5 rounded-[4px]  text-base tracking-[0.06em] transition-colors ${
      isActive(path)
        ? "text-foreground bg-surface-1"
        : "text-foreground-muted hover:text-foreground hover:bg-surface-1"
    }`;

  return (
    <nav className="w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6 md:grid md:grid-cols-[1fr_auto_1fr] md:justify-normal">
        <div className="flex items-center justify-start shrink-0 md:justify-self-start">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity"
          >
            <span className="font-display text-[26px] leading-none tracking-[0.04em] uppercase translate-y-[2px]">
              Press <span className="text-primary">Box</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={navLinkClasses(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Account menu"
                  className="hidden md:flex w-9 h-9 rounded-full border-[1.5px] border-border-strong bg-surface-1 text-foreground hover:bg-surface-5"
                >
                  <UserGlyph username={profile?.username} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  {profile?.username && (
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile.username}
                    </p>
                  )}
                  <p className="text-xs text-foreground-muted truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={`/profile/${profile?.username}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center gap-2 text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={openAuthModal}
              className="hidden md:flex"
            >
              Sign up
            </Button>
          )}

          <div className="flex md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="w-9 h-9 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-1"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 pt-12">
                <div className="flex flex-col gap-1">
                  {user && (
                    <div className="flex items-center gap-3 px-3 py-3 mb-1">
                      <span
                        aria-hidden="true"
                        className="grid place-items-center w-9 h-9 rounded-full border-[1.5px] border-primary bg-surface-1 text-foreground"
                      >
                        <UserGlyph username={profile?.username} />
                      </span>
                      <div className="min-w-0">
                        {profile?.username && (
                          <p className="text-sm font-medium text-foreground truncate">
                            {profile.username}
                          </p>
                        )}
                        <p className="text-xs text-foreground-muted truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {user && <div className="h-px bg-border mb-2" />}

                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSheetOpen(false)}
                      className={mobileLinkClasses(link.path)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="h-px bg-border my-2" />

                  {user ? (
                    <>
                      <Link
                        to={`/profile/${profile?.username}`}
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-foreground-muted hover:text-foreground hover:bg-surface-1 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          signOut();
                          setSheetOpen(false);
                        }}
                        className="w-full justify-start gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-surface-5 hover:text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full mt-1"
                      onClick={() => {
                        setSheetOpen(false);
                        openAuthModal();
                      }}
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
