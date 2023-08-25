const pgp = require("pg-promise")();

// Configure the database connection
const dbConfig = {
  user: "root",
  host: "localhost",
  database: "att_analytics",
  password: "root",
  port: 5455,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};
const db = pgp(dbConfig);

module.exports = {
  pgp,
  db,
};
