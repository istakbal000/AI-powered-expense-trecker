const { Ollama } = require('ollama');

const ollama = new Ollama({ host: process.env.OLLAMA_URL || 'http://localhost:11434' });

const formatOllamaResponse = (resp) => {
    if (!resp) return '';
    if (typeof resp === 'string') return resp;
    return resp.response || resp.output || resp.text || JSON.stringify(resp);
};

const getAIInsights = async (req, res) => {
    try {
        const expenses = req.body.expenses || [];
        
        if (expenses.length === 0) {
            return res.status(400).json({ error: "No expense data provided" });
        }

        // Calculate statistics
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const categoryBreakdown = {};
        expenses.forEach(exp => {
            categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
        });

        // Analyze spending patterns for personalization
        const avgExpense = totalSpent / expenses.length;
        const highValueExpenses = expenses.filter(exp => exp.amount > avgExpense * 1.5);
        const frequentCategories = Object.keys(categoryBreakdown).filter(cat => categoryBreakdown[cat] > totalSpent * 0.2);
        const recentExpenses = expenses.slice(-5);

        // Prepare personalized prompt for AI
        const prompt = `As a personal financial advisor, analyze this user's spending patterns and provide personalized advice:

User Profile:
- Total Spent: $${totalSpent.toFixed(2)} over ${expenses.length} transactions
- Average Expense: $${avgExpense.toFixed(2)}
- High-value purchases (${highValueExpenses.length}): ${highValueExpenses.map(e => `${e.description} ($${e.amount})`).join(', ')}
- Dominant spending categories: ${frequentCategories.join(', ')}
- Recent spending: ${recentExpenses.map(e => `${e.description} ($${e.amount})`).join(', ')}

Category Breakdown:
${Object.entries(categoryBreakdown).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)} (${((amt/totalSpent)*100).toFixed(1)}%)`).join('\n')}

Please provide personalized advice:
1. Analyze THIS USER's specific spending patterns and habits
2. Based on their high-value purchases, suggest smarter alternatives
3. For their dominant categories, provide specific reduction strategies
4. Identify 2-3 personalized money-saving opportunities based on THEIR spending
5. Create a weekly action plan with concrete steps

Use "you" and "your" to make it personal. Be specific and actionable based on their actual spending data.`;

        let response;
        try {
            response = await ollama.generate({
                model: process.env.OLLAMA_MODEL || 'gemma3:1b',
                prompt: prompt,
                stream: false
            });
        } catch (innerErr) {
            console.error('Ollama connection error (insights):', innerErr && innerErr.message ? innerErr.message : innerErr);
            const isConnErr = innerErr && (innerErr.code === 'ECONNREFUSED' || /connect|ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i.test(innerErr.message || ''));
            return res.status(isConnErr ? 502 : 500).json({ error: isConnErr ? 'Ollama service unavailable' : 'Failed to generate insights', details: innerErr && innerErr.message });
        }

        res.status(200).json({
            insights: formatOllamaResponse(response),
            totalSpent,
            categoryBreakdown,
            expenseCount: expenses.length
        });

    } catch (err) {
        console.error('AI Insights Error:', err);
        res.status(500).json({ error: "Failed to generate insights: " + err.message });
    }
};

const getBudgetSuggestions = async (req, res) => {
    try {
        const { monthlyIncome, expenses, savingsGoal } = req.body;
        
        if (!monthlyIncome || !expenses) {
            return res.status(400).json({ error: "Monthly income and expenses are required" });
        }

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const categoryBreakdown = {};
        expenses.forEach(exp => {
            categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
        });
        
        // Personalization analysis
        const savingsRate = ((monthlyIncome - totalSpent) / monthlyIncome * 100).toFixed(1);
        const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
        const problemCategories = Object.entries(categoryBreakdown).filter(([cat, amt]) => amt > monthlyIncome * 0.3);

        const prompt = `As this user's personal financial coach, create a customized budget plan based on THEIR actual spending:

User's Financial Profile:
- Monthly Income: $${monthlyIncome}
- Current Spending: $${totalSpent.toFixed(2)} (${((totalSpent/monthlyIncome)*100).toFixed(1)}% of income)
- Current Savings Rate: ${savingsRate}%
- Biggest expense category: ${topCategory ? `${topCategory[0]} ($${topCategory[1].toFixed(2)})` : 'None'}
- Problem areas (>30% of income): ${problemCategories.map(([cat, amt]) => `${cat} ($${amt.toFixed(2)})`).join(', ')}

Current Category Breakdown:
${Object.entries(categoryBreakdown).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)} (${((amt/monthlyIncome)*100).toFixed(1)}% of income)`).join('\n')}

Create a personalized plan for THIS USER:
1. Realistic budget percentages based on THEIR spending habits (not generic 50/30/20)
2. For ${topCategory ? `their biggest expense (${topCategory[0]})` : 'their largest category'}, provide 3 specific reduction strategies
3. Address their problem areas with concrete solutions
4. Set achievable savings targets based on their current ${savingsRate}% rate
5. Weekly challenges to help them stay on track

Speak directly to "you" and reference their actual spending. Make it feel personal and achievable.`;

        let response;
        try {
            response = await ollama.generate({
                model: process.env.OLLAMA_MODEL || 'gemma3:1b',
                prompt: prompt,
                stream: false
            });
        } catch (innerErr) {
            console.error('Ollama connection error (budget):', innerErr && innerErr.message ? innerErr.message : innerErr);
            const isConnErr = innerErr && (innerErr.code === 'ECONNREFUSED' || /connect|ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i.test(innerErr.message || ''));
            return res.status(isConnErr ? 502 : 500).json({ error: isConnErr ? 'Ollama service unavailable' : 'Failed to generate budget suggestions', details: innerErr && innerErr.message });
        }

        res.status(200).json({
            suggestions: formatOllamaResponse(response),
            currentSpending: totalSpent,
            remainingBudget: monthlyIncome - totalSpent
        });

    } catch (err) {
        console.error('Budget Suggestions Error:', err);
        res.status(500).json({ error: "Failed to generate budget suggestions: " + err.message });
    }
};

const analyzeExpense = async (req, res) => {
    try {
        const { description, amount, category } = req.body;
        
        if (!description || !amount || !category) {
            return res.status(400).json({ error: "Expense details are required" });
        }

        const prompt = `Analyze this specific purchase for the user:

Purchase Details:
- Description: ${description}
- Amount: $${amount}
- Category: ${category}

Provide personalized advice:
1. Based on the "$${amount}" price point, is this purchase justified for their budget?
2. For ${category} spending, suggest 2-3 specific alternatives that could save them money
3. Give a personal tip about ${category} purchases that could help them make smarter decisions
4. If this is a recurring expense, suggest how to optimize it

Make it feel like you're talking directly to them about THEIR money. Be practical and specific.`;

        let response;
        try {
            response = await ollama.generate({
                model: process.env.OLLAMA_MODEL || 'gemma3:1b',
                prompt: prompt,
                stream: false
            });
        } catch (innerErr) {
            console.error('Ollama connection error (analyze):', innerErr && innerErr.message ? innerErr.message : innerErr);
            const isConnErr = innerErr && (innerErr.code === 'ECONNREFUSED' || /connect|ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i.test(innerErr.message || ''));
            return res.status(isConnErr ? 502 : 500).json({ error: isConnErr ? 'Ollama service unavailable' : 'Failed to analyze expense', details: innerErr && innerErr.message });
        }

        res.status(200).json({
            analysis: formatOllamaResponse(response)
        });

    } catch (err) {
        console.error('Expense Analysis Error:', err);
        res.status(500).json({ error: "Failed to analyze expense: " + err.message });
    }
};

module.exports = { getAIInsights, getBudgetSuggestions, analyzeExpense };
