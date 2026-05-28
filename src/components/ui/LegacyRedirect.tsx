import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * LegacyRedirect — SEO Recovery Interceptor
 * Intercepts Google Search legacy index URLs and maps them instantly 
 * to active pages (like webinars or QuantX) to prevent 404 client drop-offs.
 */
export const LegacyRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    
    // Redirect mappings for old legacy indexed paths to valid active pages
    if (
      path === "/courses" || 
      path === "/course" || 
      path === "/academy" || 
      path === "/forex-academy" || 
      path === "/forex-course" ||
      path.startsWith("/courses/") ||
      path.startsWith("/academy/")
    ) {
      navigate("/webinars", { replace: true });
    } else if (
      path === "/signals" || 
      path === "/live-signals" ||
      path.startsWith("/signals/")
    ) {
      navigate("/quantx", { replace: true });
    }
  }, [location, navigate]);

  return null;
};
