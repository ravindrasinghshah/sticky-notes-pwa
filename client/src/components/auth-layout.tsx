import { ReactNode } from "react";
import { useStateValue } from "@/providers/StateProvider.tsx";
import { actionTypes } from "@/providers/Reducer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StickyNote, Bell, LogOut } from "lucide-react";
import SearchBar from "@/components/search-bar";
import { logOut } from "../../../firebase-config";

interface AuthLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string, bucketId?: string) => void;
  currentBucketId?: string;
}

export default function AuthLayout({
  children,
  showSearch = false,
  onSearch,
  currentBucketId,
}: AuthLayoutProps) {
  const [{ user, isAuthenticated = false }] = useStateValue();
  const [, dispatch] = useStateValue();

  // Handle logout
  const handleLogout = () => {
    dispatch({ type: actionTypes.LOGOUT });
    logOut();
  };

  // Get user initials
  const getUserInitials = (user: any) => {
    if (!user) return "U";
    const first = user.firstName || user.email?.charAt(0) || "";
    const last = user.lastName || "";
    return (first.charAt(0) + last.charAt(0)).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
                <StickyNote className="text-accent-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
              Stickee Notes
              </h1>
            </div>

            {/* Search Bar - only show when enabled */}
            {showSearch && onSearch && (
              <div className="flex-1 max-w-2xl mx-8">
                <SearchBar
                  onSearch={onSearch}
                  currentBucketId={currentBucketId}
                />
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                title="Notifications"
                data-testid="button-notifications"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className="w-8 h-8 cursor-pointer"
                    data-testid="avatar-user"
                  >
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
