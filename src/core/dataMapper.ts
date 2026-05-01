import { 
  Webinar, 
  Signal, 
  Product
} from "@/types";
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Standardizes raw Supabase responses into frontend-ready entities.
 * Ensures field consistency across the entire institutional engine.
 */
export const DataMapper = {
  /**
   * Maps raw webinar data, ensuring date_time is handled correctly.
   */
  webinar: (raw: any): Webinar => ({
    ...raw,
    date_time: raw.date_time || raw.date || new Date().toISOString(),
    status: raw.status || 'upcoming'
  }),

  /**
   * Maps raw signal data.
   */
  signal: (raw: any): Signal => ({
    ...raw,
    direction: raw.direction || 'BUY',
    status: raw.status || 'active'
  }),

  /**
   * Maps raw product/algo data.
   */
  product: (raw: any): Product => ({
    ...raw,
    price: Number(raw.price || 0),
    performance_data: Array.isArray(raw.performance_data) ? raw.performance_data : [],
    long_plan_offers: Array.isArray(raw.long_plan_offers) ? raw.long_plan_offers : []
  })
};

/**
 * Institutional Query Wrapper
 * Standardizes extraction and error handling for all data discovery streams.
 */
export async function safeQuery<T>(
  queryPromise: Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>,
  mapper?: (raw: any) => T,
  context: string = "Global Discovery"
): Promise<T[]> {
  try {
    const res = await queryPromise;
    
    if (res.error) {
      console.error(`[${context}] Query Error:`, res.error);
      return [];
    }

    const data = res.data;
    if (!data) return [];

    const result = Array.isArray(data) ? data : [data];

    if (mapper) {
      return result.map(mapper);
    }

    return result;
  } catch (err) {
    console.error(`[${context}] Critical Execution Error:`, err);
    return [];
  }
}
