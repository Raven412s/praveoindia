import { createTransport, notifyEmailHtml, notifyEmailText } from "@/lib/mail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * POST /api/notify — body: { email: string }
 *
 * Sends the branded waitlist confirmation to the submitted address using
 * the SMTP credentials from .env. Responds with a generic success even for
 * duplicated/typo'd-but-valid addresses, but never leaks whether an
 * address actually received mail.
 */
export async function POST(request: Request) {
  let email = "";

  try {
    const body = (await request.json()) as { email?: unknown };
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const transporter = createTransport();
  if (!transporter) {
    // Not configured — surface a clear message instead of a silent 500.
    // ( SMTP_HOST / SMTP_USER / SMTP_PASS live in .env — see setup notes there.)
    console.error("[notify] SMTP not configured: set SMTP_* values in .env");
    return Response.json(
      { ok: false, error: "Mail service is not configured yet. Try again soon." },
      { status: 503 }
    );
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || `PRAVEO <${process.env.SMTP_USER}>`,
      to: email,
      replyTo: process.env.SMTP_USER,
      subject: "You're on the list — PRAVEO is rolling in soon 🚚",
      text: notifyEmailText(email),
      html: notifyEmailHtml(email),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[notify] failed to send confirmation:", error);
    return Response.json(
      { ok: false, error: "Could not send the email right now. Try again." },
      { status: 500 }
    );
  }
}
