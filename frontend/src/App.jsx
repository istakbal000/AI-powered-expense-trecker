import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import AIInsights from './components/AIInsights'
import BudgetPlanner from './components/BudgetPlanner'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import { Wallet, PieChart, TrendingUp, DollarSign, LogOut, User, Coins } from 'lucide-react'

function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState('landing') // landing, login, register, dashboard
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
      const response = await fetch('http://localhost:8000/api/v1/expence/getallexpence', {
        credentials: 'include'
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
      await fetch('http://localhost:8000/api/v1/user/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      console.error('Logout error:', err)
    }
    setIsAuthenticated(false)
    setExpenses([])
    setCurrentView('landing')
  }

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/expence/getallexpence', {
        credentials: 'include'
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
      const response = await fetch('http://localhost:8000/api/v1/expence/addexpence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(expenseData)
      })
      if (response.ok) {
        fetchExpenses()
        return true
      } else if (response.status === 401) {
        setIsAuthenticated(false)
        setCurrentView('login')
      }
    } catch (err) {
      console.error('Failed to add expense:', err)
    }
    return false
  }

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/expence/deleteexpence/${id}`, {
        method: 'DELETE',
        credentials: 'include'
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
        const response = await fetch(`http://localhost:8000/api/v1/expence/updateexpence/${expense._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch('http://localhost:8000/api/v1/ai/analyze-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      return 'Failed to analyze. Make sure Ollama is running!'
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Expense Tracker
                </h1>
                <p className="text-xs text-gray-500">Powered by Ollama Gemma3:1b</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                <Coins className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">{primaryCurrency}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">{currencySymbol}{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-xl font-bold text-gray-900">{Object.keys(categoryTotals).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Category</p>
                <p className="text-xl font-bold text-gray-900 truncate max-w-[120px]">
                  {topCategory ? topCategory[0] : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

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
      </main>
    </div>
  )
}

export default App
