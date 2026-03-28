import { supabase } from "./lib/supabase";

async function testSupabase() {
    console.log("--- START SUPABASE TEST ---");
    
    // 1. Test Signals (Public)
    console.log("Testing signals table...");
    const { data: signals, error: sigError } = await supabase
        .from("signals")
        .select("*")
        .limit(5);
    
    console.log("SIGNALS DATA:", signals);
    console.log("SIGNALS ERROR:", sigError);

    // 2. Test Auth Session
    console.log("Testing auth session...");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log("SESSION DATA:", sessionData);
    console.log("SESSION ERROR:", sessionError);

    // 3. Test Users (Own profile)
    if (sessionData?.session?.user?.id) {
        console.log("Testing users table for self...");
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single();
        
        console.log("USER DATA:", user);
        console.log("USER ERROR:", userError);
    } else {
        console.log("No active session to test users table.");
    }

    console.log("--- END SUPABASE TEST ---");
}

testSupabase();
