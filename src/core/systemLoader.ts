import { supabase } from "@/lib/supabase";
import { setFlags } from "./featureFlags";

export const loadSystem = async () => {
  try {
    const { data } = await supabase.from("feature_flags").select("*");
    if (data) {
      setFlags(data);
    }
  } catch (err) {
    console.error("Institutional System Recovery: Feature signals failed to synchronize.", err);
  }
};
