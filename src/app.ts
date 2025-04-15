import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, logMiddleware } from './utils/logger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import drinkRoutes from './routes/drink.routes';
import storageRoutes from './routes/storageLocation.routes';
import stockRoutes from './routes/stock.routes';

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
app.use('/api/v1/drinks', drinkRoutes);
app.use('/api/v1/locations', storageRoutes);
app.use('/api/v1/stocks', stockRoutes);

// Test route for authentication
import testRoutes from './routes/auth.routes';

app.use('/api/v1/test', testRoutes);


export default app;
