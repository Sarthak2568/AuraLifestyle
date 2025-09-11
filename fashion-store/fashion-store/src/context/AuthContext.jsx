import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [isOpen, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [draft, setDraft] = useState({ name: "", email: "", phone: "" });
  const [user, setUser] = useState(null);

  const openAuth = useCallback((m = "login") => {
    setMode(m);
    setDraft({ name: "", email: "", phone: "" });
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);
  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({
      isOpen,
      openAuth,
      closeAuth,
      mode,
      setMode,
      draft,
      setDraft,
      user,
      setUser,
      signOut,
      isSignedIn: !!user
    }),
    [isOpen, openAuth, closeAuth, mode, draft, user, signOut]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
