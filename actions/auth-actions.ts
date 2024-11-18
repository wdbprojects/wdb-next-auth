"use server";

import {
  forgotPasswordSchema,
  loginFormSchema,
  newPasswordSchema,
  registerFormSchema,
} from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { MAILPOST, sendPasswordReset } from "@/lib/mail";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";

/* LOGIN USER ACTION */
export const loginAction = async (
  values: z.infer<typeof loginFormSchema>,
): Promise<{ error?: string; success?: string } | undefined> => {
  const validatedFields = loginFormSchema.safeParse(values);
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
    await MAILPOST(verificationToken.email, verificationToken.token);
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

/* REGISTER USER ACTION */
export const registerAction = async (
  values: z.infer<typeof registerFormSchema>,
) => {
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
  await MAILPOST(verificationToken.email, verificationToken.token);
  return { success: "Confirmation email sent!" };
};

/* CONFIRM NEW USER ACTION */
export const newVerificationAction = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return { success: "Email verified!" };
};

/* REQUEST RESET PASSWORD ACTION */
export const resetPasswordAction = async (
  values: z.infer<typeof forgotPasswordSchema>,
) => {
  const validatedFields = forgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }
  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordReset(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};

/* CREATE NEW PASSWORD ACTION */
export const createNewPasswordAction = async (
  values: z.infer<typeof newPasswordSchema>,
  token: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const validatedFields = newPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return { success: "Password updated successfully!" };
};
