import * as z from "zod";

export const photographerOnboardingSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  location: z.string().min(1, { message: "Please select a location" }),
  specialties: z.array(z.string())
    .min(1, { message: "Please select at least one specialty" })
    .max(3, { message: "You can select up to 3 specialties" }),
  priceFrom: z.string().optional(),
});

export type PhotographerOnboardingInput = z.infer<typeof photographerOnboardingSchema>;