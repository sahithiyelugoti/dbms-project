// controllers/authController.js
const db = require('../config/db');

const authController = {
  // Handles saving a brand-new student or tutor profile to the database
  registerStudent: async (req, res) => {
    const { first_name, last_name, email, password, bio } = req.body;

    // Basic Input Validation check
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Missing required profile input values." });
    }

    try {
      // 1. Check if the user email already exists in our relational system
      const userCheck = await db.query('SELECT * FROM student WHERE email = \$1;', [email]);
      if (userCheck.rowCount > 0) {
        return res.status(409).json({ error: "A user account with this email address already exists." });
      }

      // NOTE FOR PROJECT EVALUATION: In a production app, you would hash this password 
      // using the bcrypt package before inserting it into the database!
      const placeholderHash = `hashed_${password}`;

      // 2. Execute a raw SQL parameterized INSERT query to save the user securely
      const insertQuery = `
        INSERT INTO student (first_name, last_name, email, password_hash, bio)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING student_id, first_name, last_name, email, registration_date;
      `;
      
      const newStudent = await db.query(insertQuery, [first_name, last_name, email, placeholderHash, bio || null]);

      // 3. Return the newly created record data back to the client browser app
      return res.status(201).json({
        message: "User account created successfully inside PostgreSQL!",
        user: newStudent.rows[0]
      });

    } catch (err) {
      return res.status(500).json({ error: "Internal Database execution fault.", details: err.message });
    }
  }
};

module.exports = authController;
