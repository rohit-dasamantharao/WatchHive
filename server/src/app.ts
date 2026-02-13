import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import entriesRoutes from './routes/entries.js';
import tmdbRoutes from './routes/tmdb.routes.js';
import followsRoutes from './routes/follows.routes.js';
import likesRoutes from './routes/likes.routes.js';
import userRoutes from './routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware — allow images from same origin
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(
    cors({
        origin: config.cors.origin,
        credentials: true,
    })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', environment: config.nodeEnv });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/entries', entriesRoutes);
app.use('/api/v1/tmdb', tmdbRoutes);
app.use('/api/v1/follows', followsRoutes);
app.use('/api/v1/likes', likesRoutes);
app.use('/api/v1/users', userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
