async function main() {
  const url = "https://fjvuzgkctuwmkhajmgeo.supabase.co/rest/v1/performance_results?select=*";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdnV6Z2tjdHV3bWtoYWptZ2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjgzOTcsImV4cCI6MjA4ODY0NDM5N30.Lfi5U3kanOt3eShaRlKzFV-JQVai_usK7Jr7rGFs7Dw";
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    const data = await res.json();
    console.log("Performance Results:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();
