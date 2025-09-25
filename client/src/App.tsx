import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";
import { StateProvider } from "@/providers/StateProvider.tsx";
import reducer, { initialState } from "@/providers/Reducer";
import AuthGuard from "@/security/AuthGuard";

function Router() {
  return (
    <AuthGuard>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/home/bucket/:bucketId" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
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
