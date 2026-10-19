
require('dotenv').config();

const { pool } = require('./config/db');

async function testConnection() {
  try {
    console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

    const result = await pool.query('SELECT NOW()');

    console.log('✅ Supabase connected successfully!');
    console.log('Database time:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
