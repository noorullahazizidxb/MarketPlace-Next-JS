import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function RootRedirect() {
  const session = await getSession();
  const roles: string[] = session?.user?.roles?.map((r: any) => r.role) ?? [];
  const isAdmin = roles.includes("ADMIN");
  redirect(isAdmin ? "/admin" : "/listings");
}
