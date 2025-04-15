import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, logMiddleware } from './utils/logger';

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

export default app;
