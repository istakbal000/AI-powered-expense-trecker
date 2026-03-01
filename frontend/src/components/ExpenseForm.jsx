import { useState } from 'react';
import { PlusCircle, DollarSign, Tag, FileText, Coins } from 'lucide-react';

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food', 'Transport', 'Shopping', 'Entertainment', 
    'Bills', 'Health', 'Education', 'Other'
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  ];

  const getCurrencySymbol = (code) => {
    const curr = currencies.find(c => c.code === code);
    return curr ? curr.symbol : '$';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    setLoading(true);
    try {
      await onAddExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        currency: formData.currency,
      });
      // Clear form after successful add
      setFormData({ description: '', amount: '', category: 'Food', currency: 'USD' });
    } catch (err) {
      console.error('Failed to add expense:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          <PlusCircle className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4 inline mr-1" />
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What did you spend on?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Coins className="w-4 h-4 inline mr-1" />
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {getCurrencySymbol(formData.currency)}
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
