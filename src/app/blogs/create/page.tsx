"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BlogCreateWizard from "@/components/blogs/BlogCreateWizard";

export default function BlogCreatePage() {
  const router = useRouter();
  const onClose = () => router.push("/blogs");
  return (
    <Dialog open onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="w-full max-w-3xl p-0 overflow-hidden">
        <BlogCreateWizard onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
