import { useState } from 'react';
import { Wallet, Brain, PieChart, TrendingUp, Shield, Sparkles, ArrowRight, CheckCircle, DollarSign, Target, Menu, X } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized spending analysis and smart recommendations to reduce expenses using local AI.'
    },
    {
      icon: PieChart,
      title: 'Smart Categorization',
      description: 'Automatically categorize expenses and visualize your spending patterns with beautiful charts.'
    },
    {
      icon: Target,
      title: 'Budget Planning',
      description: 'Set income goals and let AI create a personalized budget plan tailored to your lifestyle.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays on your device with Ollama. No cloud processing, complete privacy.'
    },
    {
      icon: DollarSign,
      title: 'Multi-Currency',
      description: 'Track expenses in USD, INR, EUR, GBP, JPY, and more. Automatic conversion support.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your savings journey and see how small changes lead to big results over time.'
    }
  ];

  const steps = [
    { step: '1', title: 'Sign Up', desc: 'Create your account in seconds' },
    { step: '2', title: 'Add Expenses', desc: 'Log daily spending with categories' },
    { step: '3', title: 'Get AI Insights', desc: 'Receive personalized saving tips' },
    { step: '4', title: 'Save Money', desc: 'Watch your savings grow!' }
  ];

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/25">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                ExpenseAI
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">How It Works</a>
              <button 
                onClick={() => onNavigate('login')}
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium"
              >
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <div className="flex flex-col gap-4 px-4">
              <a href="#features" className="text-gray-600 py-2">Features</a>
              <a href="#how-it-works" className="text-gray-600 py-2">How It Works</a>
              <button 
                onClick={() => onNavigate('login')}
                className="text-gray-600 py-2 text-left"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-indigo-50/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-full mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">Powered by Ollama AI</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Track Expenses with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Smart expense tracking that learns your spending habits and provides personalized 
            recommendations to help you save more money. Private, secure, and powered by local AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => onNavigate('register')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Start Tracking Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="px-8 py-4 text-gray-700 font-semibold hover:text-purple-600 transition-colors"
            >
              Already have an account? Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t border-gray-200">
            <div>
              <p className="text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">$2M+</p>
              <p className="text-gray-600">Money Saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">50+</p>
              <p className="text-gray-600">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/30">
        {/* Features Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-100/20 via-transparent to-indigo-100/20"></div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-violet-200/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-200/15 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Everything You Need to Save Money
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides all the tools you need to track, analyze, 
              and optimize your spending habits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-105 hover:bg-white/80"
              >
                <div className="p-4 bg-gradient-to-br from-violet-100/50 to-indigo-100/50 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50">
        {/* How It Works Background */}
        <div className="absolute inset-0 bg-gradient-to-l from-indigo-100/20 via-transparent to-violet-100/20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-200/15 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started with ExpenseAI in just 4 simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* CTA Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-700/20 via-transparent to-indigo-700/20"></div>
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-violet-100 mb-10">
            Join thousands of users who are already using AI to track expenses and save money.
          </p>
          <button 
            onClick={() => onNavigate('register')}
            className="px-8 py-4 bg-white text-violet-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-violet-50"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 ExpenseAI. Powered by Ollama Gemma3:1b. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
