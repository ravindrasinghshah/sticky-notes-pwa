import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Stickee Notes ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our sticky notes application.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms 
              of this privacy policy, please do not access the application.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Register for an account using Google authentication</li>
                <li>Create, edit, or delete notes</li>
                <li>Contact us for support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
              <p>
                We may automatically collect certain information about your device and usage, including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>Usage data (features used, time spent in app)</li>
                <li>Log data (IP address, access times, pages viewed)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide, operate, and maintain our application</li>
              <li>Improve, personalize, and expand our application</li>
              <li>Understand and analyze how you use our application</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer service and support</li>
              <li>Send you updates and marketing communications (with your consent)</li>
              <li>Process transactions and send related information</li>
              <li>Find and prevent fraud</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate technical and organizational security measures to protect 
              your personal information against unauthorized access, alteration, disclosure, or 
              destruction. However, no method of transmission over the internet or electronic 
              storage is 100% secure.
            </p>
            <p>
              Your notes and personal data are stored securely using industry-standard encryption 
              and are accessible only to you through your authenticated account.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate personal information</li>
              <li>Delete your personal information</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data</li>
              <li>Object to certain processing activities</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to enhance your experience. 
              For detailed information about our cookie usage, please see our 
              <Button variant="link" className="p-0 h-auto" onClick={() => setLocation('/cookie-policy')}>
                Cookie Policy
              </Button>.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new privacy policy on this page and updating the "Last updated" 
              date.
            </p>
            <p>
              You are advised to review this privacy policy periodically for any changes. 
              Changes to this privacy policy are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about this privacy policy or our privacy practices, 
              please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@stickeenotes.com</p>
              <p><strong>Address:</strong> 123 Privacy Street, Data City, DC 12345</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
