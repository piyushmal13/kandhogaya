import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

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
    console.log("Seeding extensive B2B Sourcing and Internal Career positions...");

    // Clear existing positions to keep seeding clean
    await client.query(`DELETE FROM hiring_positions;`);

    // 1. Seed Internal Positions (IFX Careers)
    await client.query(`
      INSERT INTO hiring_positions (title, department, description, requirements, is_active, type, location)
      VALUES 
      (
        'Quantum Execution & Low-Latency Developer',
        'Systems Engineering',
        'Deploy compiled binaries, optimize socket layers, and integrate multi-threaded execution tunnels for institutional order flow.',
        ARRAY[
          'Expertise in C++20, Rust, and kernel-bypass network adapters',
          'Lock-free concurrency patterns and memory-aligned structures',
          'Direct experience with Prime-of-Prime API co-location bridges'
        ],
        true,
        'internal',
        'Remote / London'
      ),
      (
        'MetaTrader 4 (MT4) Integration Specialist',
        'Technical Services',
        'Maintain and optimize MT4 server managers, custom bridges, gateway endpoints, and group configuration profiles.',
        ARRAY[
          'Extensive experience configuring MT4 backend panels',
          'Proficiency writing robust plugins in MQL4 / C++',
          'Deep understanding of broker liquidity routing protocols'
        ],
        true,
        'internal',
        'Remote / Prague'
      ),
      (
        'MetaTrader 5 (MT5) Bridge Engineer',
        'Technical Services',
        'Develop and audit MT5 websocket bridges, trade copy gateways, and real-time database syncing layers.',
        ARRAY[
          'Advanced knowledge of MT5 Manager API and gateway systems',
          'MQL5 systematic development and debug workflows',
          'Secure database sync design patterns'
        ],
        true,
        'internal',
        'Remote / Sydney'
      ),
      (
        'Algorithmic Strategy Developer (Algos)',
        'Quantitative Desk',
        'Research, simulate, and backtest systematic gold and currency portfolios. Build GARCH risk filters and trailing drawdown cuts.',
        ARRAY[
          'Post-graduate degree in Quantitative Finance or Physics',
          'High-fidelity backtesting with simulated tick data',
          'Python / C++ algorithmic simulation modeling'
        ],
        true,
        'internal',
        'Remote / Dubai'
      ),
      (
        'UI/UX & Web Graphic Designer',
        'Marketing & Brand',
        'Create beautiful corporate visual collateral, terminal dashboards, and marketing materials adhering to Ice-Blue Diamond guidelines.',
        ARRAY[
          'Stunning design portfolio showcasing premium dark-mode aesthetics',
          'Expertise in Figma, vector illustration, and front-end layout styling',
          'Familiarity with HTML/CSS responsive typography standards'
        ],
        true,
        'internal',
        'Remote / Prague'
      ),
      (
        'Back Office Operations & Compliance Analyst',
        'Operations',
        'Manage user access verification, KYC onboarding validations, SLA contracts, and regulatory logs for prop firm evaluations.',
        ARRAY[
          'Background in financial compliance or back-office administration',
          'Experience auditing database logs and contract bindings',
          'Rigorous attention to detail and secure CRM workflows'
        ],
        true,
        'internal',
        'Remote / London'
      ),
      (
        'Chief Operating Officer (COO) / Sourcing Director',
        'Executive Management',
        'Direct global hiring, B2B recruitment pipelines, margin management training programs, and outsourced HR staffing compliance.',
        ARRAY[
          '10+ years executive experience in brokerage or fintech industries',
          'Proven record structuring corporate HR and global staffing pools',
          'Deep understanding of institutional compliance and business operations'
        ],
        true,
        'internal',
        'Remote / Dubai'
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

    console.log("Successfully seeded extensive B2B Sourcing and Internal Career positions!");
  } catch (err) {
    console.error("Error seeding positions:", err);
  } finally {
    await client.end();
  }
}

run();
