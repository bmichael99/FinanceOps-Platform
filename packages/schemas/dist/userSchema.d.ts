import * as z from "zod";
export declare const userSchema: z.ZodObject<{
    firstName: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type userType = z.infer<typeof userSchema>;
