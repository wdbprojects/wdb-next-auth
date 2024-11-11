import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "A valid email is required" }),
  password: z.string().min(1, "Password is required"),
});

export const registerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
