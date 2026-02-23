import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string({
        required_error: "Email Address is required",
        invalid_type_error: "Email must be a string"
    }).email('Invalid email'),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    }).min(6, 'Password must be at least 6 characters long'),
});

export const RegisterSchema = z.object({
    fullName: z.string({
        required_error: "full Name is required",
        invalid_type_error: "Full Name must be a string"
    }).min(1, { message: "Full name must be 1 or more characters long" }),
    email: z.string({
        required_error: "Email Address is required",
        invalid_type_error: "Email must be a string"
    }).email('Invalid email'),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    }).min(6, 'Password must be at least 6 characters long'),
})

export type loginType = z.infer<typeof LoginSchema>;
export type registerType = z.infer<typeof RegisterSchema>;
export const UpdateProfileSchema = z.object({
    fullName: z.string().min(1, { message: "Full name must be 1 or more characters long" }).optional(),
    phoneNumber: z.string().optional(),
    avatar: z.string().url("Please provide a valid URL for the avatar").optional().or(z.literal("")),
});
export type updateProfileType = z.infer<typeof UpdateProfileSchema>;
