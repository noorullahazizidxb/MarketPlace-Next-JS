"use client";
import React from "react";
import { useSocialRealtime } from "@/lib/use-social-realtime";

export default function SocialRealtimeClient() {
  useSocialRealtime(true);
  return null;
}
