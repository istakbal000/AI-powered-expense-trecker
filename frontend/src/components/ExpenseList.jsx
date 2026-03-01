import { useState } from 'react';
import { Trash2, Edit2, CheckCircle, XCircle, Brain } from 'lucide-react';

const ExpenseList = ({ expenses, onDelete, onEdit, onAnalyze }) => {
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const currencySymbols = {
    'USD': '$', 'INR': '₹', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
    'AUD': 'A$', 'CAD': 'C$', 'SGD': 'S$', 'AED': 'د.إ', 'CNY': '¥'
  };

  const getCurrencySymbol = (currency) => currencySymbols[currency] || '$';

  const handleAnalyze = async (expense) => {
    setAnalyzingId(expense._id);
    const result = await onAnalyze(expense);
    setAnalysis(result);
    setAnalyzingId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const categoryColors = {
    Food: 'bg-orange-100 text-orange-800',
    Transport: 'bg-blue-100 text-blue-800',
    Shopping: 'bg-pink-100 text-pink-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Bills: 'bg-red-100 text-red-800',
    Health: 'bg-green-100 text-green-800',
    Education: 'bg-yellow-100 text-yellow-800',
    Other: 'bg-gray-100 text-gray-800',
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
        <div className="text-gray-400 mb-2">
          <CheckCircle className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-500">No expenses yet. Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Your Expenses</h2>
        <span className="text-sm text-gray-500">{expenses.length} items</span>
      </div>

      {analysis && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-800">AI Analysis</h4>
              <p className="text-sm text-gray-700 mt-1">{analysis}</p>
            </div>
            <button 
              onClick={() => setAnalysis(null)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">{expense.description}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[expense.category] || categoryColors.Other}`}>
                  {expense.category}
                </span>
              </div>
              <p className="text-sm text-gray-500">{formatDate(expense.createdAt)}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">
                {getCurrencySymbol(expense.currency)}{expense.amount.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">{expense.currency}</span>
              
              <button
                onClick={() => handleAnalyze(expense)}
                disabled={analyzingId === expense._id}
                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                title="AI Analyze"
              >
                <Brain className={`w-4 h-4 ${analyzingId === expense._id ? 'animate-pulse' : ''}`} />
              </button>

              <button
                onClick={() => onEdit(expense)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(expense._id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
