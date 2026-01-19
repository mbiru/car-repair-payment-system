/**
 * Helper script to create a user account
 * Usage: node create_user.js <username> <password>
 * Example: node create_user.js admin Admin@123
 */

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUser() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error('Usage: node create_user.js <username> <password>');
    console.error('Example: node create_user.js admin Admin@123');
    process.exit(1);
  }

  // Password validation
  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long');
    process.exit(1);
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    console.error('Error: Password must contain uppercase, lowercase, and numbers');
    process.exit(1);
  }

  try {
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'CRPMS'
    });

    // Check if user exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM User WHERE Username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      console.error(`Error: User '${username}' already exists`);
      await connection.end();
      process.exit(1);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await connection.execute(
      'INSERT INTO User (Username, Password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    console.log(`✅ User '${username}' created successfully!`);
    console.log(`   UserID: ${result.insertId}`);
    console.log(`   You can now login with these credentials.`);

    await connection.end();
  } catch (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
}

createUser();
