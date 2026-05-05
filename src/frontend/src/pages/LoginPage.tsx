import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Fingerprint, Lock, ShieldCheck, Upload } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: Lock,
    title: "End-to-End Privacy",
    description:
      "Your files are stored on the Internet Computer — no third parties, no data mining.",
  },
  {
    icon: Upload,
    title: "Instant Uploads",
    description:
      "Drag-and-drop or browse to upload any file. Real-time progress keeps you informed.",
  },
  {
    icon: FileText,
    title: "Organised & Searchable",
    description:
      "Access your files by name, type, or date. Everything in one secure place.",
  },
];

export default function LoginPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/files" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            FileVault
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Icon badge */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-accent/15 flex items-center justify-center border border-accent/25 shadow-elevated">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground tracking-tight">
              FileVault
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Secure personal file storage on the Internet Computer.
              <br />
              Your files, your keys, your control.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button
              size="lg"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              className="w-full gap-3 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base py-6 rounded-xl shadow-elevated transition-smooth"
              data-ocid="login.primary_button"
            >
              <Fingerprint className="w-5 h-5" />
              {isInitializing
                ? "Loading..."
                : isLoggingIn
                  ? "Connecting..."
                  : "Sign in with Internet Identity"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              No password. No email. Secured by cryptographic identity.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-20 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-card hover:border-accent/40 transition-smooth"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <feature.icon className="w-4.5 h-4.5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

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
