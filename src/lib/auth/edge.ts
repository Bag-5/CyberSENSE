const textEncoder = new TextEncoder();

function base64UrlToUint8Array(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = globalThis.atob(`${base64}${padding}`);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export async function verifySessionTokenEdge(token: string) {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }

  const secretKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(process.env.CYBERSENSE_SESSION_SECRET || "cybersense-dev-session-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    textEncoder.encode(body),
  );

  const receivedBytes = base64UrlToUint8Array(signature);
  const expectedBytes = new Uint8Array(expectedSignature);

  if (receivedBytes.length !== expectedBytes.length) {
    return null;
  }

  let mismatch = 0;
  for (let index = 0; index < expectedBytes.length; index += 1) {
    mismatch |= expectedBytes[index] ^ receivedBytes[index];
  }

  if (mismatch !== 0) {
    return null;
  }

  try {
    const decodedBody = globalThis.atob(
      body.replace(/-/g, "+").replace(/_/g, "/") +
        "=".repeat((4 - (body.length % 4)) % 4),
    );
    return JSON.parse(decodedBody) as {
      userId: string;
      email: string;
      username: string;
      role: "user" | "admin";
    };
  } catch {
    return null;
  }
}
