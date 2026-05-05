import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, principalShort, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Brand */}
          <Link
            to="/files"
            className="flex items-center gap-2 group"
            data-ocid="header.link"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30 group-hover:bg-accent/30 transition-smooth">
              <ShieldCheck className="w-4 h-4 text-accent" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              FileVault
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User info + logout */}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              {principalShort && (
                <span
                  className="hidden sm:block font-mono text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border select-all"
                  title="Your Internet Identity principal"
                  data-ocid="header.principal"
                >
                  {principalShort}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                data-ocid="header.logout_button"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
