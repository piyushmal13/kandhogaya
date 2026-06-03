import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

async function run() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  
  try {
    console.log("Updating dynamic partners in public.banners...");
    
    // Deleting existing partners first to avoid duplicate seeds
    await client.query("DELETE FROM public.banners WHERE placement = 'partner'");
    
    // Inserting partners with SVG urls
    const query = `
      INSERT INTO public.banners (title, placement, image_url, description, is_active, priority)
      VALUES
      ('MetaTrader 5', 'partner', '/metatrader5.svg', 'Trading Platform', true, 1),
      ('TradingView', 'partner', '/tradingview.svg', 'Charting Terminal', true, 2),
      ('Vantage Markets', 'partner', '/vantage.svg', 'Liquidity Bridge', true, 3),
      ('VT Markets', 'partner', '/vtmarkets.svg', 'Execution Partner', true, 4),
      ('Markets4you', 'partner', '/markets4you.svg', 'CFD Provider', true, 5)
    `;
    
    await client.query(query);
    console.log("Database seeded successfully with SVG partners!");
  } catch (err) {
    console.error("Error updating partners in database:", err.message);
  } finally {
    await client.end();
  }
}

run();
