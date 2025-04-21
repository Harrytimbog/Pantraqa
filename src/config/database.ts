import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// For local development
const isProduction = process.env.NODE_ENV === 'production';
const sequelize = isProduction
    ? new Sequelize(process.env.DB_URL as string, {
        dialect: 'postgres',
        ssl: true,
    })
    : new Sequelize(
        process.env.DB_NAME as string,
        process.env.DB_USER as string,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            port: Number(process.env.DB_PORT),
            logging: false,
        }
    );

export default sequelize;
