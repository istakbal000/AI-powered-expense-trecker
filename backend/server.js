const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
// Configure CORS origins. In production, set `ALLOWED_ORIGINS` env var as a comma-separated list.
const defaultLocalOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://ai-powered-expense-trecker.onrender.com', 'https://ai-powered-expense-trecker-1.onrender.com'])
    : defaultLocalOrigins;

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    
    if (process.env.NODE_ENV !== 'test') {
        console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
    }
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test route to verify routing works
app.get('/api/test', (req, res) => {
    res.json({ message: 'API routing works!', path: req.path });
});

// API Routes - Add logging to verify they're loaded
console.log('Loading routes...');
const userRoutes = require('./routes/userroute');
console.log('User routes loaded');
const expenseRoutes = require('./routes/expenceroute');
console.log('Expense routes loaded');
const aiRoutes = require('./routes/airoute');
console.log('AI routes loaded');

app.use('/api/v1/user', userRoutes);
console.log('User routes mounted at /api/v1/user');
app.use('/api/v1/expense', expenseRoutes);
console.log('Expense routes mounted at /api/v1/expense');
app.use('/api/v1/ai', aiRoutes);
console.log('AI routes mounted at /api/v1/ai');

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });

    // Don't send error stack in production
    const errorResponse = {
        error: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(err.status || 500).json(errorResponse);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start server
const startServer = async () => {
    try {
        const dbconnection = require('./database/dbconnection');
        await dbconnection();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
