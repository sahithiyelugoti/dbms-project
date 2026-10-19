
const db = require('../config/db');
const bcrypt = require('bcrypt');

const authController = {
  // Register a new student
  registerStudent: async (req, res) => {
    const { first_name, last_name, email, password, bio } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required profile input values.'
      });
    }

    try {
      const userCheck = await db.query(
        'SELECT student_id FROM student WHERE email = $1',
        [email]
      );

      if (userCheck.rowCount > 0) {
        return res.status(409).json({
          error: 'An account with this email already exists.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO student
          (first_name, last_name, email, password_hash, bio)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          student_id,
          first_name,
          last_name,
          email,
          bio,
          registration_date;
      `;

      const result = await db.query(insertQuery, [
        first_name,
        last_name,
        email,
        passwordHash,
        bio || null
      ]);

      return res.status(201).json({
        message: 'Account created successfully!',
        user: result.rows[0]
      });
    } catch (err) {
      console.error('Registration error:', err.message);

      return res.status(500).json({
        error: 'Unable to create account.'
      });
    }
  },

  // Log in an existing student
  loginStudent: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    try {
      const result = await db.query(
        `SELECT
           student_id,
           first_name,
           last_name,
           email,
           password_hash,
           bio
         FROM student
         WHERE email = $1`,
        [email]
      );

      if (result.rowCount === 0) {
        return res.status(401).json({
          error: 'Invalid email or password.'
        });
      }

      const student = result.rows[0];

      const passwordMatches = await bcrypt.compare(
        password,
        student.password_hash
      );

      if (!passwordMatches) {
        return res.status(401).json({
          error: 'Invalid email or password.'
        });
      }

      const {
        password_hash,
        ...user
      } = student;

      return res.status(200).json({
        message: 'Login successful!',
        user
      });
    } catch (err) {
      console.error('Login error:', err.message);

      return res.status(500).json({
        error: 'Unable to log in.'
      });
    }
  }
};

module.exports = authController;
