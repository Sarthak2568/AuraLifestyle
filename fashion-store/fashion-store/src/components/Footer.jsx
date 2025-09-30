// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const SOCIAL_LINKS = {
  instagram: "https://instagram.com/auralifestyle",        // <-- replace with your IG handle
  whatsapp:  "https://wa.me/919097290982",                  // <-- replace with your WhatsApp number in international format
  facebook:  "https://facebook.com/",                       // optional
  x:         "https://x.com/",                              // optional
  linkedin:  "https://www.linkedin.com/company/",           // optional
};

function SocialIcon({ label, href, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="h-12 w-12 rounded-2xl bg-neutral-900/5 dark:bg-white/5 border border-black/10 dark:border-white/10 grid place-items-center hover:-translate-y-0.5 transition transform hover:shadow-sm"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {/* Top row */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand / Social */}
          <div>
            <div className="text-3xl font-extrabold tracking-tight mb-4">
              <span className="text-gray-900 dark:text-white">Aura</span>
              <span className="text-emerald-600 dark:text-emerald-400">Lifestyle</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
              Culture in every thread. Designed in India. Loved everywhere.
            </p>

            {/* Social icons */}
            <div className="mt-4 flex items-center gap-3 text-neutral-500">
              {/* Instagram */}
              <SocialIcon label="Instagram" href={SOCIAL_LINKS.instagram}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>

              {/* WhatsApp */}
              <SocialIcon label="WhatsApp" href={SOCIAL_LINKS.whatsapp}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 .01 5.37.01 12c0 2.11.55 4.15 1.6 5.96L0 24l6.21-1.61A11.96 11.96 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22a9.93 9.93 0 0 1-5.07-1.39l-.36-.21-3.62.94.97-3.52-.23-.37A9.96 9.96 0 1 1 22 12 10 10 0 0 1 12 22Zm5.4-7.47c-.3-.15-1.76-.86-2.04-.96-.27-.1-.47-.15-.68.15s-.78.96-.95 1.16c-.18.2-.35.22-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.53.08-.81.38-.27.3-1.06 1.03-1.06 2.52s1.08 2.93 1.24 3.13c.15.2 2.13 3.26 5.16 4.57.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
                </svg>
              </SocialIcon>

              {/* Optional extras (still present if you want them) */}
              <SocialIcon label="Facebook" href={SOCIAL_LINKS.facebook}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.08 22 12.07Z"/>
                </svg>
              </SocialIcon>

              <SocialIcon label="X" href={SOCIAL_LINKS.x}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.9 2H21l-6.4 7.3L22 22h-5.9l-4.6-6.1L6 22H3.9l6.8-7.7L2 2h6l4.2 5.7L18.9 2Zm-2.1 18h1.6L8.3 4H6.7l10.1 16Z"/>
                </svg>
              </SocialIcon>

              <SocialIcon label="LinkedIn" href={SOCIAL_LINKS.linkedin}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM.5 8h4V23h-4V8Zm7 0h3.8v2.05h.05C12.1 8.9 13.7 8 15.9 8 20 8 21 10.68 21 14.47V23h-4v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V23H7.5V8Z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/men" className="hover:text-emerald-600 dark:hover:text-emerald-400">Men</Link></li>
              <li><Link to="/women" className="hover:text-emerald-600 dark:hover:text-emerald-400">Women</Link></li>
              <li><Link to="/sneakers" className="hover:text-emerald-600 dark:hover:text-emerald-400">Sneakers</Link></li>
              <li><Link to="/accessories" className="hover:text-emerald-600 dark:hover:text-emerald-400">Accessories</Link></li>
              <li><Link to="/collections/new" className="hover:text-emerald-600 dark:hover:text-emerald-400">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Trending */}
          <div>
            <h4 className="font-semibold mb-3">Trending</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/collections/oversized" className="hover:text-emerald-600 dark:hover:text-emerald-400">Oversized Tees</Link></li>
              <li><Link to="/collections/bestsellers" className="hover:text-emerald-600 dark:hover:text-emerald-400">Bestsellers</Link></li>
              <li><Link to="/collections/merch" className="hover:text-emerald-600 dark:hover:text-emerald-400">Official Merch</Link></li>
              <li><Link to="/collections/bottoms" className="hover:text-emerald-600 dark:hover:text-emerald-400">Bottomwear</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-3">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help/faq" className="hover:text-emerald-600 dark:hover:text-emerald-400">FAQs</Link></li>
              <li><Link to="/help/returns" className="hover:text-emerald-600 dark:hover:text-emerald-400">Returns & Refunds</Link></li>
              <li><Link to="/help/track" className="hover:text-emerald-600 dark:hover:text-emerald-400">Track Order</Link></li>
              <li><Link to="/company/careers" className="hover:text-emerald-600 dark:hover:text-emerald-400">Careers</Link></li>
              <li><Link to="/company/about" className="hover:text-emerald-600 dark:hover:text-emerald-400">About Us</Link></li>
              <li><Link to="/help/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400">Contact</Link></li>
              <li><Link className="hover:underline" to="/terms">Terms & Conditions</Link></li>
              <li><Link className="hover:underline" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:underline" to="/returns">Return & Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter stripe */}
        <div className="mt-12 rounded-xl border border-black/5 dark:border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h5 className="font-semibold">We’ve got you covered.</h5>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Be the first to know about new drops & exclusive deals.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full sm:w-72 rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2">
              Join
            </button>
          </form>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} AuraLifestyle. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/legal/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400">Terms</Link>
            <Link to="/legal/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400">Privacy</Link>
            <Link to="/legal/shipping" className="hover:text-emerald-600 dark:hover:text-emerald-400">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
