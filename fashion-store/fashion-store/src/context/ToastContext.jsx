import React, { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

let counter = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = ({ title, message = "", type = "info", timeout = 2200 }) => {
    const id = counter++;
    setToasts((t) => [...t, { id, title, message, type }]);
    if (timeout > 0) {
      setTimeout(() => dismiss(id), timeout);
    }
  };

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const value = useMemo(() => ({ show, dismiss, toasts }), [toasts]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
