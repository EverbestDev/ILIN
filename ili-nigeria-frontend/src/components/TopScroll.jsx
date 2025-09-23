import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//to make the page scrool to top when navigating to a new page

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
