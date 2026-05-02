import React, { useEffect, useState } from "react";
import { supabase, getSupabasePublicUrl } from "../../lib/supabase";

type Banner = {
  id: string;
  name: string;
  placement: string;
  html_content?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  is_active: boolean;
  priority: number;
};

export const AdBanner: React.FC<{ placement?: string }> = ({ placement = "home" }) => {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchBanner = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .eq("placement", placement)
          .order("priority", { ascending: false })
          .limit(1);
        if (error) {
          console.warn("AdBanner fetch error:", error.message);
          return;
        }
        if (mounted && data && data.length) setBanner(data[0] as Banner);
      } catch (err) {
        console.warn("AdBanner exception:", err);
      }
    };
    fetchBanner();
    return () => { mounted = false };
  }, [placement]);

  if (!banner) return null;

  if (banner.html_content) {
    return <div className="ad-banner" dangerouslySetInnerHTML={{ __html: banner.html_content }} />;
  }

  return (
    <div className="ad-banner">
      {banner.image_url && <img src={getSupabasePublicUrl('banners', banner.image_url)} alt={banner.name} />}
      {banner.link_url ? (
        <a className="ad-cta" href={banner.link_url} target="_blank" rel="noreferrer">Learn more</a>
      ) : null}
    </div>
  );
};

export default AdBanner;
