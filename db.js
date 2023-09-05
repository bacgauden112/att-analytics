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

const dbConfig2 = {
  user: "root",
  host: "localhost",
  database: "softel_subscription",
  password: "root",
  port: 5455,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};
const db2 = pgp(dbConfig2);

module.exports = {
  pgp,
  db,
  db2,
};
