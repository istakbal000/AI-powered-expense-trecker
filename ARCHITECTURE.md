# AI-Powered Expense Tracker - System Architecture & Design

## 🏗️ System Architecture Overview

The AI-Powered Expense Tracker follows a **microservices-inspired MERN architecture** with clear separation of concerns, scalable components, and AI integration.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Service    │
│   (React SPA)   │◄──►│   (Express.js)  │◄──►│   (Ollama)      │
│   Port: 5173    │    │   Port: 8000    │    │   Port: 11434   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (MongoDB)     │
                       │   Port: 27017   │
                       └─────────────────┘
```

## 📋 Architecture Layers

### 1. Presentation Layer (Frontend)
**Technology**: React 18 + Vite + Tailwind CSS

**Components Architecture**:
```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── expense/           # Expense management
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   └── ExpenseCard.jsx
│   ├── ai/                # AI-powered features
│   │   ├── AIInsights.jsx
│   │   ├── BudgetPlanner.jsx
│   │   └── ExpenseAnalyzer.jsx
│   └── layout/            # Layout components
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── LandingPage.jsx
├── hooks/                 # Custom React hooks
│   ├── useAuth.js
│   ├── useExpenses.js
│   └── useAI.js
├── services/             # API services
│   ├── api.js            # Axios configuration
│   ├── authService.js
│   ├── expenseService.js
│   └── aiService.js
├── utils/                # Utility functions
│   ├── formatters.js
│   ├── validators.js
│   └── constants.js
└── store/                # State management
    ├── authStore.js
    ├── expenseStore.js
    └── uiStore.js
```

**Key Design Patterns**:
- **Component Composition**: Reusable UI components
- **Custom Hooks**: Business logic separation
- **Service Layer**: API abstraction
- **State Management**: Context + useReducer pattern

### 2. Application Layer (Backend API)
**Technology**: Node.js + Express.js

**API Architecture**:
```
backend/
├── controllers/           # Business logic
│   ├── usercontroller.js    # Authentication logic
│   ├── expensecontroller.js # CRUD operations
│   └── aicontroller.js      # AI integration
├── routes/               # API routing
│   ├── userroute.js         # /api/v1/user/*
│   ├── expenceroute.js      # /api/v1/expense/*
│   └── airoute.js          # /api/v1/ai/*
├── middleware/           # Cross-cutting concerns
│   ├── isauth.js            # JWT authentication
│   ├── validation.js        # Input validation
│   ├── errorHandler.js      # Error handling
│   └── rateLimiter.js       # Rate limiting
├── models/               # Data models
│   ├── User.js               # User schema
│   ├── Expense.js            # Expense schema
│   └── Session.js            # Session management
├── services/             # External services
│   ├── aiService.js          # Ollama integration
│   ├── emailService.js       # Notifications
│   └── analyticsService.js   # Usage analytics
└── utils/                # Utilities
    ├── jwt.js               # Token management
    ├── encryption.js        # Security utilities
    └── logger.js            # Logging utilities
```

**API Design Principles**:
- **RESTful Design**: Standard HTTP methods and status codes
- **Versioning**: `/api/v1/` for future compatibility
- **Consistent Response Format**: Standardized JSON responses
- **Error Handling**: Centralized error management

### 3. Data Layer (Database)
**Technology**: MongoDB + Mongoose ODM

**Database Schema Design**:

#### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  profile: {
    avatar: String,
    currency: String (default: "USD"),
    timezone: String,
    notifications: Boolean
  },
  preferences: {
    budgetAlerts: Boolean,
    weeklyReports: Boolean,
    aiInsights: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Expense Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  description: String,
  amount: Number,
  currency: String,
  category: String,
  subcategory: String,
  tags: [String],
  location: {
    name: String,
    coordinates: [Number] // [longitude, latitude]
  },
  paymentMethod: String,
  recurring: {
    isRecurring: Boolean,
    frequency: String, // daily, weekly, monthly, yearly
    endDate: Date
  },
  attachments: [String], // URLs to receipts/images
  metadata: {
    source: String, // manual, import, api
    confidence: Number // AI categorization confidence
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### AI Insights Collection (Cache)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  type: String, // insights, budget, analysis
  input: Object, // Request data
  output: Object, // AI response
  validUntil: Date,
  createdAt: Date
}
```

### 4. AI Service Layer
**Technology**: Ollama + Gemma3:1b Model

**AI Architecture**:
```
AI Service Integration
├── Prompt Engineering
│   ├── Insights Prompts
│   ├── Budget Prompts
│   └── Analysis Prompts
├── Response Processing
│   ├── Text Parsing
│   ├── Structured Data Extraction
│   └── Confidence Scoring
├── Caching Layer
│   ├── Redis (optional)
│   └── MongoDB Cache
└── Fallback Mechanisms
    ├── Default Responses
    └── Error Handling
```

## 🔄 Data Flow Architecture

### 1. Authentication Flow
```
Client → Frontend → Backend API → Database
   │         │           │           │
   │         │           │           ▼
   │         │           │      Verify User
   │         │           │           │
   │         │           ▼           ▼
   │         │      Generate JWT    Return User
   │         │           │           │
   │         ▼           ▼           ▼
   │    Store Token   Return Token   │
   │         │           │           │
   ▼         ▼           ▼           ▼
Set Cookie → Redirect → Dashboard → Ready
```

### 2. Expense Management Flow
```
User Input → Frontend Validation → API Request → Auth Check → Database Save → AI Analysis → Response
     │               │                │           │           │             │           │
     ▼               ▼                ▼           ▼           ▼             ▼           ▼
  Form Data    Client-side       HTTP POST   JWT Verify   Mongoose    Async AI    JSON Response
  Validation   Validation        /api/v1/    Middleware   Save       Processing   to Frontend
                                    expense
```

### 3. AI Insights Flow
```
Expense Data → Aggregation → AI Prompt → Ollama API → Response Processing → Cache → Frontend
      │            │           │           │              │            │         │
      ▼            ▼           ▼           ▼              ▼            ▼         ▼
  User Data    Calculate    Personalized  HTTP POST     Parse AI    Store     Display
  from DB      Statistics   Prompt       to Ollama      Response    in Cache   Insights
```

## 🔒 Security Architecture

### 1. Authentication & Authorization
```
JWT Token Structure
├── Header: Algorithm & Token Type
├── Payload: User ID + Claims
└── Signature: HMAC-SHA256

Security Layers:
├── Frontend: HttpOnly Cookies + CSRF Protection
├── Backend: JWT Middleware + Role-Based Access
├── Database: Encrypted Sensitive Fields
└── Network: HTTPS + CORS Configuration
```

### 2. Data Protection
- **Password Security**: bcryptjs with salt rounds (10)
- **PII Protection**: Encrypted sensitive data fields
- **API Security**: Rate limiting, input validation, SQL injection prevention
- **Session Management**: Secure cookie configuration

## 🚀 Scalability Architecture

### 1. Horizontal Scaling
```
Load Balancer (Nginx)
        │
    ┌───┴───┐
    │       │
┌───▼───┐ ┌──▼───┐
│ App   │ │ App   │
│ Server│ │ Server│
└───┬───┘ └──┬───┘
    │       │
    └───┬───┘
        │
  ┌─────▼─────┐
  │ MongoDB   │
  │ Cluster   │
  └───────────┘
```

### 2. Caching Strategy
```
Multi-Level Caching
├── L1: Browser Cache (Static Assets)
├── L2: CDN Cache (API Responses)
├── L3: Redis Cache (Session Data)
└── L4: Application Cache (AI Responses)
```

### 3. Database Optimization
- **Indexing**: Optimized queries for user expenses
- **Sharding**: User-based data partitioning
- **Replication**: Read replicas for analytics

## 🔧 Technology Decisions

### Frontend Technology Stack
| Technology | Reason | Benefits |
|------------|--------|----------|
| React 18 | Component-based architecture | Reusability, ecosystem |
| Vite | Fast development server | Hot reload, optimized builds |
| Tailwind CSS | Utility-first CSS | Rapid UI development |
| Axios | HTTP client | Interceptors, error handling |

### Backend Technology Stack
| Technology | Reason | Benefits |
|------------|--------|----------|
| Node.js | JavaScript runtime | Single language stack |
| Express.js | Web framework | Middleware ecosystem |
| MongoDB | NoSQL database | Flexible schema, scalability |
| JWT | Authentication | Stateless, secure |

### AI Technology Stack
| Technology | Reason | Benefits |
|------------|--------|----------|
| Ollama | Local AI hosting | Privacy, cost-effective |
| Gemma3:1b | Lightweight model | Fast inference, low resource |

## 📊 Performance Architecture

### 1. Frontend Performance
```
Optimization Strategies
├── Code Splitting: Lazy loading components
├── Tree Shaking: Remove unused code
├── Image Optimization: WebP format, lazy loading
├── Bundle Analysis: webpack-bundle-analyzer
└── Caching: Service Worker + HTTP Cache
```

### 2. Backend Performance
```
Optimization Strategies
├── Database: Connection pooling, indexing
├── API: Response compression, pagination
├── AI: Response caching, async processing
└── Monitoring: APM integration, logging
```

## 🔍 Monitoring & Observability

### 1. Application Monitoring
```
Monitoring Stack
├── Metrics: Prometheus + Grafana
├── Logging: Winston + ELK Stack
├── Tracing: OpenTelemetry
└── Error Tracking: Sentry
```

### 2. Business Metrics
- User engagement and retention
- AI feature usage statistics
- Expense tracking patterns
- System performance indicators

## 🚀 Deployment Architecture

### 1. Development Environment
```
Local Development
├── Frontend: Vite Dev Server (Port 5173)
├── Backend: Nodemon (Port 8000)
├── Database: MongoDB Local (Port 27017)
└── AI: Ollama Local (Port 11434)
```

### 2. Production Environment
```
Cloud Deployment
├── Frontend: Vercel/Netlify (Static Hosting)
├── Backend: Heroku/Railway (Container)
├── Database: MongoDB Atlas (Managed)
└── AI: Ollama Cloud/Self-hosted
```

## 🔄 CI/CD Pipeline

```
Git Workflow
├── Development: Feature branches
├── Testing: Unit + Integration tests
├── Build: Automated builds
├── Deployment: Staging → Production
└── Monitoring: Health checks + alerts
```

## 📈 Future Architecture Enhancements

### 1. Microservices Migration
```
Current Monolith → Microservices
├── Auth Service: User management
├── Expense Service: CRUD operations
├── AI Service: ML model serving
├── Notification Service: Alerts/emails
└── Analytics Service: Data processing
```

### 2. Advanced AI Integration
```
AI Architecture Evolution
├── Model Fine-tuning: Custom training
├── Multi-model Support: Specialized models
├── Real-time Processing: Streaming data
└── Edge Computing: Client-side AI
```

### 3. Data Pipeline Enhancement
```
Big Data Architecture
├── Event Streaming: Apache Kafka
├── Data Lake: S3/MinIO
├── Processing: Spark/Flink
└── Analytics: Real-time dashboards
```

---

This architecture provides a solid foundation for a scalable, maintainable, and feature-rich AI-powered expense tracking application. The design emphasizes security, performance, and user experience while allowing for future growth and enhancement.
