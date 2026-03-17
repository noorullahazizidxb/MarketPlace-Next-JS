"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import StoryCreateModal from "@/components/ui/StoryCreateModal";

export default function AdminCreateStoryPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { roles } = useAuth();

  React.useEffect(() => {
    if (roles && !roles.includes("ADMIN")) router.replace("/sign-in");
  }, [roles, router]);

  const id = params.get("id") || undefined;
  const initial = {
    title: params.get("title") || undefined,
    description: params.get("description") || undefined,
    videoUrl: params.get("videoUrl") || undefined,
  };
  const onClose = () => router.push("/admin/stories");

  return (
    <StoryCreateModal open onClose={onClose} storyId={id} initial={initial} />
  );
}
