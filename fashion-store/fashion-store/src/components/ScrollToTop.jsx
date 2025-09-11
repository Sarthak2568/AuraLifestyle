import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to top on every route change */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    // jump fast; use smooth if you prefer
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);
  return null;
}
