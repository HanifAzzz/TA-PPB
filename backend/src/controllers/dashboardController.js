const { query } = require('../config/db');

// GET /api/dashboard/stats
async function getStats(req, res, next) {
  try {
    const compCountRes = await query('SELECT COUNT(*) as count FROM components');
    const totalComponents = parseInt(compCountRes.rows[0]?.count || '0', 10);

    const buildCountRes = await query('SELECT COUNT(*) as count FROM builds');
    const totalBuilds = parseInt(buildCountRes.rows[0]?.count || '0', 10);

    const catRes = await query('SELECT category, COUNT(*) as count FROM components GROUP BY category');
    const categoryCounts = {};
    catRes.rows.forEach(r => { categoryCounts[r.category] = parseInt(r.count, 10); });

    const featuredRes = await query('SELECT * FROM components ORDER BY price DESC LIMIT 8');
    const featuredComponents = featuredRes.rows.map(c => ({
      ...c,
      specifications: typeof c.specifications === 'string' ? JSON.parse(c.specifications) : c.specifications,
    }));

    const recentRes = await query('SELECT * FROM builds ORDER BY created_at DESC LIMIT 4');
    const recentBuilds = recentRes.rows;

    return res.json({
      success: true,
      data: {
        total_components: totalComponents,
        total_builds: totalBuilds,
        categories: [
          { key: 'cpu',         name: 'Processor (CPU)',    count: categoryCounts['cpu'] || 0,         icon: 'Cpu' },
          { key: 'motherboard', name: 'Motherboard',         count: categoryCounts['motherboard'] || 0, icon: 'CircuitBoard' },
          { key: 'ram',         name: 'RAM (Memory)',        count: categoryCounts['ram'] || 0,         icon: 'Layers' },
          { key: 'gpu',         name: 'VGA / Kartu Grafis', count: categoryCounts['gpu'] || 0,         icon: 'Tv' },
          { key: 'storage',     name: 'Storage (SSD/HDD)',  count: categoryCounts['storage'] || 0,     icon: 'HardDrive' },
          { key: 'psu',         name: 'Power Supply (PSU)', count: categoryCounts['psu'] || 0,         icon: 'Zap' },
          { key: 'casing',      name: 'Casing PC',          count: categoryCounts['casing'] || 0,      icon: 'Box' },
          { key: 'cooler',      name: 'CPU Cooler',         count: categoryCounts['cooler'] || 0,      icon: 'Fan' },
        ],
        featured_components: featuredComponents,
        recent_builds: recentBuilds,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };
