const { checkCompatibility } = require('../services/compatibilityService');
const { getBudgetRecommendations } = require('../services/recommendationService');

// POST /api/compatibility/check
async function checkBuildCompatibility(req, res, next) {
  try {
    const { components = {}, budget = 0 } = req.body;

    // Run compatibility analysis on specs
    const compatibilityResult = checkCompatibility(components);

    // Calculate total price
    let totalPrice = 0;
    Object.values(components).forEach((comp) => {
      if (comp && comp.price) {
        totalPrice += Number(comp.price);
      }
    });

    const numBudget = Number(budget) || 0;
    const remainingBudget = numBudget > 0 ? numBudget - totalPrice : 0;
    const isOverBudget = numBudget > 0 && totalPrice > numBudget;
    const overBudgetAmount = isOverBudget ? totalPrice - numBudget : 0;
    const percentageUsed = numBudget > 0 ? Math.min(100, Math.round((totalPrice / numBudget) * 100)) : 0;

    // Get recommendations if over budget
    let budgetRecommendations = {
      isOverBudget,
      overBudgetAmount,
      recommendations: []
    };

    if (isOverBudget) {
      budgetRecommendations = await getBudgetRecommendations(components, numBudget, totalPrice);
    }

    return res.json({
      success: true,
      data: {
        compatibility: compatibilityResult,
        budget_analysis: {
          budget: numBudget,
          total_price: totalPrice,
          remaining_budget: remainingBudget,
          is_over_budget: isOverBudget,
          over_budget_amount: overBudgetAmount,
          percentage_used: percentageUsed,
          recommendations: budgetRecommendations.recommendations
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkBuildCompatibility
};
