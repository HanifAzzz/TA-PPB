const { query, getIsPostgres, memoryStore } = require('../config/db');
const { checkCompatibility } = require('../services/compatibilityService');

function parseSpecs(item) {
  return {
    ...item,
    specifications: typeof item.specifications === 'string'
      ? JSON.parse(item.specifications)
      : (item.specifications || {}),
  };
}

// =========================================================
// GET /api/builds
// =========================================================
async function getAllBuilds(req, res, next) {
  try {
    let builds;

    if (getIsPostgres()) {
      const buildsRes = await query('SELECT * FROM builds ORDER BY created_at DESC');
      builds = buildsRes.rows;

      builds = await Promise.all(
        builds.map(async (b) => {
          const itemsRes = await query(
            `SELECT bi.*, c.name, c.brand, c.category, c.image_url
             FROM build_items bi
             LEFT JOIN components c ON bi.component_id = c.id
             WHERE bi.build_id = $1`,
            [b.id]
          );
          return { ...b, item_count: itemsRes.rows.length, items: itemsRes.rows };
        })
      );
    } else {
      // Memory
      builds = [...memoryStore.builds]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(b => {
          const items = memoryStore.build_items.filter(bi => bi.build_id === b.id);
          return { ...b, item_count: items.length, items };
        });
    }

    return res.json({ success: true, count: builds.length, data: builds });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// GET /api/builds/:id
// =========================================================
async function getBuildById(req, res, next) {
  try {
    const { id } = req.params;
    let build, items;

    if (getIsPostgres()) {
      const buildRes = await query('SELECT * FROM builds WHERE id = $1', [id]);
      if (buildRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan.` });
      }
      build = buildRes.rows[0];

      const itemsRes = await query(
        `SELECT bi.id AS build_item_id, bi.component_id, bi.category, bi.price_at_selection,
                c.name, c.brand, c.price AS current_price, c.image_url, c.description, c.specifications
         FROM build_items bi
         LEFT JOIN components c ON bi.component_id = c.id
         WHERE bi.build_id = $1`,
        [id]
      );
      items = itemsRes.rows.map(parseSpecs);
    } else {
      // Memory
      build = memoryStore.builds.find(b => b.id === Number(id));
      if (!build) {
        return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan.` });
      }

      const rawItems = memoryStore.build_items.filter(bi => bi.build_id === Number(id));
      items = rawItems.map(bi => {
        const comp = memoryStore.components.find(c => c.id === bi.component_id) || {};
        return {
          build_item_id: bi.id,
          component_id: bi.component_id,
          category: bi.category,
          price_at_selection: bi.price_at_selection,
          name: comp.name || 'Komponen tidak ditemukan',
          brand: comp.brand || '',
          current_price: comp.price || bi.price_at_selection,
          image_url: comp.image_url || '',
          description: comp.description || '',
          specifications: comp.specifications || {},
        };
      });
    }

    // Build componentsMap for compatibility re-analysis
    const componentsMap = {};
    items.forEach(item => {
      componentsMap[item.category] = {
        id: item.component_id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        price: item.price_at_selection,
        specifications: item.specifications,
      };
    });

    const compatibilityAnalysis = checkCompatibility(componentsMap);

    return res.json({
      success: true,
      data: { ...build, items, components_map: componentsMap, compatibility_analysis: compatibilityAnalysis },
    });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// POST /api/builds
// =========================================================
async function createBuild(req, res, next) {
  try {
    const { name, budget, total_price, compatibility_status, items } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama rakitan PC wajib diisi.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Minimal pilih satu komponen untuk menyimpan rakitan.' });
    }

    let newBuild, insertedItems = [];

    if (getIsPostgres()) {
      const buildRes = await query(
        `INSERT INTO builds (name, budget, total_price, compatibility_status) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name.trim(), Number(budget || 0), Number(total_price || 0), compatibility_status || 'compatible']
      );
      newBuild = buildRes.rows[0];

      for (const item of items) {
        const r = await query(
          `INSERT INTO build_items (build_id, component_id, category, price_at_selection) VALUES ($1, $2, $3, $4) RETURNING *`,
          [newBuild.id, Number(item.component_id), item.category, Number(item.price_at_selection || item.price || 0)]
        );
        insertedItems.push(r.rows[0]);
      }
    } else {
      // Memory
      newBuild = {
        id: memoryStore.nextBuildId++,
        name: name.trim(),
        budget: Number(budget || 0),
        total_price: Number(total_price || 0),
        compatibility_status: compatibility_status || 'compatible',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      memoryStore.builds.push(newBuild);

      for (const item of items) {
        const newItem = {
          id: memoryStore.nextBuildItemId++,
          build_id: newBuild.id,
          component_id: Number(item.component_id),
          category: item.category,
          price_at_selection: Number(item.price_at_selection || item.price || 0),
          created_at: new Date().toISOString(),
        };
        memoryStore.build_items.push(newItem);
        insertedItems.push(newItem);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Rakitan PC berhasil disimpan.',
      data: { ...newBuild, items: insertedItems },
    });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// PUT /api/builds/:id
// =========================================================
async function updateBuild(req, res, next) {
  try {
    const { id } = req.params;
    const { name, budget, total_price, compatibility_status, items } = req.body;

    if (getIsPostgres()) {
      const checkRes = await query('SELECT * FROM builds WHERE id = $1', [id]);
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan.` });
      }

      const updateRes = await query(
        `UPDATE builds SET name=$1, budget=$2, total_price=$3, compatibility_status=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *`,
        [name.trim(), Number(budget || 0), Number(total_price || 0), compatibility_status || 'compatible', id]
      );

      if (items && Array.isArray(items)) {
        await query('DELETE FROM build_items WHERE build_id = $1', [id]);
        for (const item of items) {
          await query(
            `INSERT INTO build_items (build_id, component_id, category, price_at_selection) VALUES ($1, $2, $3, $4)`,
            [id, Number(item.component_id), item.category, Number(item.price_at_selection || item.price || 0)]
          );
        }
      }
      return res.json({ success: true, message: 'Rakitan berhasil diperbarui.', data: updateRes.rows[0] });
    }

    // Memory
    const idx = memoryStore.builds.findIndex(b => b.id === Number(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan.` });
    }
    memoryStore.builds[idx] = {
      ...memoryStore.builds[idx],
      name: name.trim(),
      budget: Number(budget || 0),
      total_price: Number(total_price || 0),
      compatibility_status: compatibility_status || 'compatible',
      updated_at: new Date().toISOString(),
    };

    if (items && Array.isArray(items)) {
      memoryStore.build_items = memoryStore.build_items.filter(bi => bi.build_id !== Number(id));
      for (const item of items) {
        memoryStore.build_items.push({
          id: memoryStore.nextBuildItemId++,
          build_id: Number(id),
          component_id: Number(item.component_id),
          category: item.category,
          price_at_selection: Number(item.price_at_selection || item.price || 0),
          created_at: new Date().toISOString(),
        });
      }
    }

    return res.json({ success: true, message: 'Rakitan berhasil diperbarui.', data: memoryStore.builds[idx] });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// DELETE /api/builds/:id
// =========================================================
async function deleteBuild(req, res, next) {
  try {
    const { id } = req.params;

    if (getIsPostgres()) {
      const result = await query('DELETE FROM builds WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan.` });
      }
      return res.json({ success: true, message: 'Rakitan berhasil dihapus.', data: result.rows[0] });
    }

    // Memory
    const idx = memoryStore.builds.findIndex(b => b.id === Number(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan.` });
    }
    const deleted = memoryStore.builds.splice(idx, 1)[0];
    memoryStore.build_items = memoryStore.build_items.filter(bi => bi.build_id !== Number(id));

    return res.json({ success: true, message: 'Rakitan berhasil dihapus.', data: deleted });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllBuilds, getBuildById, createBuild, updateBuild, deleteBuild };
