import { useState } from 'react';
import { Target, DollarSign, TrendingUp, Loader2, Wallet, PiggyBank } from 'lucide-react';

const BudgetPlanner = ({ expenses, currencySymbol = '$' }) => {
  const [income, setIncome] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getSuggestions = async () => {
    if (!income) return;

    setLoading(true);
    try {
      const response = await fetch('https://ai-powered-expense-trecker.onrender.com/api/v1/ai/budget-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          monthlyIncome: parseFloat(income),
          savingsGoal: savingsGoal ? parseFloat(savingsGoal) : null,
          expenses
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuggestions(data);
      }
    } catch (err) {
      console.error('Budget suggestions error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-green-600 rounded-lg">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">AI Budget Planner</h2>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Wallet className="w-4 h-4 inline mr-1" />
            Monthly Income
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your monthly income"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <PiggyBank className="w-4 h-4 inline mr-1" />
            Savings Goal (Optional)
          </label>
          <input
            type="number"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
            placeholder="How much do you want to save?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={getSuggestions}
          disabled={loading || !income}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Get Budget Plan
            </>
          )}
        </button>
      </div>

      {suggestions && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Current Spending</p>
              <p className="text-xl font-bold text-red-600">{currencySymbol}{suggestions.currentSpending.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Remaining Budget</p>
              <p className={`text-xl font-bold ${suggestions.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol}{suggestions.remainingBudget.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-gray-700 whitespace-pre-line text-sm">
            {suggestions.suggestions}
          </div>
        </div>
      )}

      {!suggestions && !loading && income && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Current spending: <span className="font-bold">{currencySymbol}{totalSpent.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
