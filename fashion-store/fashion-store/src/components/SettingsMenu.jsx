import React from "react";
import { X, Moon, Sun, User, Shield, Truck, Power, ChevronRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function SettingsMenu({ open, onClose, onOpenAuth }) {
  const { user, theme, toggleTheme, logout } = useStore();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-[320px] bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Menu</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"><X /></button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
            {user ? (
              <div>Signed in as <span className="font-semibold">{user.name}</span></div>
            ) : (
              <button onClick={onOpenAuth} className="text-orange-600 font-semibold">Login / Create account</button>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <span className="flex items-center gap-2">{theme === "dark" ? <Moon /> : <Sun />} Theme</span>
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800">{theme}</span>
          </button>

          <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <span className="flex items-center gap-2"><User /> Personal details</span>
            <ChevronRight className="size-4" />
          </button>

          <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <span className="flex items-center gap-2"><Shield /> Privacy policy</span>
            <ChevronRight className="size-4" />
          </button>

          <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <span className="flex items-center gap-2"><Truck /> Track order</span>
            <ChevronRight className="size-4" />
          </button>

          {user && (
            <button
              onClick={logout}
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span className="flex items-center gap-2"><Power /> Logout</span>
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
