import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function MAILPOST(
  email: string,
  token: string,
): Promise<Response> {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email",
      html: `
      <p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
    });
    if (error) {
      return Response.json({ error: error }, { status: 500 });
    }
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}

export const sendPasswordReset = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  });
};
