require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorage: 'json',
    migrations: ['dist/migrations/*.js'],  // Path to compiled migrations folder
    models: ['dist/models']  // Path to compiled models folder
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorage: 'json',
    migrations: ['dist/migrations/*.js'], // Path to compiled migrations folder
    models: ['dist/models']  // Path to compiled models folder
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorage: 'json',
    migrations: ['dist/migrations/*.js'], // Path to compiled migrations folder
    models: ['dist/models']  // Path to compiled models folder
  }
};
