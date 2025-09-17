import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Bell } from "lucide-react";
import LayoutWrapper from "@/components/layout-wrapper";

/**
 * Example protected page using the new layout system
 * This demonstrates how easy it is to create new protected pages
 * without duplicating header, navigation, and authentication logic
 */
export default function Profile() {
  return (
    <LayoutWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and edit your account details
              </p>
              <Button className="mt-4">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Customize your app preferences
              </p>
              <Button className="mt-4">Open Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your notification preferences
              </p>
              <Button className="mt-4">Configure</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
}
