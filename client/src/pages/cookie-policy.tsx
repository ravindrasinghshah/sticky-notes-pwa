import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function CookiePolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What Are Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Cookies are small text files that are placed on your computer or mobile device 
              when you visit a website. They are widely used to make websites work more 
              efficiently and to provide information to website owners.
            </p>
            <p>
              This Cookie Policy explains how Stickee Notes ("we," "us," or "our") uses 
              cookies and similar technologies when you visit our website and use our Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How We Use Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Remember your preferences and settings</li>
              <li>Keep you signed in to your account</li>
              <li>Understand how you use our Service</li>
              <li>Improve our Service's performance and functionality</li>
              <li>Provide personalized content and features</li>
              <li>Analyze traffic and usage patterns</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
              <p>
                These cookies are necessary for the Service to function properly. They enable 
                basic functions like page navigation, access to secure areas, and authentication. 
                The Service cannot function properly without these cookies.
              </p>
              <div className="bg-muted p-3 rounded mt-2">
                <p><strong>Examples:</strong> Authentication tokens, session management, security cookies</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Functional Cookies</h3>
              <p>
                These cookies enable the Service to provide enhanced functionality and 
                personalization. They may be set by us or by third-party providers whose 
                services we have added to our pages.
              </p>
              <div className="bg-muted p-3 rounded mt-2">
                <p><strong>Examples:</strong> Language preferences, theme settings, user interface preferences</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our Service by 
                collecting and reporting information anonymously. This helps us improve our 
                Service's performance and user experience.
              </p>
              <div className="bg-muted p-3 rounded mt-2">
                <p><strong>Examples:</strong> Google Analytics, usage statistics, performance monitoring</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Marketing Cookies</h3>
              <p>
                These cookies are used to track visitors across websites to display relevant 
                and engaging advertisements. They may be set by us or by third-party advertising 
                partners.
              </p>
              <div className="bg-muted p-3 rounded mt-2">
                <p><strong>Examples:</strong> Advertising networks, social media integration, remarketing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Some cookies on our Service are set by third-party services that appear on our pages. 
              We do not control these cookies and recommend you check the third-party websites for 
              more information about their cookies and how to manage them.
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Google Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  We use Google Analytics to analyze how users interact with our Service. 
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    Learn more about Google's privacy practices
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Firebase Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  We use Firebase for user authentication. 
                  <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    Learn more about Firebase privacy
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Managing Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You can control and manage cookies in various ways. Please note that removing 
              or blocking cookies can impact your user experience and parts of our Service 
              may not function properly.
            </p>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. 
                You can set your browser to refuse cookies or delete certain cookies.
              </p>
              <div className="bg-muted p-3 rounded mt-2">
                <p><strong>Popular browsers:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Internet Explorer</a></li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
              <p>
                When you first visit our Service, you may see a cookie consent banner. 
                You can choose which types of cookies to accept or reject. You can also 
                change your preferences at any time through our settings.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cookie Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Different cookies have different retention periods:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them</li>
              <li><strong>Authentication cookies:</strong> Typically expire after 30 days of inactivity</li>
              <li><strong>Analytics cookies:</strong> Usually expire after 2 years</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our 
              practices or for other operational, legal, or regulatory reasons.
            </p>
            <p>
              We will notify you of any material changes by posting the new Cookie Policy 
              on this page and updating the "Last updated" date.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, 
              please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@stickeenotes.com</p>
              <p><strong>Address:</strong> 123 Cookie Street, Policy City, PC 12345</p>
            </div>
            <p className="text-sm text-muted-foreground">
              For more information about our privacy practices, please see our{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setLocation('/privacy-policy')}>
                Privacy Policy
              </Button>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
