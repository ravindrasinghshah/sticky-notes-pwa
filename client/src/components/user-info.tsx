import { useStateValue } from "@/providers/StateProvider.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Image, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { actionTypes } from "@/providers/Reducer";

export default function UserInfo() {
  const [{ user, isAuthenticated }, dispatch] = useStateValue();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The auth state listener will handle updating the context
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Not logged in</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{user.email}</span>
        </div>
        
        {user.displayName && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.displayName}</span>
          </div>
        )}
        
        {user.photoURL && (
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-muted-foreground" />
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
        
        <div className="pt-2 flex items-center justify-between">
          <Badge variant="default">Logged in</Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
