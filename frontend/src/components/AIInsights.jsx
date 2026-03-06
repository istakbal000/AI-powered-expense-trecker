import { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, TrendingDown, AlertCircle } from 'lucide-react';

const AIInsights = ({ expenses, currencySymbol = '$', onInsightsReceived }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getInsights = async () => {
    if (expenses.length === 0) {
      setError('Add some expenses first to get AI insights!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ai-powered-expense-trecker.onrender.com/api/v1/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ expenses }),
      });

      const data = await response.json();

      if (response.ok) {
        setInsights(data);
        onInsightsReceived?.(data);
      } else {
        setError(data.error || 'Failed to get insights');
      }
    } catch (err) {
      setError('Make sure Ollama is running locally!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">AI Expense Insights</h2>
        </div>
        <button
          onClick={getInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get Insights
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!insights && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 text-purple-300" />
          <p>Click "Get Insights" to receive AI-powered analysis of your spending habits and personalized tips to reduce expenses!</p>
        </div>
      )}

      {insights && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-purple-600">{currencySymbol}{insights.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-2xl font-bold text-blue-600">{insights.expenseCount}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-green-600">{Object.keys(insights.categoryBreakdown).length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-800">AI Analysis & Recommendations</h3>
            </div>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {insights.insights}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Category Breakdown</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(insights.categoryBreakdown).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700">{category}</span>
                  <span className="font-semibold text-gray-900">
                    {currencySymbol}{amount.toFixed(2)} ({((amount / insights.totalSpent) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
