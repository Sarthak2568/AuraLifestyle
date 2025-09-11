import React, { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function AuthModal({ open, onClose }) {
  const { signup, login } = useStore();
  const [mode, setMode] = useState("login"); // "login" | "create"
  const [loading, setLoading] = useState(false);

  // create
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // login
  const [emailOrPhone, setEmailOrPhone] = useState("");

  if (!open) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) return;
    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setLoading(true);
    try {
      await login({ emailOrPhone: emailOrPhone.trim() });
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[560px] rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Close"
        >
          <X />
        </button>

        <div className="grid grid-cols-[1fr_auto] gap-4 items-center px-6 pt-6">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">Login</h2>
            <div className="mt-2 text-lg">
              or{" "}
              <button
                className="text-orange-600 font-semibold"
                onClick={() => setMode((m) => (m === "login" ? "create" : "login"))}
              >
                {mode === "login" ? "create an account" : "login"}
              </button>
            </div>
            <div className="mt-3 h-1 w-10 bg-neutral-900 dark:bg-white rounded" />
          </div>

          <div className="h-20 w-20 rounded-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 grid place-items-center">
            {/* small emoji-ish circle */}
            <span className="text-4xl">🌯</span>
          </div>
        </div>

        <div className="px-6 pb-6">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <label className="block">
                <div className="text-sm mb-2">Email or phone</div>
                <input
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full h-14 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 outline-none focus:ring-2 ring-neutral-900 dark:ring-white"
                  placeholder="Enter email or phone"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-lg bg-orange-600 text-white text-lg font-semibold hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>

              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                By clicking on Login, I accept the{" "}
                <span className="underline">Terms &amp; Conditions</span> &amp;{" "}
                <span className="underline">Privacy Policy</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <label className="block">
                <div className="text-sm mb-2">Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 outline-none focus:ring-2 ring-neutral-900 dark:ring-white"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <div className="text-sm mb-2">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 outline-none focus:ring-2 ring-neutral-900 dark:ring-white"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <div className="text-sm mb-2">Phone</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-14 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 outline-none focus:ring-2 ring-neutral-900 dark:ring-white"
                  placeholder="10-digit phone"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-lg bg-orange-600 text-white text-lg font-semibold hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? "Creating..." : "CREATE ACCOUNT"}
              </button>

              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                By continuing, I accept the{" "}
                <span className="underline">Terms &amp; Conditions</span> &amp;{" "}
                <span className="underline">Privacy Policy</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
