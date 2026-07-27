import { redirect } from "next/navigation";

export default function ThemesRedirect() {
  redirect("/settings/appearance");
}
