const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load env first
dotenv.config();

const dbconnection = require('./database/dbconnection');
const userRoutes = require('./routes/userroute');
const expenceRoutes = require('./routes/expenceroute');
const aiRoutes = require('./routes/airoute');

const port = 8000;

// CORS first - handles preflight automatically
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/expence', expenceRoutes);
app.use('/api/v1/ai', aiRoutes);

// Error handler LAST (after all routes)
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
    dbconnection();
    console.log(`Server running at http://localhost:${port}`);
});
