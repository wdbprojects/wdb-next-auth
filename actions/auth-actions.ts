"use server";

import { loginFormSchema, registerFormSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { POST } from "@/app/api/send/route";

export const loginAction = async (
  values: z.infer<typeof loginFormSchema>,
): Promise<{ error?: string; success?: string } | undefined> => {
  const validatedFields = loginFormSchema.safeParse(values);
  console.log(validatedFields);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    await POST(verificationToken.email, verificationToken.token);
    return { success: "Confirmation email sent!" };
  }
  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};

export const registerAction = async (
  values: z.infer<typeof registerFormSchema>,
) => {
  console.log(values);
  const validatedFields = registerFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { firstName, lastName, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "A user already exists with this email" };
  }
  await db.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await POST(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
