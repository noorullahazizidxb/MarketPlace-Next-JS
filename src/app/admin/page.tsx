"use client";
import { Card } from "@/components/ui/card";
import { Building2, Bell, Users2, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="heading-xl">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: "Listings", icon: Building2, value: "—" },
          { title: "Approved", icon: ShieldCheck, value: "—" },
          { title: "Users", icon: Users2, value: "—" },
          { title: "Notifications", icon: Bell, value: "—" },
        ].map((m) => (
          <Card key={m.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="subtle">{m.title}</p>
                <p className="text-3xl font-bold mt-1">{m.value}</p>
              </div>
              <m.icon className="size-7 text-primary" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
