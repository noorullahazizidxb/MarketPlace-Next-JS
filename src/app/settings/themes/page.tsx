import { redirect } from "next/navigation";

/** Themes settings redirect — `data-app-page` lives on appearance after redirect. */
export default function ThemesRedirect() {
  redirect("/settings/appearance");
}
