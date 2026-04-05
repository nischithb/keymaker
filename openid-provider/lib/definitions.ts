import z from "zod";

export const SignupFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be atleast 2 characters long"),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z
    .string()
    .min(8, "Be atleast 8 characters")
    .max(128, "Be less than 128 characters")
    .regex(/[A-Z]/, "Contain atleast one uppercase letter")
    .regex(/[a-z]/, "Contain atleast one lowercase letter")
    .regex(/[0-9]/, "Contain atleast one number")
    .regex(/[^A-Za-z0-9]/, "Contain atleast one special character"),
});

export const LoginFormSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z
    .string()
    .min(1, "Password can't be empty")
    .max(128, "Password is too long"),
});

const appConfigurationSchema = {
  name: z.string().trim().min(2, "Name must be atleast 2 characters long"),
  description: z.string().trim().optional(),
  homepageUrl: z.httpUrl(),
  callbackUrl: z.httpUrl(),
};

export const RegisterApplicationSchema = z.object({
  ...appConfigurationSchema,
});

export const UpdateApplicationSchema = z.object({
  ...appConfigurationSchema,
  id: z.string().trim(),
});

export const PasswordReauthSchema = z.object({
  password: z
    .string()
    .min(1, "Password can't be empty")
    .max(128, "Password is too long"),
});
