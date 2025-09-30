import nodemailer from 'nodemailer';

export function getTransporter() {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
  } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('EMAIL_USER/EMAIL_PASS missing in environment');
  }

  // If a host is provided, use explicit SMTP (e.g., Mailtrap/SendGrid).
  if (EMAIL_HOST) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT || 587),
      secure: String(EMAIL_SECURE || 'false') === 'true',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }

  // Default to Gmail service (requires 2FA + App Password).
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

export async function sendOtpEmail(to, code) {
  const transporter = getTransporter();

  // TEMP: verify SMTP creds so you see the exact reason if it fails.
  // Remove after you get a success once.
  try {
    await transporter.verify();
    console.log('SMTP verified OK');
  } catch (e) {
    console.error('SMTP verify failed:', e);
    throw e;
  }

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;">
      <h2 style="margin:0 0 12px;">Your AuraLifestyle verification code</h2>
      <p style="margin:0 0 16px;">Use the following code to sign in:</p>
      <div style="font-size:28px;letter-spacing:6px;font-weight:700;padding:16px 0;">${code}</div>
      <p style="color:#666;margin:16px 0 0;">This code expires in ${process.env.OTP_EXP_MIN || 10} minutes.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: 'Your AuraLifestyle verification code',
    html,
  });
}
