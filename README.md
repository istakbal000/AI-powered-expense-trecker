# AI-Powered Expense Tracker 🚀

A full-stack MERN application that leverages AI to provide personalized expense tracking, insights, and budget recommendations.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login and registration with JWT
- **Expense Management**: Add, edit, delete, and track expenses
- **Category Organization**: Organize expenses by categories (Food, Transport, Entertainment, etc.)
- **Multi-Currency Support**: Track expenses in USD, EUR, INR, GBP, and more

### AI-Powered Features
- **Personalized Insights**: AI analyzes your spending patterns and provides tailored advice
- **Smart Budget Suggestions**: Get customized budget plans based on your income and spending habits
- **Expense Analysis**: Individual expense analysis with money-saving recommendations
- **Spending Pattern Recognition**: AI identifies trends and suggests optimization strategies

### User Experience
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **Real-time Updates**: Instant feedback on expense additions
- **Interactive Dashboard**: Visual representation of spending data
- **Mobile-Friendly**: Works seamlessly on all devices

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### AI Integration
- **Ollama** - Local AI model hosting
- **Gemma3:1b** - Lightweight AI model for insights
- **Custom prompts** - Personalized financial advice

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Ollama with Gemma3:1b model

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/istakbal000/AI-powered-expense-trecker.git
   cd AI-powered-expense-trecker
   ```

2. **Install Ollama and Gemma3:1b**
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull Gemma3:1b model
   ollama pull gemma3:1b
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# JWT
SECRET_JWT=your-super-secret-jwt-key

# Ollama
OLLAMA_URL=http://localhost:11434

# Server
PORT=8000
```

### Running the Application

1. **Start MongoDB** (if running locally)

2. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:8000`

3. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📖 Usage

### 1. Create an Account
- Visit `http://localhost:5173`
- Click "Register" and create your account

### 2. Add Expenses
- Log in to your account
- Click "Add Expense" 
- Enter description, amount, category, and currency
- View your expenses in the dashboard

### 3. Get AI Insights
- Click on the "AI Insights" tab
- The AI will analyze your spending patterns
- Receive personalized recommendations

### 4. Budget Planning
- Access the "Budget Planner" 
- Enter your monthly income
- Get customized budget suggestions

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout

### Expenses
- `GET /api/v1/expence/getallexpence` - Get all user expenses
- `POST /api/v1/expence/addexpence` - Add new expense
- `PUT /api/v1/expence/updateexpence/:id` - Update expense
- `DELETE /api/v1/expence/deleteexpence/:id` - Delete expense

### AI Features
- `POST /api/v1/ai/insights` - Get personalized spending insights
- `POST /api/v1/ai/budget-suggestions` - Get budget recommendations
- `POST /api/v1/ai/analyze-expense` - Analyze individual expense

### Health Check
- `GET /` - API health status

## 🤖 AI Features Explained

### Personalized Insights
The AI analyzes:
- Your spending patterns and habits
- High-value purchases and alternatives
- Dominant spending categories
- Recent spending trends
- Provides a weekly action plan

### Budget Suggestions
Customized based on:
- Your actual spending habits
- Current savings rate
- Problem areas (>30% of income)
- Biggest expense categories
- Achievable savings targets

### Expense Analysis
For individual purchases:
- Purchase justification based on price
- Category-specific alternatives
- Optimization tips for recurring expenses
- Personalized money-saving advice

## 🎯 Project Structure

```
AI-powered-expense-trecker/
├── backend/
│   ├── controller/          # Business logic
│   │   ├── aicontroller.js    # AI features
│   │   ├── expensecontroller.js # Expense management
│   │   └── usercontroller.js   # User auth
│   ├── database/           # Database models
│   ├── middleware/         # Auth middleware
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main app component
│   │   └── api.js        # API calls
│   └── public/           # Static assets
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Secure cookie handling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Start with: npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Real-time notifications
- [ ] Expense categories customization
- [ ] Data export (CSV/PDF)
- [ ] Mobile app development
- [ ] Advanced AI models integration
- [ ] Recurring expense automation
- [ ] Savings goals tracking
- [ ] Investment recommendations

## 🐛 Troubleshooting

### Common Issues

1. **Ollama Connection Error**
   - Ensure Ollama is running: `ollama serve`
   - Check if Gemma3:1b is installed: `ollama list`

2. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in .env

3. **CORS Issues**
   - Ensure frontend and backend are running on correct ports
   - Check CORS configuration in server.js

4. **AI Not Responding**
   - Restart Ollama service
   - Verify model is pulled correctly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by [Istakbal](https://github.com/istakbal000)

## 🙏 Acknowledgments

- Ollama team for the amazing AI platform
- React and Node.js communities
- Tailwind CSS for the beautiful design system

---

⭐ If you find this project helpful, please give it a star!
