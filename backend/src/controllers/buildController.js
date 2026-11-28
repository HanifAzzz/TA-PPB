const { query } = require('../config/db');
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
// GET /api/builds (Only for the authenticated user)
// =========================================================
async function getAllBuilds(req, res, next) {
  try {
    const userId = req.userId;
    const buildsRes = await query(
      'SELECT * FROM builds WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const builds = await Promise.all(
      buildsRes.rows.map(async (b) => {
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

    return res.json({ success: true, count: builds.length, data: builds });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// GET /api/builds/:id (Only for the owner of the build)
// =========================================================
async function getBuildById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const buildRes = await query(
      'SELECT * FROM builds WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (buildRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan atau Anda tidak memiliki akses.` });
    }
    const build = buildRes.rows[0];

    const itemsRes = await query(
      `SELECT bi.id AS build_item_id, bi.component_id, bi.category, bi.price_at_selection,
              c.name, c.brand, c.price AS current_price, c.image_url, c.description, c.specifications
       FROM build_items bi
       LEFT JOIN components c ON bi.component_id = c.id
       WHERE bi.build_id = $1`,
      [id]
    );
    const items = itemsRes.rows.map(parseSpecs);

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
// POST /api/builds (Saved under the authenticated user's ID)
// =========================================================
async function createBuild(req, res, next) {
  try {
    const { name, budget, total_price, compatibility_status, items } = req.body;
    const userId = req.userId;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama rakitan PC wajib diisi.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Minimal pilih satu komponen untuk menyimpan rakitan.' });
    }

    const buildRes = await query(
      `INSERT INTO builds (user_id, name, budget, total_price, compatibility_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, name.trim(), Number(budget || 0), Number(total_price || 0), compatibility_status || 'compatible']
    );
    const newBuild = buildRes.rows[0];

    const insertedItems = [];
    for (const item of items) {
      const r = await query(
        `INSERT INTO build_items (build_id, component_id, category, price_at_selection)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [newBuild.id, Number(item.component_id), item.category, Number(item.price_at_selection || item.price || 0)]
      );
      insertedItems.push(r.rows[0]);
    }

    return res.status(201).json({
      success: true,
      message: 'Rakitan PC berhasil disimpan ke akun Anda.',
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
    const userId = req.userId;
    const { name, budget, total_price, compatibility_status, items } = req.body;

    const checkRes = await query('SELECT * FROM builds WHERE id = $1 AND user_id = $2', [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan.` });
    }

    const updateRes = await query(
      `UPDATE builds SET name=$1, budget=$2, total_price=$3, compatibility_status=$4, updated_at=CURRENT_TIMESTAMP
       WHERE id=$5 AND user_id=$6
       RETURNING *`,
      [name.trim(), Number(budget || 0), Number(total_price || 0), compatibility_status || 'compatible', id, userId]
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
    const userId = req.userId;

    const result = await query('DELETE FROM builds WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Rakitan ID ${id} tidak ditemukan atau Anda tidak memiliki akses.` });
    }
    return res.json({ success: true, message: 'Rakitan berhasil dihapus.', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllBuilds, getBuildById, createBuild, updateBuild, deleteBuild };
