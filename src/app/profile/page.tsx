"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation } from "@/lib/api-hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fullName: z.string().min(3),
  phone: z.string().min(5),
  city: z.string().min(1).optional().default(""),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  });

  const updateProfile = useApiMutation("put", "/users/me");

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await updateProfile.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        phone: data.phone,
        address: { city: data.city },
      });
      reset();
    } catch (e: any) {
      setError(e?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="p-6 glass">
        <h1 className="heading-xl mb-4">Your profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First name</label>
              <Input {...register("firstName")} />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Last name</label>
              <Input {...register("lastName")} />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <Input {...register("fullName")} />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <Input {...register("phone")} />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <Input {...register("city")} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting || updateProfile.isPending}
          >
            Save
          </Button>
        </form>
      </Card>
    </div>
  );
}
