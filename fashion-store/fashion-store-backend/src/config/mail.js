import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendMail({ to, subject, html, text }) {
  await transport.verify(); // throws if misconfigured
  return transport.sendMail({
    from: process.env.MAIL_FROM || "AuraLifestyle <no-reply@auralifestyle.dev>",
    to,
    subject,
    text,
    html,
  });
}
