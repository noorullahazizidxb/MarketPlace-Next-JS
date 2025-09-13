"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight, Bell, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <motion.section
        className="glass rounded-2xl p-6 md:p-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="heading-xl">Futuristic Marketplace Dashboard</h1>
            <p className="subtle mt-2">
              Sleek, minimal, and responsive. Built with Next.js, Tailwind,
              shadcn-style UI, and framer-motion.
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary">Create Listing</Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">New Listing</h3>
                  <Input placeholder="Title" />
                  <Input placeholder="Price" type="number" />
                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="primary" RightIcon={ArrowRight}>
                      Continue
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" RightIcon={ArrowRight}>
              Explore
            </Button>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { title: "Active Listings", value: "128", Icon: Building2 },
          { title: "Notifications", value: "12", Icon: Bell },
          { title: "Conversion", value: "4.7%", Icon: ArrowRight },
        ].map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
          >
            <Card className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="subtle">{c.title}</p>
                  <p className="text-3xl font-bold mt-1">{c.value}</p>
                </div>
                <c.Icon className="size-8 text-primary" />
              </div>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
