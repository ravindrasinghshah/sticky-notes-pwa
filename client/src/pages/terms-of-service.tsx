import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { ContactForm } from "@/components/ContactForm";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-foreground">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms of Service ("Terms") govern your use of Stickee Notes
              ("Service") operated by Stickee Notes ("us," "we," or "our").
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these
              Terms. If you disagree with any part of these terms, then you may
              not access the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Stickee Notes is a web-based application that allows users to
              create, organize, and manage digital sticky notes. The Service
              includes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Creating, editing, and deleting notes</li>
              <li>Organizing notes into categories or buckets</li>
              <li>Cloud synchronization across devices</li>
              <li>User authentication and account management</li>
              <li>Search and filtering capabilities</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To use our Service, you must create an account using Google
              authentication. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>
                Ensuring your account information is accurate and up-to-date
              </li>
            </ul>
            <p>
              We reserve the right to terminate or suspend your account at any
              time for violation of these Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit any harmful, threatening, or offensive content</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>
                Use the Service for any commercial purpose without permission
              </li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest user information</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Content and Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You retain ownership of all content you create using our Service.
              However, by using the Service, you grant us a limited license to
              store, process, and display your content as necessary to provide
              the Service.
            </p>
            <p>
              The Service itself, including its design, functionality, and
              underlying technology, is owned by Stickee Notes and protected by
              intellectual property laws.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. Please review our
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setLocation("/privacy-policy")}
              >
                Privacy Policy
              </Button>{" "}
              to understand how we collect, use, and protect your information.
            </p>
            <p>
              By using the Service, you consent to the collection and use of
              information in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We strive to provide continuous service availability, but we do
              not guarantee that the Service will be available at all times. The
              Service may be temporarily unavailable due to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Scheduled maintenance</li>
              <li>Technical difficulties</li>
              <li>Force majeure events</li>
              <li>Updates or improvements</li>
            </ul>
            <p>
              We are not liable for any loss or inconvenience resulting from
              Service unavailability.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To the maximum extent permitted by law, Stickee Notes shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from
              your use of the Service.
            </p>
            <p>
              Our total liability to you for any damages arising from or related
              to these Terms or the Service shall not exceed the amount you paid
              us for the Service in the twelve months preceding the claim.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will cease
              immediately. You may delete your account at any time through the
              Service settings.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will try to provide at least 30 days
              notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions
              become effective, you agree to be bound by the revised terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
