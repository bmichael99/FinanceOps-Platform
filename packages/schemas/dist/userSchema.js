import * as z from "zod";
export const userSchema = z.object({
    firstName: z.string().min(2, {
        error: "Firstname must be at least 2 characters."
    }),
    username: z.string().min(4, {
        error: "username must be at least 4 characters."
    }),
    password: z.string().min(7, {
        error: "password must be at least 7 characters."
    }),
});
