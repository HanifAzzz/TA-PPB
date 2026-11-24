const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const componentsData = require('../../seed/componentsData');

dotenv.config();

let pool = null;
let isConnectedToPostgres = false;

// =========================================================
// IN-MEMORY STORE (used when no DATABASE_URL is provided)
// =========================================================
const memoryStore = {
  components: [],
  builds: [],
  build_items: [],
  nextComponentId: 1,
  nextBuildId: 1,
  nextBuildItemId: 1,
};

function seedMemoryStore() {
  memoryStore.components = [];
  componentsData.forEach((item, index) => {
    memoryStore.components.push({
      id: index + 1,
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: Number(item.price),
      image_url: item.image_url,
      description: item.description,
      specifications: item.specifications, // already object
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });
  memoryStore.nextComponentId = memoryStore.components.length + 1;
  console.log(`✅ Memory Store: ${memoryStore.components.length} komponen dimuat.`);
}

// Initialize PostgreSQL Pool if DATABASE_URL is set (defaulting to Supabase TA-PPB)
const defaultDbUrl = 'postgresql://postgres:hanifarifandi@db.uijqrcanmplthqonzogn.supabase.co:5432/postgres';
const databaseUrl = (process.env.DATABASE_URL || defaultDbUrl).trim();

if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
  try {
    // Strip sslmode query param to prevent pg from overriding rejectUnauthorized: false
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

// Test connection and initialize schema
async function initDb() {
  if (pool) {
    try {
      const client = await pool.connect();
      console.log('✅ Berhasil terhubung ke PostgreSQL Database!');
      isConnectedToPostgres = true;

      // Ensure builds & build_items tables exist (safe and idempotent)
      await client.query(`
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

      // Auto-seed components if empty
      const countRes = await client.query('SELECT COUNT(*) as count FROM components');
      const count = parseInt(countRes.rows[0]?.count || 0, 10);
      if (count === 0) {
        console.log('🌱 Database kosong, menjalankan seed data awal...');
        for (const item of componentsData) {
          await client.query(
            `INSERT INTO components (name, brand, category, price, image_url, description, specifications)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [item.name, item.brand, item.category, item.price, item.image_url, item.description, JSON.stringify(item.specifications)]
          );
        }
        console.log(`✅ Seed selesai: ${componentsData.length} komponen.`);
      } else {
        console.log(`ℹ️ Database PostgreSQL siap dengan ${count} komponen.`);
      }

      client.release();
      return true;
    } catch (err) {
      console.warn('⚠️ Gagal terhubung ke PostgreSQL:', err.message);
      console.warn('👉 Menggunakan Embedded Memory Store.');
      isConnectedToPostgres = false;
      seedMemoryStore();
      return false;
    }
  } else {
    console.log('ℹ️ DATABASE_URL belum diatur. Menggunakan Embedded Memory Store.');
    seedMemoryStore();
    return false;
  }
}

// =========================================================
// UNIFIED QUERY FUNCTION
// =========================================================
async function query(text, params = []) {
  if (isConnectedToPostgres && pool) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      console.error('Database query error:', err.message);
      throw err;
    }
  }
  return executeMemoryQuery(text, params);
}

// =========================================================
// MEMORY STORE QUERY HANDLER
// =========================================================
function executeMemoryQuery(text, params = []) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const lower = clean.toLowerCase();

  // ----- COMPONENTS -----

  // SELECT COUNT(*) FROM components (GROUP BY category)
  if (lower.includes('count(*)') && lower.includes('from components') && lower.includes('group by category')) {
    const grouped = {};
    memoryStore.components.forEach(c => {
      grouped[c.category] = (grouped[c.category] || 0) + 1;
    });
    const rows = Object.entries(grouped).map(([category, count]) => ({ category, count }));
    return { rows, rowCount: rows.length };
  }

  // SELECT COUNT(*) FROM components
  if (lower.includes('count(*)') && lower.includes('from components')) {
    return { rows: [{ count: memoryStore.components.length }], rowCount: 1 };
  }

  // SELECT COUNT(*) FROM builds
  if (lower.includes('count(*)') && lower.includes('from builds')) {
    return { rows: [{ count: memoryStore.builds.length }], rowCount: 1 };
  }

  // SELECT * FROM components WHERE id = $1
  if (lower.startsWith('select') && lower.includes('from components') && lower.includes('where id = $1')) {
    const id = Number(params[0]);
    const rows = memoryStore.components.filter(c => c.id === id);
    return { rows, rowCount: rows.length };
  }

  // SELECT * FROM components WHERE LOWER(category) = $1
  if (lower.startsWith('select') && lower.includes('from components') && lower.includes('lower(category)') && params.length >= 1) {
    const cat = params[0]?.toLowerCase();
    const rows = memoryStore.components.filter(c => c.category.toLowerCase() === cat)
      .sort((a, b) => a.price - b.price);
    return { rows, rowCount: rows.length };
  }

  // SELECT * FROM components (generic with WHERE 1=1 filtering done in controller now)
  if (lower.startsWith('select') && lower.includes('from components')) {
    // Sort: category asc, price asc
    const rows = [...memoryStore.components].sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return a.price - b.price;
    });
    return { rows, rowCount: rows.length };
  }

  // SELECT * FROM components LIMIT N
  if (lower.startsWith('select') && lower.includes('from components') && lower.includes('limit')) {
    const limitMatch = lower.match(/limit\s+(\d+)/);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 8;
    const rows = [...memoryStore.components]
      .sort((a, b) => b.price - a.price)
      .slice(0, limit);
    return { rows, rowCount: rows.length };
  }

  // INSERT INTO components
  if (lower.startsWith('insert into components')) {
    const newComp = {
      id: memoryStore.nextComponentId++,
      name: params[0],
      brand: params[1],
      category: params[2],
      price: Number(params[3]),
      image_url: params[4] || '',
      description: params[5] || '',
      specifications: typeof params[6] === 'string' ? JSON.parse(params[6]) : (params[6] || {}),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.components.push(newComp);
    return { rows: [newComp], rowCount: 1 };
  }

  // UPDATE components
  if (lower.startsWith('update components')) {
    const id = Number(params[params.length - 1]);
    const idx = memoryStore.components.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryStore.components[idx] = {
        ...memoryStore.components[idx],
        name: params[0],
        brand: params[1],
        category: params[2],
        price: Number(params[3]),
        image_url: params[4],
        description: params[5],
        specifications: typeof params[6] === 'string' ? JSON.parse(params[6]) : (params[6] || {}),
        updated_at: new Date().toISOString(),
      };
      return { rows: [memoryStore.components[idx]], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // DELETE FROM components
  if (lower.startsWith('delete from components')) {
    const id = Number(params[0]);
    const idx = memoryStore.components.findIndex(c => c.id === id);
    if (idx !== -1) {
      const deleted = memoryStore.components.splice(idx, 1)[0];
      return { rows: [deleted], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // ----- BUILDS -----

  // SELECT * FROM builds WHERE id = $1
  if (lower.startsWith('select') && lower.includes('from builds') && lower.includes('where id = $1')) {
    const id = Number(params[0]);
    const found = memoryStore.builds.filter(b => b.id === id);
    return { rows: found, rowCount: found.length };
  }

  // SELECT * FROM builds ORDER BY created_at DESC
  if (lower.startsWith('select') && lower.includes('from builds')) {
    const rows = [...memoryStore.builds].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows, rowCount: rows.length };
  }

  // INSERT INTO builds
  if (lower.startsWith('insert into builds')) {
    const newBuild = {
      id: memoryStore.nextBuildId++,
      name: params[0],
      budget: Number(params[1]),
      total_price: Number(params[2]),
      compatibility_status: params[3] || 'compatible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.builds.push(newBuild);
    return { rows: [newBuild], rowCount: 1 };
  }

  // UPDATE builds
  if (lower.startsWith('update builds')) {
    const id = Number(params[4]);
    const idx = memoryStore.builds.findIndex(b => b.id === id);
    if (idx !== -1) {
      memoryStore.builds[idx] = {
        ...memoryStore.builds[idx],
        name: params[0],
        budget: Number(params[1]),
        total_price: Number(params[2]),
        compatibility_status: params[3],
        updated_at: new Date().toISOString(),
      };
      return { rows: [memoryStore.builds[idx]], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // DELETE FROM builds
  if (lower.startsWith('delete from builds')) {
    const id = Number(params[0]);
    const idx = memoryStore.builds.findIndex(b => b.id === id);
    if (idx !== -1) {
      const deleted = memoryStore.builds.splice(idx, 1)[0];
      memoryStore.build_items = memoryStore.build_items.filter(bi => bi.build_id !== id);
      return { rows: [deleted], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // ----- BUILD_ITEMS -----

  // SELECT bi.*, c.* FROM build_items bi LEFT JOIN components c ON ... WHERE bi.build_id = $1
  if (lower.startsWith('select') && lower.includes('from build_items')) {
    const buildId = Number(params[0]);
    const items = memoryStore.build_items.filter(bi => bi.build_id === buildId);
    const rows = items.map(bi => {
      const comp = memoryStore.components.find(c => c.id === bi.component_id) || {};
      return {
        build_item_id: bi.id,
        id: bi.id,
        build_id: bi.build_id,
        component_id: bi.component_id,
        category: bi.category,
        price_at_selection: bi.price_at_selection,
        created_at: bi.created_at,
        name: comp.name || 'Komponen tidak ditemukan',
        brand: comp.brand || '',
        current_price: comp.price || bi.price_at_selection,
        image_url: comp.image_url || '',
        description: comp.description || '',
        specifications: comp.specifications || {},
      };
    });
    return { rows, rowCount: rows.length };
  }

  // INSERT INTO build_items
  if (lower.startsWith('insert into build_items')) {
    const newItem = {
      id: memoryStore.nextBuildItemId++,
      build_id: Number(params[0]),
      component_id: Number(params[1]),
      category: params[2],
      price_at_selection: Number(params[3]),
      created_at: new Date().toISOString(),
    };
    memoryStore.build_items.push(newItem);
    return { rows: [newItem], rowCount: 1 };
  }

  // DELETE FROM build_items WHERE build_id = $1
  if (lower.startsWith('delete from build_items')) {
    const buildId = Number(params[0]);
    memoryStore.build_items = memoryStore.build_items.filter(bi => bi.build_id !== buildId);
    return { rows: [], rowCount: 1 };
  }

  // Fallback
  console.warn('⚠️ Unhandled memory query:', clean.substring(0, 100));
  return { rows: [], rowCount: 0 };
}

module.exports = {
  pool,
  query,
  initDb,
  getIsPostgres: () => isConnectedToPostgres,
  memoryStore,
};
