"use client";
import React from "react";
import Link from "next/link";

export default function AdminStoriesIndexPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="heading-xl">Stories (Admin)</h1>
        <Link href="/admin/stories/create" className="btn-primary">
          New Story
        </Link>
      </div>
      <p className="subtle">Use the create page to publish new stories.</p>
    </div>
  );
}
