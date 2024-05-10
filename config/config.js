// config/config.js

module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'test_db',
    host: 'localhost',
    dialect: 'mysql', // or any other supported dialect like 'postgres', 'sqlite', 'mssql', etc.
    // Optional additional options:
    port: 3306, // Specify the port if different from the default
    // logging: false, // Disable logging SQL queries to console
    // dialectOptions: {
    //   timezone: '+03:00', // Example: Adjust timezone
    //   // Other dialect options if needed
    // },
    migrationsPath: 'migrations',
  },
  production: {
    username: 'your_prod_username',
    password: 'your_prod_password',
    database: 'your_prod_database',
    host: 'your_prod_host',
    dialect: 'mysql', // or any other supported dialect like 'postgres', 'sqlite', 'mssql', etc.
    // Optional additional options:
    // port: 3306, // Specify the port if different from the default
    // logging: false, // Disable logging SQL queries to console
    // dialectOptions: {
    //   timezone: '+03:00', // Example: Adjust timezone
    //   // Other dialect options if needed
    // },
  },
};
