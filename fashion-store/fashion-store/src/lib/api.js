// src/lib/api.js
const BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function json(url, opts = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text || "Invalid JSON" };
  }
  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const authApi = {
  // matches backend: POST /api/auth/request-otp { email, name? }
  requestOtp(email, name = "") {
    return json(`${BASE}/api/auth/request-otp`, {
      method: "POST",
      body: JSON.stringify({ email, name }),
    });
  },
  // matches backend: POST /api/auth/verify-otp { email, code }
  verifyOtp(email, code) {
    return json(`${BASE}/api/auth/verify-otp`, {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },
};

export const productsApi = {
  list() {
    return json(`${BASE}/api/products`);
  },
  get(idOrSlug) {
    return json(`${BASE}/api/products/${encodeURIComponent(idOrSlug)}`);
  },
};

export default { authApi, productsApi };
