import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import { queryClient } from "@/lib/queryClient";
import { StateProvider } from "@/providers/StateProvider.tsx";
import reducer, { initialState } from "@/providers/Reducer";
import AuthGuard from "@/security/AuthGuard";
import { LoadingSpinner } from "@/components/loading-spinner";

// Lazy load page components for code splitting
const Home = lazy(() => import("@/pages/home"));
const Landing = lazy(() => import("@/pages/landing"));
const Profile = lazy(() => import("@/pages/profile"));
const Settings = lazy(() => import("@/pages/settings"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/home" component={Home} />
          <Route path="/home/bucket/:bucketId" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AuthGuard>
  );
}

function App() {
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </StateProvider>
  );
}

export default App;
