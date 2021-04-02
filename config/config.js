require('dotenv').config();

const {
  NODE_ENV,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_SCHEMA
} = process.env
const fs = require('fs');

console.log({
  [NODE_ENV]: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_SCHEMA,
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT
  },
  env: fs.readFileSync('.env', { encoding: 'utf8' })
})

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
