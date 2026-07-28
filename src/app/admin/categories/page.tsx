// NOTE: Place this file at: app/admin/categories/page.tsx
// Requires auth: only ADMIN role should access. Adjust useAuth hook if roles naming differs.
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
// server-side page: keep static strings or use server translation helper if available

export default async function AdminCategoriesPage() {
  const session = await getSession();
  const roles: string[] = session?.user?.roles?.map((r: any) => r.role) ?? [];
  const isAdmin = roles.includes("ADMIN");
  if (!isAdmin) {
    return (
      <div className="container-padded py-24 text-center space-y-6 app-shell-page" data-app-page="admin-categories">
        <h1 className="heading-xl">Not Authorized</h1>
        <p className="subtle max-w-md mx-auto">
          You need administrator privileges to manage categories.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[var(--ctrl-h)] px-6 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-medium border-[var(--border)] hover:[background-color:var(--btn-accent-hover-bg,var(--primary))] hover:[color:var(--btn-accent-hover-fg,var(--accent-foreground))]"
        >
          Go Home
        </Link>
      </div>
    );
  }
  return (
    <div className="container-padded py-10 space-y-8 app-shell-page" data-app-page="admin-categories">
      <div className="space-y-2">
        <h1 className="app-text-heading font-semibold tracking-tight">Categories</h1>
        <p className="app-text-body subtle max-w-2xl">
          Create and manage nested categories. Expand a category to view its sub
          categories and recent listings.
        </p>
      </div>
      <CategoriesTable />
    </div>
  );
}
