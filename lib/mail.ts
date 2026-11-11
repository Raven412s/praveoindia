import nodemailer from "nodemailer";

/**
 * SMTP transport for the "Notify me" waitlist emails.
 * Credentials come from .env (see the setup guide inside that file).
 * Returns null when SMTP is not configured so callers can respond with a
 * clear "service not configured" error instead of crashing.
 */
export function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host,
    port,
    // Port 465 speaks TLS from the first byte; 587 upgrades via STARTTLS.
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
}

/** Brand tokens — mirror app/globals.css so mail matches the site. */
const BRAND = {
  bg: "#f5f1e8",
  ink: "#202020",
  card: "#ffffff",
  accent: "#7b3fe4", // --pro, the default concept accent
  on: "#ffffff",
  muted: "#6f6a60",
};

const NEXT_STEPS: Array<[string, string]> = [
  ["01", "We lock in the first cart locations and dates."],
  ["02", "You get one short email the moment we launch — no spam, ever."],
  ["03", "You show up, scan, and eat. Simple as that."],
];

/**
 * The waitlist confirmation email. Built as nested tables with inline
 * styles — the only layout that renders consistently across Gmail, Outlook
 * and Apple Mail. No external images, so nothing can fail to load.
 */
export function notifyEmailHtml(email: string) {
  const steps = NEXT_STEPS.map(
    ([n, text]) => `
    <tr>
      <td style="padding:0 0 14px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="44" valign="top">
              <div style="width:30px;height:30px;line-height:30px;text-align:center;
                background:${BRAND.accent};color:${BRAND.on};border-radius:999px;
                font-family:Arial,sans-serif;font-size:11px;font-weight:bold;">${n}</div>
            </td>
            <td style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;
              color:${BRAND.ink};padding-left:6px;padding-top:5px;">${text}</td>
          </tr>
        </table>
      </td>
    </tr>`
  ).join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>You're on the PRAVEO list</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:${BRAND.bg};">
      <tr>
        <td align="center" style="padding:40px 16px;">

          <table role="presentation" width="600" cellpadding="0" cellspacing="0"
            style="width:100%;max-width:600px;background:${BRAND.card};
              border:3px solid ${BRAND.ink};border-radius:20px;overflow:hidden;">

            <!-- ── Brand header ─────────────────────────────────────── -->
            <tr>
              <td style="background:${BRAND.accent};padding:26px 40px;">
                <span style="font-family:Arial,sans-serif;font-size:26px;
                  font-weight:900;letter-spacing:0.08em;color:${BRAND.on};">
                  PRAVEO
                </span>
                <span style="font-family:Arial,sans-serif;font-size:11px;
                  font-weight:bold;letter-spacing:0.14em;color:${BRAND.on};
                  opacity:.85;display:block;margin-top:4px;">
                  MORE THAN FOOD. IT'S YOUR VYBE.
                </span>
              </td>
            </tr>

            <!-- ── Body ─────────────────────────────────────────────── -->
            <tr>
              <td style="padding:40px 40px 8px;">
                <p style="margin:0 0 10px;font-family:Arial,sans-serif;
                  font-size:12px;font-weight:bold;letter-spacing:0.18em;
                  color:${BRAND.accent};">
                  YOU'RE ON THE LIST
                </p>
                <h1 style="margin:0 0 18px;font-family:Arial,sans-serif;
                  font-size:34px;font-weight:900;line-height:1.05;
                  letter-spacing:-0.02em;color:${BRAND.ink};">
                  Welcome aboard,
                  <br />future foodie. 🚚
                </h1>
                <p style="margin:0 0 26px;font-family:Arial,sans-serif;
                  font-size:15px;line-height:1.7;color:${BRAND.ink};opacity:.8;">
                  Your email <strong style="color:${BRAND.ink};">${email}</strong>
                  is officially on the PRAVEO waitlist. The carts are being
                  painted, the menus perfected and the wheels greased —
                  good food is rolling your way soon.
                </p>

                <p style="margin:0 0 16px;font-family:Arial,sans-serif;
                  font-size:12px;font-weight:bold;letter-spacing:0.18em;
                  color:${BRAND.ink};opacity:.55;">
                  WHAT HAPPENS NEXT
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0"
                  width="100%">${steps}</table>
              </td>
            </tr>

            <!-- ── CTA ──────────────────────────────────────────────── -->
            <tr>
              <td style="padding:26px 40px 40px;">
                <a href="https://praveoindia.com"
                  style="display:inline-block;background:${BRAND.ink};
                    color:${BRAND.bg};font-family:Arial,sans-serif;
                    font-size:15px;font-weight:bold;text-decoration:none;
                    padding:14px 34px;border-radius:999px;">
                  Explore the five carts →
                </a>
                <p style="margin:18px 0 0;font-family:Arial,sans-serif;
                  font-size:14px;color:${BRAND.ink};">
                  Hungry for updates? Follow along — we'll see you at the cart.
                </p>
                <p style="margin:6px 0 0;font-family:Arial,sans-serif;
                  font-size:14px;font-weight:bold;color:${BRAND.ink};">
                  — Team PRAVEO
                </p>
              </td>
            </tr>

            <!-- ── Footer ───────────────────────────────────────────── -->
            <tr>
              <td style="background:${BRAND.bg};padding:20px 40px;
                border-top:2px solid ${BRAND.ink};">
                <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;
                  line-height:1.6;color:${BRAND.muted};">
                  You're receiving this because ${email} joined the PRAVEO
                  waitlist. One launch email, that's it — we're too busy
                  cooking to spam you.
                  <br />
                  © ${new Date().getFullYear()} PRAVEO. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Plain-text alternative for clients that block HTML. */
export function notifyEmailText(email: string) {
  return `PRAVEO — YOU'RE ON THE LIST

Welcome aboard, future foodie.

${email} is officially on the PRAVEO waitlist. The carts are being painted,
the menus perfected and the wheels greased — good food is rolling your way soon.

WHAT HAPPENS NEXT
${NEXT_STEPS.map(([n, t]) => `${n}. ${t}`).join("\n")}

Explore the five carts: https://praveoindia.com

— Team PRAVEO

You're receiving this because ${email} joined the PRAVEO waitlist.
One launch email, that's it — we're too busy cooking to spam you.
© ${new Date().getFullYear()} PRAVEO. All rights reserved.`;
}
