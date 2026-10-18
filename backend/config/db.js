// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a unified pool configuration pointing to your online Supabase instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for secure cloud database handshakes
  }
});

// A robust query wrapper that lets your team run raw SQL and debug durations in the console
module.exports = {
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('--- Database Query Log ---');
      console.log(`Query: ${text}`);
      console.log(`Execution Time: ${duration}ms`);
      console.log(`Rows Affected: ${res.rowCount}`);
      console.log('--------------------------');
      return res;
    } catch (err) {
      console.error('⚠️ DATABASE EXCEPTION ERROR:', err.message);
      throw err;
    }
  },
  pool
};
