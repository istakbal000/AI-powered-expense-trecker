import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import AIInsights from './components/AIInsights'
import BudgetPlanner from './components/BudgetPlanner'
import AccountSettings from './components/AccountSettings'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import { Wallet, PieChart, TrendingUp, DollarSign, LogOut, User, Coins, Settings } from 'lucide-react'

function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState('landing') // landing, login, register, dashboard, settings
  const [dashboardView, setDashboardView] = useState('overview') // overview, settings
  const [user, setUser] = useState(null)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Fetch expenses when authenticated
  useEffect(() => {
    if (isAuthenticated && currentView === 'dashboard') {
      fetchExpenses()
    }
  }, [isAuthenticated, currentView])

  const checkAuth = async () => {
    try {
      const response = await fetch('https://ai-powered-expense-trecker.onrender.com/api/v1/expense/getallexpence', {
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        }
      })
      if (response.ok) {
        setIsAuthenticated(true)
        setCurrentView('dashboard')
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      setIsAuthenticated(false)
    }
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentView('dashboard')
  }

  const handleLogout = async () => {
    try {
      await fetch('https://ai-powered-expense-trecker.onrender.com/api/v1/user/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        }
      })
    } catch (err) {
      console.error('Logout error:', err)
    }
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setExpenses([])
    setCurrentView('landing')
  }

  const fetchExpenses = async () => {
    try {
      const response = await fetch('https://ai-powered-expense-trecker.onrender.com/api/v1/expense/getallexpence', {
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        }
      })
      if (response.ok) {
        const data = await response.json()
        setExpenses(Array.isArray(data) ? data : [])
      } else if (response.status === 401) {
        setIsAuthenticated(false)
        setCurrentView('login')
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    }
  }

  const addExpense = async (expenseData) => {
    try {
      console.log('=== ADDING EXPENSE ===');
      console.log('Expense data:', expenseData);
      
      const response = await fetch('https://ai-powered-expense-trecker.onrender.com/api/v1/expense/addexpence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
        credentials: 'include',
        body: JSON.stringify(expenseData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (response.ok) {
        console.log('Expense added successfully!');
        fetchExpenses();
        return true;
      } else {
        console.error('Failed to add expense:', responseData);
        if (response.status === 401) {
          console.log('Unauthorized - redirecting to login');
          setIsAuthenticated(false);
          setCurrentView('login');
        }
      }
    } catch (err) {
      console.error('=== EXPENSE ADDITION ERROR ===');
      console.error('Error details:', err);
    }
    return false;
  }

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`https://ai-powered-expense-trecker.onrender.com/api/v1/expense/deleteexpence/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        }
      })
      if (response.ok) {
        fetchExpenses()
      } else if (response.status === 401) {
        setIsAuthenticated(false)
        setCurrentView('login')
      }
    } catch (err) {
      console.error('Failed to delete expense:', err)
    }
  }

  const editExpense = async (expense) => {
    const currencies = [
      { code: 'USD', symbol: '$' },
      { code: 'INR', symbol: '₹' },
      { code: 'EUR', symbol: '€' },
      { code: 'GBP', symbol: '£' },
      { code: 'JPY', symbol: '¥' },
      { code: 'AUD', symbol: 'A$' },
      { code: 'CAD', symbol: 'C$' },
      { code: 'SGD', symbol: 'S$' },
      { code: 'AED', symbol: 'د.إ' },
      { code: 'CNY', symbol: '¥' },
    ]

    const curr = currencies.find(c => c.code === expense.currency) || { symbol: '$' }
    
    const newDesc = prompt('New description:', expense.description)
    const newAmount = prompt(`New amount (${curr.symbol}):`, expense.amount)
    const newCategory = prompt('New category:', expense.category)
    const newCurrency = prompt('New currency (USD, INR, EUR, etc.):', expense.currency)
    
    if (newDesc && newAmount) {
      try {
        const response = await fetch(`https://ai-powered-expense-trecker.onrender.com/api/v1/expense/updateexpence/${expense._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
          credentials: 'include',
          body: JSON.stringify({
            description: newDesc,
            amount: parseFloat(newAmount),
            category: newCategory || expense.category,
            currency: newCurrency || expense.currency
          })
        })
        if (response.ok) {
          fetchExpenses()
        } else if (response.status === 401) {
          setIsAuthenticated(false)
          setCurrentView('login')
        }
      } catch (err) {
        console.error('Failed to update expense:', err)
      }
    }
  }

  const analyzeExpense = async (expense) => {
    try {
      const response = await fetch('https://ai-powered-expense-trecker.onrender.com/api/v1/ai/analyze-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
        credentials: 'include',
        body: JSON.stringify(expense)
      })
      if (response.ok) {
        const data = await response.json()
        return data.analysis
      } else if (response.status === 401) {
        setIsAuthenticated(false)
        setCurrentView('login')
      }
    } catch (err) {
      return 'Failed to analyze. Please check your AI connection!'
    }
  }

  // Render based on current view
  if (currentView === 'landing') {
    return <LandingPage onNavigate={setCurrentView} />
  }

  if (currentView === 'login') {
    return <Login onNavigate={setCurrentView} onLogin={handleLogin} />
  }

  if (currentView === 'register') {
    return <Register onNavigate={setCurrentView} onLogin={handleLogin} />
  }

  // Dashboard View
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {})
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  // Get user's primary currency
  const primaryCurrency = expenses[0]?.currency || 'USD'
  const currencySymbols = {
    'USD': '$', 'INR': '₹', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
    'AUD': 'A$', 'CAD': 'C$', 'SGD': 'S$', 'AED': 'د.إ', 'CNY': '¥'
  }
  const currencySymbol = currencySymbols[primaryCurrency] || '$'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-indigo-100/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(255, 219, 98, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <header className="relative bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/25">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Expense Tracker
                </h1>
                <p className="text-xs text-gray-500">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50/80 backdrop-blur-sm border border-violet-200/50 rounded-lg">
                <Coins className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-700">{primaryCurrency}</span>
              </div>
              <button 
                onClick={() => setDashboardView(dashboardView === 'settings' ? 'overview' : 'settings')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-sm ${
                  dashboardView === 'settings' 
                    ? 'bg-violet-100 text-violet-700' 
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 hover:bg-white/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-red-100/50 to-pink-100/50 rounded-xl shadow-sm">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{currencySymbol}{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 hover:bg-white/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-xl shadow-sm">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{Object.keys(categoryTotals).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 hover:bg-white/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-xl shadow-sm">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{expenses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 hover:bg-white/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-100/50 to-purple-100/50 rounded-xl shadow-sm">
                <Wallet className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Category</p>
                <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate max-w-[120px]">
                  {topCategory ? topCategory[0] : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {dashboardView === 'overview' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ExpenseForm onAddExpense={addExpense} />
                <BudgetPlanner expenses={expenses} currencySymbol={currencySymbol} />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <AIInsights expenses={expenses} currencySymbol={currencySymbol} />
                <ExpenseList 
                  expenses={expenses} 
                  onDelete={deleteExpense}
                  onEdit={editExpense}
                  onAnalyze={analyzeExpense}
                />
              </div>
            </div>
          </>
        ) : (
          <AccountSettings 
            user={user} 
            onUpdate={(updatedUser) => setUser(updatedUser)} 
          />
        )}
      </main>
    </div>
  )
}

export default App
