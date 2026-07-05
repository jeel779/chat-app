import { z } from "zod";
export declare const signUpSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const chatSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
//# sourceMappingURL=schemas.d.ts.map