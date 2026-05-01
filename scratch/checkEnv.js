import "dotenv/config";
console.log("Supabase URL:", process.env.VITE_SUPABASE_URL ? "DEFINED" : "MISSING");
console.log("Supabase Anon Key:", process.env.VITE_SUPABASE_ANON_KEY ? "DEFINED" : "MISSING");
console.log("Supabase Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "DEFINED" : "MISSING");
