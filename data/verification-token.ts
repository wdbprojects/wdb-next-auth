import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token: token },
    });
    return verificationToken;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email: email },
    });
    return verificationToken;
  } catch (err) {
    console.log(err);
    return null;
  }
};
