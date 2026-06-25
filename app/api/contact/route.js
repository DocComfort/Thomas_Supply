import { NextResponse } from "next/server";

// Where contact messages are delivered. Set these in Vercel → Settings → Environment Variables.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "sales@thomassupply.net";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone, address, city, state, message, company } = data || {};

  // Honeypot: real users never fill the hidden "company" field.
  if (company) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email, and message." },
      { status: 400 }
    );
  }

  const text = [
    `New message from the Thomas Supply website`,
    `--------------------------------------------`,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "-"}`,
    `Address: ${[address, city, state].filter(Boolean).join(", ") || "-"}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  // If no email provider is configured yet, accept the message and log it
  // (visible in Vercel → Project → Logs) so the form still works during setup.
  if (!RESEND_API_KEY) {
    console.log("[contact] (no RESEND_API_KEY set)\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Thomas Supply Website <${CONTACT_FROM_EMAIL}>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Website inquiry from ${name}`,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[contact] Resend error:", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "We couldn't send your message. Please call your branch." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please call your branch." },
      { status: 500 }
    );
  }
}
