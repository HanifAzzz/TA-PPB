const { getIsPostgres, memoryStore, query } = require('../config/db');
const { checkCompatibility } = require('./compatibilityService');

/**
 * Service Rekomendasi Komponen Penghemat Anggaran
 * Menemukan komponen alternatif yang lebih terjangkau dari kategori yang sama
 * yang kompatibel dengan rakitan saat ini.
 */
async function getBudgetRecommendations(selectedComponents, budget, totalPrice) {
  const overBudget = totalPrice - budget;
  if (overBudget <= 0) {
    return { isOverBudget: false, overBudgetAmount: 0, recommendations: [] };
  }

  // Get all components (from DB or memory)
  let allComponents;
  if (getIsPostgres()) {
    const res = await query('SELECT * FROM components ORDER BY price ASC');
    allComponents = res.rows.map(c => ({
      ...c,
      specifications: typeof c.specifications === 'string' ? JSON.parse(c.specifications) : (c.specifications || {}),
    }));
  } else {
    allComponents = [...memoryStore.components].sort((a, b) => a.price - b.price);
  }

  const recommendations = [];

  for (const [category, currentComp] of Object.entries(selectedComponents)) {
    if (!currentComp || !currentComp.price) continue;

    // Find cheaper alternatives in same category
    const candidates = allComponents.filter(c =>
      c.category.toLowerCase() === category.toLowerCase() &&
      c.id !== currentComp.id &&
      Number(c.price) < Number(currentComp.price)
    );

    for (const alt of candidates) {
      const priceDiff = Number(currentComp.price) - Number(alt.price);

      // Test compatibility with this alternative
      const simulatedBuild = { ...selectedComponents, [category]: alt };
      const compCheck = checkCompatibility(simulatedBuild);

      if (compCheck.status !== 'incompatible') {
        recommendations.push({
          category,
          current: {
            id: currentComp.id,
            name: currentComp.name,
            brand: currentComp.brand,
            price: Number(currentComp.price),
          },
          alternative: {
            id: alt.id,
            name: alt.name,
            brand: alt.brand,
            price: Number(alt.price),
            image_url: alt.image_url,
            specifications: alt.specifications,
          },
          savings: priceDiff,
          newTotalPrice: totalPrice - priceDiff,
          willBeUnderBudget: (totalPrice - priceDiff) <= budget,
          compatibilityStatus: compCheck.status,
        });
      }
    }
  }

  // Sort by savings descending
  recommendations.sort((a, b) => b.savings - a.savings);

  return {
    isOverBudget: true,
    overBudgetAmount: overBudget,
    recommendations: recommendations.slice(0, 6),
  };
}

module.exports = { getBudgetRecommendations };
