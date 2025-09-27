import { Card, CardContent } from "@/components/ui/card";
import { StickyNote, Smartphone, Cloud, Shield } from "lucide-react";
import { SignInWithGoogle } from "@/components/signin/signin-with-google";

export default function Landing() {
  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile First",
      description: "Optimized for mobile devices with offline support",
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Sync",
      description: "Your notes sync across all your devices instantly",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with industry-standard security",
    },
  ];

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Full Page Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/landing-page-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex">
        {/* Left Side - App Info (60%) */}
        <div className="hidden lg:flex lg:w-3/5 flex-col justify-center px-16 py-8">
          <div className="max-w-lg">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <StickyNote className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Stickee Notes</h1>
                <p className="text-lg text-white/80">Smart sticky notes app</p>
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-white mb-4">
              Organize Your Thoughts
            </h2>
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Capture ideas instantly, organize them smartly, and access them
              anywhere. Your personal digital workspace that adapts to your
              workflow.
            </p>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form (40%) */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6">
          {/* App branding for mobile - above the sign-in container */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <StickyNote className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Stickee Notes</h1>
            <p className="text-lg text-white/80">Smart sticky notes app</p>
          </div>

          <div className="w-full max-w-md">
            <Card className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                    <StickyNote className="text-white text-2xl" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-white/80">Sign in to your account</p>
                </div>

                <div className="space-y-4">
                  <SignInWithGoogle />

                  <p className="text-center text-sm text-white/80">
                    Sign in with your Google account to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-white/20 py-4 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-white/80">
              <a
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookie-policy"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
            <div className="text-sm text-white/80">
              © {new Date().getFullYear()} Stickee Notes. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
