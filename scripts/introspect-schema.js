import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import { config } from 'dotenv';

config();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

async function main() {
  const [
    tablesRes,
    columnsRes,
    constraintsRes,
    keyColsRes,
    refConstraintsRes,
    indexesRes,
    policiesRes,
    schemasRes
  ] = await Promise.all([
    supabase.from('information_schema.tables').select('table_name, table_type, is_insertable_into').eq('table_schema', 'public'),
    supabase.from('information_schema.columns').select('table_name, column_name, data_type, is_nullable, column_default, ordinal_position, character_maximum_length, numeric_precision, numeric_scale').eq('table_schema', 'public').order('table_name').order('ordinal_position'),
    supabase.from('information_schema.table_constraints').select('constraint_name, constraint_type, table_name').eq('table_schema', 'public'),
    supabase.from('information_schema.key_column_usage').select('constraint_name, table_name, column_name, position_in_unique_constraint').eq('table_schema', 'public'),
    supabase.from('information_schema.referential_constraints').select('constraint_name, unique_constraint_name, match_option, update_rule, delete_rule').eq('table_schema', 'public'),
    supabase.from('pg_indexes', { schema: 'pg_catalog' }).select('indexname, indexdef, tablename, schemaname').eq('schemaname', 'public'),
    supabase.from('pg_policies', { schema: 'pg_catalog' }).select('*').eq('schemaname', 'public'),
    supabase.from('information_schema.schemata').select('schema_name')
  ]);

  const data = {
    generated_at: new Date().toISOString(),
    schemas: schemasRes.data || [],
    tables: tablesRes.data || [],
    columns: columnsRes.data || [],
    constraints: constraintsRes.data || [],
    key_column_usage: keyColsRes.data || [],
    referential_constraints: refConstraintsRes.data || [],
    indexes: indexesRes.data || [],
    policies: policiesRes.data || [],
    errors: {
      tables: tablesRes.error,
      columns: columnsRes.error,
      constraints: constraintsRes.error,
      keyCols: keyColsRes.error,
      refConstraints: refConstraintsRes.error,
      indexes: indexesRes.error,
      policies: policiesRes.error,
      schemas: schemasRes.error
    }
  };

  writeFileSync('schema-audit.json', JSON.stringify(data, null, 2));
  console.log('Schema audit saved.');
  console.log(`Tables: ${data.tables.length}, Columns: ${data.columns.length}, Indexes: ${data.indexes.length}, Policies: ${data.policies.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
