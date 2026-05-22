import nodemailer from "nodemailer";

type OtpEmailInput = {
  to: string;
  username: string;
  otp: string;
  expiresInMinutes: number;
};

function requireEnv(name: string, options?: { stripWhitespace?: boolean }) {
  const rawValue = process.env[name];
  const value = options?.stripWhitespace
    ? rawValue?.replace(/\s+/g, "")
    : rawValue?.trim();
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function createTransport() {
  const user = requireEnv("GMAIL_USER_EMAIL");
  const pass = requireEnv("GMAIL_APP_PASSWORD", { stripWhitespace: true });

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail({ to, username, otp, expiresInMinutes }: OtpEmailInput) {
  const sender = requireEnv("GMAIL_USER_EMAIL");
  const transport = createTransport();

  await transport.sendMail({
    from: `CyberSENSE <${sender}>`,
    to,
    subject: "Your CyberSENSE verification code",
    text: [
      `Hi ${username},`,
      "",
      `Your CyberSENSE verification code is: ${otp}`,
      "",
      `This code expires in ${expiresInMinutes} minutes.`,
      "If you did not request this code, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; background:#060816; color:#e5eefb; padding:32px;">
        <div style="max-width:560px; margin:0 auto; border:1px solid rgba(34,211,238,0.18); border-radius:24px; padding:32px; background:rgba(12,16,36,0.95);">
          <p style="letter-spacing:0.24em; text-transform:uppercase; color:#7dd3fc; font-size:12px; margin:0 0 16px;">CyberSENSE</p>
          <h1 style="margin:0 0 16px; font-size:28px; line-height:1.2; color:#ffffff;">Your verification code</h1>
          <p style="margin:0 0 20px; font-size:16px; line-height:1.6;">Hi ${username}, use the code below to complete your sign in.</p>
          <div style="display:inline-block; padding:16px 24px; border-radius:18px; border:1px solid rgba(34,211,238,0.3); background:rgba(34,211,238,0.12); color:#67e8f9; font-size:28px; font-weight:700; letter-spacing:0.3em;">${otp}</div>
          <p style="margin:20px 0 0; font-size:14px; line-height:1.6; color:#b7c4d9;">This code expires in ${expiresInMinutes} minutes. If you did not request it, you can safely ignore this message.</p>
        </div>
      </div>
    `,
  });
}
