import ContactForm from "@/components/contact-form";
import { ContactContent } from "./contact-content";

export const metadata = {
  title: "Contact | Your Marketplace Name",
};

export default function ContactPage() {
  return (
    <main className="pb-20">
      <ContactContent />
      <ContactForm />
    </main>
  );
}
