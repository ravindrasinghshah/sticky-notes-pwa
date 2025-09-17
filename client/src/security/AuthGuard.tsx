import { useEffect } from "react";
import { useLocation } from "wouter";
import { useStateValue } from "@/providers/StateProvider.tsx";
import { Loading } from "@/components/ui/loading";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component handles authentication-based navigation for all routes
 * - Determines auth requirements based on current route
 * - Redirects users based on their auth state and route requirements
 * - Renders children only when auth state matches route requirements
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const [{ isAuthenticated, isLoading }] = useStateValue();
  const [, setLocation] = useLocation();

  // Define which routes require authentication
  const protectedRoutes = ["/home", "/profile", "/settings"];
  const publicRoutes = ["/", "/landing", "/about", "/contact"];
  const landingRoutes = ["/", "/landing"]; // Routes that should redirect authenticated users

  const currentPath = window.location.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(currentPath);
  const isLandingRoute = landingRoutes.includes(currentPath);

  useEffect(() => {
    if (!isLoading) {
      console.log("AuthGuard - Route-based auth check:", {
        isAuthenticated,
        isLoading,
        currentPath,
        isProtectedRoute,
        isPublicRoute,
        isLandingRoute,
      });

      if (isProtectedRoute && !isAuthenticated) {
        // User is on a protected route but not authenticated
        console.log(
          "AuthGuard - Redirecting unauthenticated user to landing page"
        );
        setLocation("/");
      } else if (isLandingRoute && isAuthenticated) {
        // User is authenticated but on a landing route (like / or /landing)
        console.log("AuthGuard - Redirecting authenticated user to home");
        setLocation("/home");
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    currentPath,
    isProtectedRoute,
    isLandingRoute,
    setLocation,
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  // Don't render children if auth state doesn't match route requirements
  if (isProtectedRoute && !isAuthenticated) {
    return null;
  }

  if (isLandingRoute && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
