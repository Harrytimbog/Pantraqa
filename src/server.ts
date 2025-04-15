import sequelize from './config/database';
import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    logger.info('✅ Database synced');
    app.listen(PORT, () => {
        logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
});
