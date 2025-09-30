import React, { createContext, useContext, useMemo, useState } from "react";
import { useStore } from "./StoreContext";

// Auth adapter that proxies to StoreContext so there's only one user state.
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const { user, signup: storeSignup, login: storeLogin, logout: storeLogout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const login = async ({ emailOrPhone }) => {
    const u = await storeLogin({ emailOrPhone });
    setIsOpen(false);
    return u;
  };

  const signup = async ({ name, email, phone }) => {
    const u = await storeSignup({ name, email, phone });
    setIsOpen(false);
    return u;
  };

  const logout = () => {
    storeLogout();
    setIsOpen(false);
  };

  // Compatibility aliases (some components might call different names)
  const value = useMemo(() => ({
    user,
    isOpen,
    open,
    close,
    showAuth: open,
    hideAuth: close,
    setOpen: setIsOpen,
    toggle: () => setIsOpen(v => !v),
    login,
    signup,
    logout,
  }), [user, isOpen]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
