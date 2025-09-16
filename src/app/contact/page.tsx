import ContactForm from "../../components/contact-form";

export const metadata = {
  title: "Contact | Your Marketplace Name",
};

export default function ContactPage() {
  return (
    <main className="pb-20">
      <Header />
      <ContactInfo />
      <ContactForm />
    </main>
  );
}

function Header() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))]">
        Get in Touch
      </h1>
      <p className="mt-2 text-[hsl(var(--foreground))]/80 max-w-2xl">
        Have a question, a suggestion, or need support? We'd love to hear from
        you.
      </p>
    </section>
  );
}

function ContactInfo() {
  const cards = [
    {
      title: "General Inquiries",
      text: "contact@your-marketplace-name.com",
      href: "mailto:contact@your-marketplace-name.com",
      icon: (
        <svg
          className="h-6 w-6 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M3 7l9 6 9-6" opacity=".4" />
          <path d="M3 7h18v10H3z" opacity=".2" />
          <path d="M3 17l6-4" />
        </svg>
      ),
    },
    {
      title: "Technical Support",
      text: "support@your-marketplace-name.com",
      href: "mailto:support@your-marketplace-name.com",
      icon: (
        <svg
          className="h-6 w-6 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" opacity=".2" />
          <path d="M9 10a3 3 0 116 0v4H9v-4z" />
          <circle cx="12" cy="17" r="1.25" />
        </svg>
      ),
    },
    {
      title: "Our Location",
      text: "Your City, State",
      href: "#",
      icon: (
        <svg
          className="h-6 w-6 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z"
            opacity=".2"
          />
          <circle cx="12" cy="9" r="3" />
        </svg>
      ),
    },
    {
      title: "FAQs",
      text: "Find answers to common questions",
      href: "/faq",
      icon: (
        <svg
          className="h-6 w-6 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" opacity=".2" />
          <path d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 3" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      ),
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition hover:bg-[hsl(var(--muted))]/10"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0">{c.icon}</div>
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-[hsl(var(--foreground))]/80">
                  {c.text}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
