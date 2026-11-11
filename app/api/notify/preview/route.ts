import { notifyEmailHtml } from "@/lib/mail";

/**
 * GET /api/notify/preview — dev-only preview of the waitlist email.
 *
 * Open http://localhost:3000/api/notify/preview in your browser to see
 * exactly how the mail sent by POST /api/notify renders, without sending
 * anything. Disabled in production (404) so it never leaks the template.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  return new Response(notifyEmailHtml("you@example.com"), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
