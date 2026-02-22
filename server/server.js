const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const dbErrorHandler = require('./middleware/dbErrorHandler');
const dbConnectionCheck = require('./middleware/dbConnectionCheck');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const normalizeOrigin = (origin) => {
    if (!origin) return null;
    try {
        const url = new URL(origin);
        url.pathname = '';
        url.hash = '';
        url.search = '';
        return url.toString().replace(/\/$/, '');
    } catch (error) {
        return origin.replace(/\/$/, '');
    }
};

const baseAllowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
]
    .filter(Boolean)
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true;

    const normalizedOrigin = normalizeOrigin(origin)?.toLowerCase();

    if (
        normalizedOrigin &&
        baseAllowedOrigins.some((allowed) => allowed?.toLowerCase() === normalizedOrigin)
    ) {
        return true;
    }

    if (normalizedOrigin && normalizedOrigin.endsWith('.vercel.app')) {
        return true;
    }

    if (normalizedOrigin && normalizedOrigin.replace('www.', '') === 'https://mmspace.me') {
        return true;
    }

    return false;
};

// Socket.io setup
const corsOriginDelegate = (origin, callback) => {
    if (isOriginAllowed(origin)) {
        return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
};

const io = socketIo(server, {
    cors: {
        origin: corsOriginDelegate,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

// Very lenient rate limiting for development
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // Very high limit for development
    message: { message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests
    skip: (req) => {
        // Skip rate limiting for health checks and in development
        return req.path === '/api/health' || process.env.NODE_ENV === 'development';
    }
});

// Middleware
app.use(limiter);
app.use(cors({
    origin: corsOriginDelegate,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.options('*', cors({
    origin: corsOriginDelegate,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Check database connection before processing requests
app.use(dbConnectionCheck);

// Make io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/mentees', require('./routes/menteeRoutes'));
app.use('/api/guardians', require('./routes/guardianRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/csv', require('./routes/csvUploadRoutes'));
app.use('/api/placement', require('./routes/placementRoutes'));

// Health check
app.get('/api/health', async (req, res) => {
    try {
        // Check database connection
        const mongoose = require('mongoose');
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

        res.json({
            status: 'OK',
            message: 'Server is running',
            database: dbStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Health check failed',
            error: error.message
        });
    }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Socket.io connection handling
require('./socket/socketHandlers')(io);

// Error handling middleware (order matters)
app.use(dbErrorHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server only after database connection
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();

        // Start server after successful database connection
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Database connection status: ${require('mongoose').connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();