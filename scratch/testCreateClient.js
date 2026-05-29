import { createClient } from '@supabase/supabase-js';

try {
  console.log("Testing with relative path...");
  const client = createClient('/supabase-proxy', 'placeholder');
  console.log("Success!");
} catch (err) {
  console.error("Caught expected error:", err);
}

try {
  console.log("Testing with absolute path...");
  const client = createClient('http://localhost:3000/supabase-proxy', 'placeholder');
  console.log("Success!");
} catch (err) {
  console.error("Caught unexpected error:", err);
}
