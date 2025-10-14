import { z } from "zod";

export const ListingSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((v) => String(v)),
  title: z.string().default("Untitled"),
  images: z
    .array(
      z.object({
        url: z.string().url().or(z.string()),
      })
    )
    .optional()
    .default([]),
  category: z.object({ name: z.string().optional().default("") }).optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

export const FollowerSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((v) => String(v)),
  fullName: z.string().optional().default(""),
  photo: z.string().optional().nullable(),
});
export type Follower = z.infer<typeof FollowerSchema>;

export const PublicUserSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((v) => String(v)),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  fullName: z.string().optional().nullable(),
  contacts: z.any().optional().nullable(),
  // backend returns address as object { city, street, country }
  address: z
    .union([
      z.object({ city: z.string().optional().nullable(), street: z.string().optional().nullable(), country: z.string().optional().nullable() }),
      z.string(),
    ])
    .optional()
    .nullable(),
  metadata: z.any().optional().nullable(),
  // backend returns roles as array of objects with a 'role' field
  roles: z
    .array(
      z.union([
        z.string(),
        z.object({ role: z.string() }).transform((r) => r.role),
      ])
    )
    .optional()
    .default([] as string[]),
  listings: z.array(ListingSchema).optional().default([]),
  representatives: z.any().optional().default([]),
  followers: z.array(FollowerSchema).optional().default([]),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;
