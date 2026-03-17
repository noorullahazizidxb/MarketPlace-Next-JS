"use client";
import React from "react";
import { useAuth } from "@/lib/use-auth";
import { useRealtimeSocial } from "@/hooks/useRealtimeSocial";

export default function SocialRealtimeClient() {
  const { token } = useAuth();
  useRealtimeSocial(token ?? undefined);
  return null;
}
