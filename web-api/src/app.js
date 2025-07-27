const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('./config/config');
const logger = require('./utils/logger');
const {syncDatabase} = require('./models');
const routes = require('./routes');
const {errorHandler, notFoundHandler} = require('./middleware/errorHandler');
const ReminderService = require('./services/reminder.service');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
});

// API routes
app.use('/api', routes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Xpensify API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            expenses: '/api/expenses',
            incomes: '/api/incomes',
            debts: '/api/debts',
            investments: '/api/investments',
            subscriptions: '/api/subscriptions',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
    try {
        // Sync database
        await syncDatabase();

        // Initialize reminder service
        ReminderService.init();

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port} in ${config.env} mode`);
            console.log(`
🚀 Xpensify API Server Started Successfully!

📊 Server Information:
   • Port: ${config.port}
   • Environment: ${config.env}
   • Database: PostgreSQL
   
🔗 API Endpoints:
   • Base URL: http://localhost:${config.port}
   • Health Check: http://localhost:${config.port}/api/health
   • Authentication: http://localhost:${config.port}/api/auth
   • Expenses: http://localhost:${config.port}/api/expenses
   • Incomes: http://localhost:${config.port}/api/incomes
   • Debts: http://localhost:${config.port}/api/debts
   • Investments: http://localhost:${config.port}/api/investments
   • Subscriptions: http://localhost:${config.port}/api/subscriptions

📝 Next Steps:
   1. Set up your PostgreSQL database
   2. Copy .env.example to .env and configure your environment variables
   3. Start making API requests!

🛡️  Security Features:
   • JWT Authentication
   • Rate Limiting
   • CORS Protection  
   • Input Validation
   • SQL Injection Protection
      `);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                logger.info('Process terminated');
            });
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;