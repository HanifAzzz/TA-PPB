const comps = require('./seed/componentsData.js');
const fs = require('fs');
const path = require('path');

let sql = '-- Seed 48 Data Komponen Haniforge ke Supabase\n';
sql += 'INSERT INTO components (name, brand, category, price, image_url, description, specifications) VALUES\n';

const values = comps.map(c => {
  const name = c.name.replace(/'/g, "''");
  const brand = c.brand.replace(/'/g, "''");
  const cat = c.category;
  const price = c.price;
  const img = c.image_url;
  const desc = c.description.replace(/'/g, "''");
  const specs = JSON.stringify(c.specifications).replace(/'/g, "''");
  return `('${name}', '${brand}', '${cat}', ${price}, '${img}', '${desc}', '${specs}'::jsonb)`;
});

sql += values.join(',\n') + ';\n';

const outPath = path.join(__dirname, 'database', 'seed_supabase.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('✅ Berhasil membuat file SQL seed:', outPath);
console.log('Total baris komponen:', comps.length);
