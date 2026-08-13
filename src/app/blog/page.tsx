import { permanentRedirect } from "next/navigation";

export default function BlogIndexRedirect() {
  // Keep one canonical blog index while preserving the legacy singular route.
  permanentRedirect("/blogs");
}
