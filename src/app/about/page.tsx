import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Box,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const MARKETPLACE_NAME = "Your Marketplace Name";

export const metadata = {
  title: `About | ${MARKETPLACE_NAME}`,
};

export default function AboutPage() {
  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2000&auto=format&fit=crop"
            alt="Community background"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))]/40 via-[hsl(var(--background))]/40 to-[hsl(var(--background))]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              The Future of Ownership is Flexible
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[hsl(var(--foreground))]/85">
              At {MARKETPLACE_NAME}, our mission is to build a sustainable
              community where anyone can access what they need by renting when
              it makes sense — and sell when it’s time to pass things on.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary">
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 px-5 py-3 h-auto"
                >
                  Browse Listings <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 px-5 py-3 h-auto"
                >
                  Become a Seller <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h2 className="text-xl font-semibold">Our Mission</h2>
            <p className="mt-2 text-[hsl(var(--foreground))]/80">
              To empower people to make smarter, more sustainable choices by
              providing a single, trusted platform for renting and selling.
            </p>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h2 className="text-xl font-semibold">Our Vision</h2>
            <p className="mt-2 text-[hsl(var(--foreground))]/80">
              To build the world’s largest circular economy, reducing waste and
              making goods more accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <Box className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">List Your Item</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              Choose to rent, sell, or both — it’s your call.
            </p>
          </div>
          {/* Step 2 */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">Connect Securely</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              Communicate with trusted members of our community.
            </p>
          </div>
          {/* Step 3 */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">Transact with Confidence</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              Use our secure payment and booking system.
            </p>
          </div>
          {/* Step 4 */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">Enjoy the Flexibility</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              Rent when you need, sell when you’re done — simple.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-10">
          <h2 className="text-2xl font-semibold">
            The Story Behind {MARKETPLACE_NAME}
          </h2>
          <div className="mt-4 space-y-3 text-[hsl(var(--foreground))]/80">
            <p>
              We noticed people owned expensive equipment that sat unused for
              months. Cameras on shelves, tents in closets, tools in garages.
              Meanwhile, others in the same community needed access to those
              exact items — but didn’t want the full commitment of buying.
            </p>
            <p>
              {MARKETPLACE_NAME} was born from a simple idea: what if accessing
              great gear could be as easy as borrowing from a friend — and
              selling could be as simple as telling your community? By blending
              rentals and sales into a single trusted platform, we help people
              get more value from the things they own, and reduce waste along
              the way.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <h2 className="text-2xl font-semibold">Meet the Team</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Alex Kim", title: "Founder & CEO" },
            { name: "Samira Patel", title: "Co‑Founder & CPO" },
            { name: "Diego Rivera", title: "Co‑Founder & CTO" },
          ].map((m, i) => (
            <article
              key={m.name}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-15${
                  i + 1
                }27157730-0d3a42b2c3f4?q=80&w=600&auto=format&fit=crop`}
                alt={m.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="text-sm text-[hsl(var(--foreground))]/70">
                {m.title}
              </p>
              <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
                Passionate about circular economies and building products people
                love.
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--primary))]/15 via-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/15 p-8 text-center">
          <h2 className="text-2xl font-semibold">Join Our Growing Community</h2>
          <p className="mt-2 text-foreground/80">
            Find what you need, when you need it — or help someone else do the
            same.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="primary">
              <Link href="/listings" className="px-5 py-3 h-auto">
                Browse Listings
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/sign-in" className="px-5 py-3 h-auto">
                Become a Seller
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// All icons use lucide-react imports above.
