const { query, getIsPostgres, memoryStore } = require('../config/db');

// =========================================================
// Helper: parse specifications field (always return object)
// =========================================================
function parseSpecs(item) {
  return {
    ...item,
    specifications: typeof item.specifications === 'string'
      ? JSON.parse(item.specifications)
      : (item.specifications || {}),
  };
}

// =========================================================
// GET /api/components  — with filtering
// =========================================================
async function getAllComponents(req, res, next) {
  try {
    const { category, search, minPrice, maxPrice, brand } = req.query;

    if (getIsPostgres()) {
      // ---- POSTGRES: build dynamic SQL ----
      let sql = 'SELECT * FROM components WHERE 1=1';
      const params = [];
      let idx = 1;

      if (category && category !== 'all') {
        sql += ` AND LOWER(category) = $${idx++}`;
        params.push(category.toLowerCase());
      }
      if (search && search.trim()) {
        sql += ` AND (LOWER(name) LIKE $${idx} OR LOWER(brand) LIKE $${idx})`;
        params.push(`%${search.trim().toLowerCase()}%`);
        idx++;
      }
      if (brand && brand !== 'all') {
        sql += ` AND LOWER(brand) = $${idx++}`;
        params.push(brand.toLowerCase());
      }
      if (minPrice && !isNaN(minPrice)) {
        sql += ` AND price >= $${idx++}`;
        params.push(Number(minPrice));
      }
      if (maxPrice && !isNaN(maxPrice)) {
        sql += ` AND price <= $${idx++}`;
        params.push(Number(maxPrice));
      }
      sql += ' ORDER BY category ASC, price ASC';

      const result = await query(sql, params);
      const components = result.rows.map(parseSpecs);
      return res.json({ success: true, count: components.length, data: components });
    }

    // ---- MEMORY STORE: filter in JS ----
    let rows = [...memoryStore.components];

    if (category && category !== 'all') {
      rows = rows.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(c =>
        c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
      );
    }
    if (brand && brand !== 'all') {
      rows = rows.filter(c => c.brand.toLowerCase() === brand.toLowerCase());
    }
    if (minPrice && !isNaN(minPrice)) {
      rows = rows.filter(c => c.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(maxPrice)) {
      rows = rows.filter(c => c.price <= Number(maxPrice));
    }

    rows.sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return a.price - b.price;
    });

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// GET /api/components/:id
// =========================================================
async function getComponentById(req, res, next) {
  try {
    const { id } = req.params;

    if (getIsPostgres()) {
      const result = await query('SELECT * FROM components WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: `Komponen ID ${id} tidak ditemukan.` });
      }
      return res.json({ success: true, data: parseSpecs(result.rows[0]) });
    }

    // Memory
    const comp = memoryStore.components.find(c => c.id === Number(id));
    if (!comp) {
      return res.status(404).json({ success: false, message: `Komponen ID ${id} tidak ditemukan.` });
    }
    return res.json({ success: true, data: comp });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// GET /api/components/category/:category
// =========================================================
async function getComponentsByCategory(req, res, next) {
  try {
    const { category } = req.params;

    if (getIsPostgres()) {
      const result = await query(
        'SELECT * FROM components WHERE LOWER(category) = $1 ORDER BY price ASC',
        [category.toLowerCase()]
      );
      return res.json({ success: true, count: result.rows.length, data: result.rows.map(parseSpecs) });
    }

    // Memory
    const rows = memoryStore.components
      .filter(c => c.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => a.price - b.price);
    return res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// POST /api/components
// =========================================================
async function createComponent(req, res, next) {
  try {
    const { name, brand, category, price, image_url, description, specifications } = req.body;

    if (!name || !brand || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Field name, brand, category, dan price wajib diisi.' });
    }

    const specsJson = JSON.stringify(specifications || {});

    if (getIsPostgres()) {
      const result = await query(
        `INSERT INTO components (name, brand, category, price, image_url, description, specifications)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, brand, category.toLowerCase(), Number(price), image_url || '', description || '', specsJson]
      );
      return res.status(201).json({ success: true, message: 'Komponen berhasil ditambahkan.', data: parseSpecs(result.rows[0]) });
    }

    // Memory
    const newComp = {
      id: memoryStore.nextComponentId++,
      name, brand,
      category: category.toLowerCase(),
      price: Number(price),
      image_url: image_url || '',
      description: description || '',
      specifications: specifications || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.components.push(newComp);
    return res.status(201).json({ success: true, message: 'Komponen berhasil ditambahkan.', data: newComp });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// PUT /api/components/:id
// =========================================================
async function updateComponent(req, res, next) {
  try {
    const { id } = req.params;
    const { name, brand, category, price, image_url, description, specifications } = req.body;

    if (getIsPostgres()) {
      const checkRes = await query('SELECT * FROM components WHERE id = $1', [id]);
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: `Komponen ID ${id} tidak ditemukan.` });
      }
      const specsJson = JSON.stringify(specifications || {});
      const result = await query(
        `UPDATE components SET name=$1, brand=$2, category=$3, price=$4, image_url=$5, description=$6, specifications=$7, updated_at=CURRENT_TIMESTAMP WHERE id=$8 RETURNING *`,
        [name, brand, category.toLowerCase(), Number(price), image_url, description, specsJson, id]
      );
      return res.json({ success: true, message: 'Komponen berhasil diperbarui.', data: parseSpecs(result.rows[0]) });
    }

    // Memory
    const idx = memoryStore.components.findIndex(c => c.id === Number(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Komponen ID ${id} tidak ditemukan.` });
    }
    memoryStore.components[idx] = {
      ...memoryStore.components[idx],
      name, brand,
      category: category.toLowerCase(),
      price: Number(price),
      image_url: image_url || '',
      description: description || '',
      specifications: specifications || {},
      updated_at: new Date().toISOString(),
    };
    return res.json({ success: true, message: 'Komponen berhasil diperbarui.', data: memoryStore.components[idx] });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// DELETE /api/components/:id
// =========================================================
async function deleteComponent(req, res, next) {
  try {
    const { id } = req.params;

    if (getIsPostgres()) {
      const result = await query('DELETE FROM components WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: `Komponen ID ${id} tidak ditemukan.` });
      }
      return res.json({ success: true, message: 'Komponen berhasil dihapus.', data: result.rows[0] });
    }

    // Memory
    const idx = memoryStore.components.findIndex(c => c.id === Number(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Komponen ID ${id} tidak ditemukan.` });
    }
    const deleted = memoryStore.components.splice(idx, 1)[0];
    return res.json({ success: true, message: 'Komponen berhasil dihapus.', data: deleted });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllComponents,
  getComponentById,
  getComponentsByCategory,
  createComponent,
  updateComponent,
  deleteComponent,
};
