require('dotenv').config();

const {
  NODE_ENV,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_SCHEMA
} = process.env

module.exports = {
  [NODE_ENV]: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_SCHEMA,
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT
  }
}
