const express = require('express');
const { getAIInsights, getBudgetSuggestions, analyzeExpense } = require('../controller/aicontroller');
const isauth = require('../middleware/isauth.js');

const router = express.Router();

router.route('/insights').post(isauth, getAIInsights);
router.route('/budget-suggestions').post(isauth, getBudgetSuggestions);
router.route('/analyze-expense').post(isauth, analyzeExpense);

module.exports = router;
