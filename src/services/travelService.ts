import { supabase } from '../lib/supabase';

export interface TravelTrip {
  id: string;
  destination: string;
  country: string;
  date_range: string;
  description: string;
  image_url: string;
  spots_total: number;
  spots_available: number;
  exclusivity: string;
}

// Fallback dummy data since we cannot alter Supabase schemas per directives
const DUMMY_TRIPS: TravelTrip[] = [
  {
    id: "trip-1",
    destination: "Bali",
    country: "Indonesia",
    date_range: "Oct 15 - Oct 25, 2026",
    description: "An exclusive retreat for the Top 1% traders. Mastermind sessions mixed with spiritual and mental reset in the heart of Bali's jungles.",
    image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop",
    spots_total: 20,
    spots_available: 4,
    exclusivity: "Top 1% Club"
  },
  {
    id: "trip-2",
    destination: "Dubai",
    country: "UAE",
    date_range: "Dec 05 - Dec 12, 2026",
    description: "Luxury trading mastermind in the desert metropolis. Yacht parties, high-net-worth networking, and institutional trading seminars.",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop",
    spots_total: 15,
    spots_available: 2,
    exclusivity: "Whale Tier"
  },
  {
    id: "trip-3",
    destination: "Phuket",
    country: "Thailand",
    date_range: "Jan 10 - Jan 18, 2027",
    description: "Coastal networking for elite institutional traders. Combine pristine beaches with high-frequency strategy scaling sessions.",
    image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000&auto=format&fit=crop",
    spots_total: 25,
    spots_available: 8,
    exclusivity: "Pro Traders"
  }
];

export const fetchTravelTrips = async (): Promise<TravelTrip[]> => {
  try {
    // Attempting to fetch from a hypothetic Supabase table "traders_travel"
    // Since we are strictly forbidden from altering Supabase schemas, we gracefully
    // fall back to dummy data if the table doesn't exist or errors out.
    const { data, error } = await supabase.from('traders_travel').select('id, destination, country, date_range, description, image_url, spots_total, spots_available, exclusivity');
    
    if (error || !data || data.length === 0) {
      return DUMMY_TRIPS;
    }
    
    return data as TravelTrip[];
  } catch (err) {
    console.warn("Error fetching travel trips:", err);
    return DUMMY_TRIPS;
  }
};
