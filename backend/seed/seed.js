const { query, pool } = require('../src/config/db');
const componentsData = require('./componentsData');

async function seed() {
  console.log(`🌱 Memulai seeding ${componentsData.length} data komponen ke database...`);
  try {
    // Clear existing components
    await query('DELETE FROM build_items');
    await query('DELETE FROM components');

    for (const item of componentsData) {
      await query(
        `INSERT INTO components (name, brand, category, price, image_url, description, specifications)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [item.name, item.brand, item.category, item.price, item.image_url, item.description, JSON.stringify(item.specifications)]
      );
    }

    console.log(`✅ Berhasil melakukan seed ${componentsData.length} komponen ke database!`);
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat seeding:', error.message);
  } finally {
    if (pool) {
      await pool.end();
    }
    process.exit(0);
  }
}

seed();
