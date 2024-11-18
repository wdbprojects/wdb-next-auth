import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "A valid email is required" }),
  password: z.string().min(1, "Password is required"),
});

export const registerFormSchema = z.object({
  firstName: z.string().min(1, "Required field"),
  lastName: z.string().min(1, "Required field"),
  email: z.string().email({ message: "A valid email is required" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "A valid email is required" }),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
