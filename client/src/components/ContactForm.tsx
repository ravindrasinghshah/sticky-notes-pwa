import { Button } from "@/components/ui/button";

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = "" }: ContactFormProps) {
  return (
    <div className={`bg-muted p-4 rounded-lg ${className}`}>
      <p>
        If you have any questions or feedback about the app, please reach out to us through our{" "}
        <Button
          variant="link"
          className="p-0 h-auto text-primary underline"
          onClick={() => window.open("https://forms.gle/nMvZ8tPHqvqX1Twa6", "_blank")}
        >
          contact form
        </Button>
        .
      </p>
    </div>
  );
}
