import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * LegacyRedirect — SEO Recovery Interceptor
 * Intercepts Google Search legacy index URLs and maps them instantly 
 * to the cinematic platform Home Page (/) to prevent 404 client drop-offs.
 */
export const LegacyRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    
    // Redirect mappings for old legacy indexed paths directly to Home page (/)
    if (
      path === "/courses" || 
      path === "/course" || 
      path === "/academy" || 
      path === "/forex-academy" || 
      path === "/forex-course" ||
      path === "/signals" || 
      path === "/live-signals" ||
      path.startsWith("/courses/") ||
      path.startsWith("/academy/") ||
      path.startsWith("/signals/")
    ) {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return null;
};
