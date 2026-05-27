import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;

const PARTNERS = [
  {
    title: "MetaTrader 5",
    description: "Trading Platform",
    placement: "partner",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/MetaTrader_5_logo.png",
    link_url: "https://www.metatrader5.com",
    is_active: true,
    priority: 10,
    metadata: JSON.stringify({ type: "mt5" })
  },
  {
    title: "TradingView",
    description: "Charting Terminal",
    placement: "partner",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/TradingView_logo.svg",
    link_url: "https://www.tradingview.com",
    is_active: true,
    priority: 20,
    metadata: JSON.stringify({ type: "tradingview" })
  },
  {
    title: "Vantage Markets",
    description: "Liquidity Bridge",
    placement: "partner",
    image_url: "https://vantage-markets.com/wp-content/themes/vantage-markets-corporate/assets/images/logo.svg",
    link_url: "https://www.vantagemarkets.com",
    is_active: true,
    priority: 30,
    metadata: JSON.stringify({ type: "vantage" })
  },
  {
    title: "VT Markets",
    description: "Execution Partner",
    placement: "partner",
    image_url: "https://www.vtmarkets.com/wp-content/themes/vtmarkets/assets/images/logo.svg",
    link_url: "https://www.vtmarkets.com",
    is_active: true,
    priority: 40,
    metadata: JSON.stringify({ type: "vt" })
  },
  {
    title: "Markets4you",
    description: "CFD Provider",
    placement: "partner",
    image_url: "https://www.markets4you.com/wp-content/themes/markets4you/assets/images/logo.svg",
    link_url: "https://www.markets4you.com",
    is_active: true,
    priority: 50,
    metadata: JSON.stringify({ type: "markets4you" })
  }
];

async function run() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    console.log("Seeding partners with real logo URLs into banners table...");
    
    // First clear existing partner banners to avoid duplication
    await client.query("DELETE FROM banners WHERE placement = 'partner'");

    for (const p of PARTNERS) {
      await client.query(`
        INSERT INTO banners (title, description, placement, image_url, link_url, is_active, priority, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [p.title, p.description, p.placement, p.image_url, p.link_url, p.is_active, p.priority, p.metadata]);
      console.log(`Seeded partner with logo: ${p.title}`);
    }

    console.log("Partners with logos seeded successfully!");
  } catch (err) {
    console.error("Error seeding partners:", err);
  } finally {
    await client.end();
  }
}

run();
