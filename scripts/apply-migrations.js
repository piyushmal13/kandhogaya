#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { Client } from 'pg';
import dotenv from 'dotenv';

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DB_URL;
const MIGRATION_TABLE = 'public.schema_migrations';
const LOCK_ID = 6012026;
const markAppliedOnly = process.argv.includes('--mark-applied');

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL environment variable. Set it to your Postgres connection string.');
  process.exit(1);
}

async function run() {
  if (!fs.existsSync(migrationsDir)) {
    console.error('Migrations directory not found:', migrationsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  if (files.length === 0) {
    console.log('No migration files found.');
    process.exit(0);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
        version text PRIMARY KEY,
        checksum text NOT NULL,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await client.query('SELECT pg_advisory_lock($1)', [LOCK_ID]);

    for (const file of files) {
      const full = path.join(migrationsDir, file);
      const sql = fs.readFileSync(full, 'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');
      const applied = await client.query(
        `SELECT checksum FROM ${MIGRATION_TABLE} WHERE version = $1`,
        [file]
      );

      if (applied.rowCount > 0) {
        if (applied.rows[0].checksum !== checksum) {
          console.warn(`Checksum changed after apply: ${file}. Create a new migration instead of editing applied SQL.`);
        }
        console.log('Skipping already applied migration:', file);
        continue;
      }

      if (markAppliedOnly) {
        await client.query(
          `INSERT INTO ${MIGRATION_TABLE} (version, checksum) VALUES ($1, $2)`,
          [file, checksum]
        );
        console.log('Marked migration as applied:', file);
        continue;
      }

      console.log('Applying migration:', file);
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          `INSERT INTO ${MIGRATION_TABLE} (version, checksum) VALUES ($1, $2)`,
          [file, checksum]
        );
        await client.query('COMMIT');
        console.log('Applied:', file);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Failed to apply', file);
        console.error(err);
        throw err;
      }
    }
  } finally {
    try {
      await client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]);
    } catch {
      // Connection may already be closed or failed; original error is more useful.
    }
    await client.end();
  }

  console.log('All migrations applied successfully');
}

run().catch(err => { console.error(err); process.exit(1); });
