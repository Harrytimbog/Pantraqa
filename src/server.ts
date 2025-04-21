import sequelize from './config/database';
import app from './app';
import { logger } from './utils/logger';

// Import models just to ensure they are registered with Sequelize
import './models/user.model';
import './models/drink.model';
import './models/storageLocation.model';
import './models/stock.model';
import './models/stockLog.model';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    // Sync database only for local development
    sequelize.sync({ alter: true }).then(() => {
        logger.info('✅ Database synced');
        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on http://localhost:${PORT}`);
        });
    });
} else {
    // In production, use migrations to handle database updates
    app.listen(PORT, () => {
        logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
}
