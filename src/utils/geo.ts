/**
 * Geographic Discovery Utilities (v1.0)
 * Resolves location with fail-safe timezone fallbacks and IP lookups.
 */

export const getClientLocation = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return 'Global';
    
    // Friendly mapping for common locations
    if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Delhi') || tz.includes('Bombay')) return 'India';
    if (tz.includes('Dubai')) return 'United Arab Emirates';
    if (tz.includes('Singapore')) return 'Singapore';
    if (tz.includes('London')) return 'United Kingdom';
    if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Denver') || tz.includes('Los_Angeles')) return 'United States';
    if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Brisbane') || tz.includes('Perth')) return 'Australia';
    if (tz.includes('Tokyo')) return 'Japan';
    if (tz.includes('Hong_Kong')) return 'Hong Kong';
    if (tz.includes('Frankfurt') || tz.includes('Berlin')) return 'Germany';
    if (tz.includes('Paris')) return 'France';
    if (tz.includes('Riyadh')) return 'Saudi Arabia';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'Canada';
    
    // Fallback: nicely format the timezone city name
    return tz.split('/').pop()?.replace(/_/g, ' ') || 'Global';
  } catch {
    return 'Global';
  }
};

export const fetchGeographicLocation = async (): Promise<string> => {
  const tzLocation = getClientLocation();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second strict limit
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.country_name) {
        return data.country_name;
      }
    }
  } catch (err) {
    console.warn("[Geo IP Lookup]: Failed. Falling back to timezone location.", err);
  }
  return tzLocation;
};
