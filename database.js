const Sequelize = require('sequelize');

const database = new Sequelize(process.env.DB_SCHEMA,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DB_SSL == "true"
        },
        logging: process.env.NODE_ENV === 'development'
    });

module.exports = database;