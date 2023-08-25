const { Client } = require("pg");

// Configure the database connection
const dbConfig = {
  user: "root",
  host: "localhost",
  database: "att_analytics",
  password: "root",
  port: 5455,
};

// Create a new PostgreSQL client
const client = new Client(dbConfig);

async function createTable() {
  try {
    // Connect to the database
    await client.connect();

    // SQL query to create a new table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS att_status_snapshots_06_23 (
        id bigserial PRIMARY KEY NOT NULL,
        mdn varchar(255) DEFAULT NULL,
        master_mdn varchar(255) DEFAULT NULL,
        service_class varchar(255) DEFAULT NULL,
        rate_plan varchar(255) DEFAULT NULL,
        status varchar(255) DEFAULT NULL,
        activation_date varchar(255) DEFAULT NULL,
        expiration_date varchar(255) DEFAULT NULL,
        cancel_date varchar(255) DEFAULT NULL,
        market varchar(255) DEFAULT NULL,
        sub_market varchar(255) DEFAULT NULL,
        last_airdate varchar(255) DEFAULT NULL,
        balance varchar(255) DEFAULT NULL,
        rate_plan_code varchar(255) DEFAULT NULL,
        batch_date varchar(255) DEFAULT NULL,
        filename varchar(255) NOT NULL,
        date_imported varchar(255) NOT NULL
      );
    `;

    // Execute the create table query
    await client.query(createTableQuery);

    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    // Disconnect from the database
    await client.end();
  }
}

// Call the createTable function to create the table
createTable();
