import React, { useState } from "react";

/**
 * IKImg - ImageKit-aware <img>, falls back to local if IK not configured/failed.
 * Usage: <IKImg src="/images/M-10.png" alt="Tee" className="w-24 h-24 object-cover" />
 * Env: VITE_IK_BASE_URL (e.g. https://ik.imagekit.io/your_id)
 */
export default function IKImg({ src = "", alt = "", className = "", ...rest }) {
  const base = (import.meta.env.VITE_IK_BASE_URL || "").replace(/\/$/, "");
  const toIK = (p) =>
    !p || typeof p !== "string" || !p.startsWith("/")
      ? p
      : p.startsWith("/images/")
      ? `/site${p}` // optionally prefix, adjust for your ImageKit folder structure
      : p;

  const [local, setLocal] = useState(import.meta.env.DEV || !base);
  const url = local ? src : `${base}${toIK(src)}?tr=f-auto,q-80`;

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setLocal(true)}
      {...rest}
    />
  );
}
