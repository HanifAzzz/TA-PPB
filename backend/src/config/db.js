const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool = null;
let isConnectedToPostgres = false;

// =========================================================
// POSTGRESQL CONNECTION — FULL DATABASE, NO DUMMY/MEMORY
// =========================================================

// Default to Supabase TA-PPB direct connection (IPv6, works on Vercel)
const defaultDbUrl = 'postgresql://postgres:hanifarifandi@db.uijqrcanmplthqonzogn.supabase.co:5432/postgres';
const databaseUrl = (process.env.DATABASE_URL || defaultDbUrl).trim();

if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
  try {
    const cleanUrl = databaseUrl.replace(/[?&]sslmode=[^&]+/g, '');
    pool = new Pool({
      connectionString: cleanUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    });
    pool.on('error', (err) => {
      console.error('❌ PostgreSQL Pool error:', err.message);
    });
  } catch (err) {
    console.warn('⚠️ Gagal inisialisasi PostgreSQL pool:', err.message);
    pool = null;
  }
}

// =========================================================
// INIT DB — connect & ensure tables exist
// =========================================================
async function initDb() {
  if (!pool) {
    console.error('❌ DATABASE_URL tidak valid. Tidak bisa terhubung ke PostgreSQL.');
    return false;
  }

  try {
    const client = await pool.connect();
    console.log('✅ Berhasil terhubung ke PostgreSQL Database!');
    isConnectedToPostgres = true;

    // Ensure all tables exist (idempotent)
    await client.query(`
      CREATE TABLE IF NOT EXISTS components (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100),
        category VARCHAR(50) NOT NULL,
        price BIGINT NOT NULL DEFAULT 0,
        image_url TEXT DEFAULT '',
        description TEXT DEFAULT '',
        specifications JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS builds (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        budget BIGINT NOT NULL DEFAULT 0,
        total_price BIGINT NOT NULL DEFAULT 0,
        compatibility_status VARCHAR(50) DEFAULT 'compatible',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS build_items (
        id SERIAL PRIMARY KEY,
        build_id INTEGER REFERENCES builds(id) ON DELETE CASCADE,
        component_id INTEGER REFERENCES components(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        price_at_selection BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countRes = await client.query('SELECT COUNT(*) as count FROM components');
    const count = parseInt(countRes.rows[0]?.count || 0, 10);
    console.log(`ℹ️ Database PostgreSQL siap dengan ${count} komponen.`);

    client.release();
    return true;
  } catch (err) {
    console.warn('⚠️ Gagal terhubung ke PostgreSQL:', err.message);
    isConnectedToPostgres = false;
    return false;
  }
}

// =========================================================
// QUERY FUNCTION — PostgreSQL only
// =========================================================
async function query(text, params = []) {
  if (!isConnectedToPostgres || !pool) {
    throw new Error('Database PostgreSQL belum terhubung.');
  }
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', err.message);
    throw err;
  }
}

module.exports = {
  pool,
  query,
  initDb,
  getIsPostgres: () => isConnectedToPostgres,
};
