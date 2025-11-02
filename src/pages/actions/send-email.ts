import type { APIRoute } from "astro";
import { sendEmail } from "../../utils/email";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  // Get the form data submitted by the user on the home page
  const from = "contact@neuroinclusivespeech.com";
  const formData = await request.formData();
  const email = formData.get("from") as string | null;
  const phone = formData.get("phone") as string | null;
  const message = formData.get("message") as string | null;

  // Throw an error if we're missing any of the needed fields.
  if (!email || !message) {
    throw new Error("Missing required fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    throw new Error("Invalid email address");
  }

  const subject = `New contact form submission from ${email}${phone ? ` | Phone: ${phone}` : ""}`;

  // Try to send the email using a `sendEmail` function we'll create next. Throw
  // an error if it fails.
  try {
    const html = `<div>${message}</div>`;
    await sendEmail({ from, subject, html });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }

  // Redirect the user to a success page after the email is sent.
  return redirect("/success");
};