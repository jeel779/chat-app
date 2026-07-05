import { z } from "zod";
export const signUpSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const signInSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const chatSchema = z.object({
    content: z.string().trim().min(1, "Chat content is required"),
});
//# sourceMappingURL=schemas.js.map