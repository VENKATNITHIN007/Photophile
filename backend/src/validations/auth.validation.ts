import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string({
        required_error: "Email Address is required",
        invalid_type_error: "Email must be a string"
    }).email('Invalid email'),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    })
    .min(8, 'Password must be at least 8 characters long')
    .refine(
        (password) => /[A-Z]/.test(password),
        { message: "Password must have at least one uppercase letter" }
    )
    .refine(
        (password) => /[a-z]/.test(password),
        { message: "Password must have at least one lowercase letter" }
    )
    .refine(
        (password) => /\d/.test(password),
        { message: "Password must have at least one number" }
    )
    .refine(
        (password) => /[!@#$%^&*(),.?\":{}|<>]/.test(password),
        { message: "Password must have at least one special character" }
    ),
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
    })
    .min(8, 'Password must be at least 8 characters long')
    .refine(
        (password) => /[A-Z]/.test(password),
        { message: "Password must have at least one uppercase letter" }
    )
    .refine(
        (password) => /[a-z]/.test(password),
        { message: "Password must have at least one lowercase letter" }
    )
    .refine(
        (password) => /\d/.test(password),
        { message: "Password must have at least one number" }
    )
    .refine(
        (password) => /[!@#$%^&*(),.?\":{}|<>]/.test(password),
        { message: "Password must have at least one special character" }
    ),
})

export type loginType = z.infer<typeof LoginSchema>;
export type registerType = z.infer<typeof RegisterSchema>;

export const UpdateProfileSchema = z.object({
    fullName: z.string().min(1, { message: "Full name must be 1 or more characters long" }).optional(),
    phoneNumber: z.string().optional(),
    avatar: z.string().url("Please provide a valid URL for the avatar").optional().or(z.literal("")),
});
export type updateProfileType = z.infer<typeof UpdateProfileSchema>;
