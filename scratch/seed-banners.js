import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!DATABASE_URL) {
  console.error("Missing database connection URL!");
  process.exit(1);
}

async function run() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    console.log("Seeding B2B advertisement banners into live database...");

    // Insert/Update Webinar Banner
    await client.query(`
      INSERT INTO banners (title, placement, description, image_url, link_url, is_active, priority, metadata)
      VALUES (
        'Sponsorship Open / Session Hosting Soon',
        'webinar',
        'Our strategy desk is compiling the next systematic gold & order flow volatility models. Partner with the leading systematic EA desk to broadcast to 1.2K+ active B2B nodes.',
        '/webinar_masterclass.png',
        '/consultation?source=webinar_sponsor_banner',
        true,
        10,
        '{"type": "institutional_broadcast", "accent_color": "#00A3FF"}'::jsonb
      )
      ON CONFLICT DO NOTHING;
    `);

    // Insert/Update Blog In-content Banner
    await client.query(`
      INSERT INTO banners (title, placement, description, image_url, link_url, is_active, priority, metadata)
      VALUES (
        'Swissquote Bank Custody',
        'blog_incontent',
        'Experience the ultimate standard of capital preservation, Swiss banking privacy, and multi-asset margin optimization desks.',
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Swissquote_logo.svg',
        'https://www.swissquote.com',
        true,
        10,
        '{"tagline": "Swiss Custody & Settlement", "accent_color": "#00E5FF"}'::jsonb
      )
      ON CONFLICT DO NOTHING;
    `);

    // Insert/Update Blog Sidebar Banner
    await client.query(`
      INSERT INTO banners (title, placement, description, image_url, link_url, is_active, priority, metadata)
      VALUES (
        'Equinix NY4 Enclave',
        'blog_sidebar',
        'Eliminate network latency by hosting your algorithms inside private server racks co-located adjacent to major tier-1 liquidity matching engines.',
        'https://upload.wikimedia.org/wikipedia/commons/7/77/Equinix_logo.svg',
        'https://www.equinix.com',
        true,
        10,
        '{"tagline": "Low-Latency Infrastructure Node", "accent_color": "#00A3FF"}'::jsonb
      )
      ON CONFLICT DO NOTHING;
    `);

    console.log("Successfully seeded database banners for webinars and blogs!");
  } catch (err) {
    console.error("Error seeding banners:", err);
  } finally {
    await client.end();
  }
}

run();
