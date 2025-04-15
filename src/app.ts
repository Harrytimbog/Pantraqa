import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, logMiddleware } from './utils/logger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
});

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(logMiddleware); // optional: middleware to log every request

app.get('/', (req, res) => {
    logger.info('Root route accessed');
    res.send('🚀 Pantry Tracker API with TypeScript is Running!');
});

// Import routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

import testRoutes from './routes/auth.routes';

app.use('/api/v1/test', testRoutes);


export default app;
