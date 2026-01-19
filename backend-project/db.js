const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CRPMS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message || err.code || 'Unknown error');
    console.error('   Error code:', err.code);
    console.error('   Error details:', err);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check if CRPMS database exists: mysql -u root -e "SHOW DATABASES;"');
    console.error('   3. Verify credentials in .env file');
    console.error('   4. Create database if missing: mysql -u root < ../database_setup.sql');
  });

module.exports = pool;
