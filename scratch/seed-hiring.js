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
    console.log("Seeding B2B Sourcing and Internal Career positions...");

    // Clear existing positions to keep seeding clean
    await client.query(`DELETE FROM hiring_positions;`);

    // 1. Seed Internal Positions (IFX Careers)
    await client.query(`
      INSERT INTO hiring_positions (title, department, description, requirements, is_active, type, location)
      VALUES 
      (
        'Ultra-Low Latency C++ / Rust Systems Developer',
        'Systems Engineering',
        'Deploy compiled binaries and optimize socket layers for tick-level currency and gold execution tunnels.',
        ARRAY[
          'Expertise in kernel-bypass (Solarflare EF_VI)',
          'Concurrency lock-free pattern designs in C++20 / Rust',
          'Real-time socket programming and FIX protocol routing'
        ],
        true,
        'internal',
        'Remote / London'
      ),
      (
        'Senior Quantitative Portfolio Analyst',
        'Quantitative Desk',
        'Develop and backtest volatility-regime models, GARCH filters, and trailing risk cutoffs.',
        ARRAY[
          'Post-graduate degree in Mathematics, Physics or Quantitative Finance',
          'Experience with MT5 websocket bridge execution and backtest fidelity verification',
          'Python / C++ algorithmic simulation models'
        ],
        true,
        'internal',
        'Remote / Prague'
      );
    `);

    // 2. Seed B2B Positions (Broker Sourcing Desk)
    await client.query(`
      INSERT INTO hiring_positions (title, department, description, requirements, is_active, type, location)
      VALUES 
      (
        'Institutional Brokerage Business Development Manager (BDM)',
        'HR & Sourcing Desk',
        'Help broker partners hire experienced managers capable of structuring seven-figure volume-based rebate schedules, local training, and Prime-of-Prime agreements.',
        ARRAY[
          'Vast network with institutional liquidity pools and Prime-of-Primes',
          'Closing seven-figure CRM / brokerage account deals',
          'Structuring volume-based economic rebate schedules'
        ],
        true,
        'broker_talent',
        'Local Office / Dubai'
      ),
      (
        'MT4/MT5 Gateway & API Support Engineer',
        'Technical Services & HR Support',
        'Assist brokerage clients with backend API setups, local training, and HR onboarding. We provide full CRM sync training and educational classes.',
        ARRAY[
          'Configuring MT4/MT5 manager panels, gateway bridges, and group rules',
          'Establishing secure API sockets and CRM data flows',
          'Delivering local technical support, education, and HR onboarding programs'
        ],
        true,
        'broker_talent',
        'Local Office / Sydney'
      );
    `);

    console.log("Successfully seeded B2B Sourcing and Internal Career positions!");
  } catch (err) {
    console.error("Error seeding positions:", err);
  } finally {
    await client.end();
  }
}

run();
