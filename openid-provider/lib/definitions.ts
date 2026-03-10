import z from "zod";

export const SignupFormSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Be atleast 8 characters")
    .regex(/[A-Z]/, "Contain atleast one uppercase letter")
    .regex(/[a-z]/, "Contain atleast one lowercase letter")
    .regex(/[0-9]/, "Contain atleast one number")
    .regex(/[^A-Za-z0-9]/, "Contain atleast one special character"),
});
