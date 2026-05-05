import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="h-16 bg-card border-b border-border flex items-center px-6 gap-4">
          <Skeleton className="h-7 w-32" />
          <div className="ml-auto flex items-center gap-3">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((id) => (
              <Skeleton key={id} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
