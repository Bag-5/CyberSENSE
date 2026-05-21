import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SESSION_SEPARATOR = ".";

export function getAuthSecret() {
  return process.env.CYBERSENSE_SESSION_SECRET || "cybersense-dev-session-secret";
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateId() {
  return randomBytes(16).toString("hex");
}

export function hashOtpCode(code: string, email: string) {
  return createHmac("sha256", getAuthSecret())
    .update(`${email.toLowerCase().trim()}|${code}`)
    .digest("hex");
}

export function createSessionToken(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getAuthSecret()).update(body).digest("base64url");
  return `${body}${SESSION_SEPARATOR}${signature}`;
}

export function verifySessionToken(token: string) {
  const [body, signature] = token.split(SESSION_SEPARATOR);
  if (!body || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getAuthSecret())
    .update(body)
    .digest("base64url");

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      userId: string;
      email: string;
      username: string;
      role: "user" | "admin";
    };
  } catch {
    return null;
  }
}
