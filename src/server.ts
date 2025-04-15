import sequelize from './config/database';
import app from './app';
import { logger } from './utils/logger';

// Import models just to ensure they are registered with Sequelize
// This is important for associations and migrations
import './models/user.model';
import './models/drink.model';

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    logger.info('✅ Database synced');
    app.listen(PORT, () => {
        logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
});
