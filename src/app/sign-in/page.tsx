"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-[hsl(var(--border))] backdrop-blur bg-background/60 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/80 to-fuchsia-500/60 text-background grid place-items-center font-bold">
            M
          </div>
          <div>
            <h1 className="heading-lg">Welcome back</h1>
            <p className="subtle text-sm">Sign in to continue</p>
          </div>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Email</label>
            <input
              type="email"
              required
              className="w-full h-11 rounded-2xl px-3 bg-transparent border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Password</label>
            <input
              type="password"
              required
              className="w-full h-11 rounded-2xl px-3 bg-transparent border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm inline-flex items-center gap-2">
              <input type="checkbox" className="rounded-md" />
              Remember me
            </label>
            <Link
              href="#"
              className="text-sm text-[hsl(var(--accent))] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1">
              Sign In
            </Button>
            <Button asChild variant="accent" className="flex-1">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm subtle">
          By continuing you agree to our{" "}
          <a href="#" className="text-[hsl(var(--accent))] hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-[hsl(var(--accent))] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
