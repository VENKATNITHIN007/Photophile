import z from "zod";
import { MAX_FILE_SIZE } from "../constants/upload";

export const fileValidator = (acceptedTypes: string[], label: string) => {
    return z
        .any()
        .refine((files) => files?.length === 1, {
            message: `${label} is required.`,
        })
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
            message: `${label} must be under 50MB.`,
        })
        .refine((files) => acceptedTypes.includes(files?.[0]?.mimetype), {
            message: `Only ${acceptedTypes.map((type) => "." + type.split("/")[1]).join(", ")} ${label.toLowerCase()} files are allowed.`,
        });
};