import * as z from "zod";

export const consultationSchema = z.object({
  eventDate: z.string().min(1, { message: "Event date is required" }).refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, { message: "Event date must be in the future" }),
  eventType: z.string().min(1, { message: "Event type is required" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  message: z.string().max(500, { message: "Message cannot exceed 500 characters" }).optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;