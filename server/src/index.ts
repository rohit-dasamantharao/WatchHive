import app from './app.js';
import { config } from './config.js';
import prisma from './utils/prisma.js';

const PORT = config.port;

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    try {
        // Disconnect from database
        await prisma.$disconnect();
        console.log('Database connection closed');

        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 WatchHive API Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`💾 Database: Connected`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   GET  /health`);
    console.log(`   POST /api/v1/auth/register`);
    console.log(`   POST /api/v1/auth/login`);
    console.log(`   POST /api/v1/auth/refresh`);
    console.log(`   POST /api/v1/auth/logout`);
    console.log(`\n✨ Ready to accept requests!\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('Unhandled Rejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('Uncaught Exception');
});
