import type { CalendarEvent } from "~/lib/types";

function pemToDer(pem: string): ArrayBuffer {
  const cleaned = pem
    .replace(/\\n/g, "\n")
    .replace(/-----[^-]+-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64urlBytes(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlString(str: string): string {
  return base64urlBytes(new TextEncoder().encode(str));
}

function buildSigningInput(serviceAccountEmail: string, nowSec: number): string {
  const header = base64urlString(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64urlString(
    JSON.stringify({
      iss: serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: nowSec,
      exp: nowSec + 3600,
    })
  );
  return `${header}.${payload}`;
}

async function signJwt(privateKeyDer: ArrayBuffer, signingInput: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyDer,
    { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );
  return base64urlBytes(new Uint8Array(signatureBuffer));
}

async function getAccessToken(serviceAccountEmail: string, privateKeyPem: string): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const der = pemToDer(privateKeyPem);
  const signingInput = buildSigningInput(serviceAccountEmail, nowSec);
  const signature = await signJwt(der, signingInput);
  const jwt = `${signingInput}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google token exchange failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function fetchCalendarEvents(
  calendarId: string,
  serviceAccountEmail: string,
  privateKeyPem: string
): Promise<CalendarEvent[]> {
  const token = await getAccessToken(serviceAccountEmail, privateKeyPem);

  const now = new Date();
  const threeMonthsOut = new Date(now);
  threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);

  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "100",
    timeMin: now.toISOString(),
    timeMax: threeMonthsOut.toISOString(),
  });

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Calendar API failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    items?: CalendarEvent[];
    error?: { message: string };
  };

  if (data.error) {
    throw new Error(`Google Calendar API error: ${data.error.message}`);
  }

  return data.items ?? [];
}
