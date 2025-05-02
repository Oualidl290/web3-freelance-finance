
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web3-purple"></div>
      </div>
    );
  }

  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Render children if authenticated
  return <>{children}</>;
}
