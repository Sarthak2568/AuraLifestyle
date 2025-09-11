import { Moon, Sun } from "lucide-react";
import { useStore } from "../context/StoreContext.jsx";

export default function DarkModeToggle() {
  const { dark, setDark } = useStore();
  return (
    <button onClick={()=>setDark(!dark)} aria-label="Toggle theme"
      className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900">
      {dark ? <Sun size={18}/> : <Moon size={18}/>}
    </button>
  );
}
