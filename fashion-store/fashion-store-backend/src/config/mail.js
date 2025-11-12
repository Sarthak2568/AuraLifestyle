// src/config/mail.js
import nodemailer from 'nodemailer';

export const FROM_EMAIL = (process.env.EMAIL_USER || '').trim();
export const FROM_NAME  = (process.env.EMAIL_FROM || 'AuraLifestyle').replace(/<.*?>/g, '').trim();

export const transporter =
  process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 465),
        secure: String(process.env.EMAIL_SECURE || 'true') === 'true',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })
    : null;

export function orderEmailHTML({ displayOrderId, address, items, sub, gst, total }) {
  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(n || 0));

  const rows = (items || [])
    .map(
      (it) => `
    <tr>
      <td>${(it.title || '').replace(/</g, '&lt;')}</td>
      <td>${it.size || '-'}</td>
      <td>${it.color || '-'}</td>
      <td align="right">${it.qty || 1}</td>
      <td align="right">${fmt(it.price || 0)}</td>
      <td align="right">${fmt((it.price || 0) * (it.qty || 1))}</td>
    </tr>`
    )
    .join('');

  return `
  <h2>Order Confirmed • ${displayOrderId}</h2>
  <p>Thanks for your purchase. We’re preparing your order.</p>
  <h3>Delivering to</h3>
  <div>
    ${address?.fullName || ''}<br/>
    ${address?.address1 || ''} ${address?.address2 || ''}<br/>
    ${[address?.city, address?.state].filter(Boolean).join(', ')} ${address?.pincode || ''}<br/>
    ${address?.phone ? 'Phone: ' + address.phone : ''}
  </div>
  <h3>Items</h3>
  <table border="1" cellpadding="6" cellspacing="0">
    <thead><tr><th>Item</th><th>Size</th><th>Color</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p>Subtotal: ${fmt(sub)}<br/>GST: ${fmt(gst)}<br/><b>Total: ${fmt(total)}</b></p>
  `;
}
