const { initDb, pool } = require('../src/config/db');

async function run() {
  console.log('🚀 Menjalankan inisialisasi skema database Haniforge...');
  try {
    await initDb();
    console.log('🎉 Inisialisasi database selesai dengan sukses!');
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat inisialisasi database:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
    process.exit(0);
  }
}

run();
