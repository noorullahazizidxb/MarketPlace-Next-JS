import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-padded py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="heading-xl">Page not found</h1>
        <p className="subtle mt-3">
          The page you requested doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="glass px-4 py-2 rounded">
            Go home
          </Link>
          <Link href="/settings" className="glass px-4 py-2 rounded">
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
