import express from 'express';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import apiKeyValidator from './middlewares/apiKeyValidator.js';
import projectIdeasRoutes from './routes/projectIdeasRoutes.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { helmet, cors, corsOptions } from './middlewares/security.js';

const app = express();

// Security headers
app.use(helmet());
// CORS protection
app.use(cors(corsOptions));

// Middleware setup
app.use(express.json());
app.use(logger);
app.use(generalLimiter); // General rate limiting for all endpoints
app.use(apiKeyValidator);

// Routes setup
app.use('/api/project-ideas', projectIdeasRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;