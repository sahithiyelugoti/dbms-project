// controllers/sessionController.js
const db = require('../config/db');

const sessionController = {
  // Handles creating a brand-new tutor session booking request
  bookSession: async (req, res) => {
    const { mentor_id, student_id, service_id, scheduled_time } = req.body;

    // 1. Basic Input Validation
    if (!mentor_id || !student_id || !service_id || !scheduled_time) {
      return res.status(400).json({ error: "Missing required booking attributes." });
    }

    // 2. Prevent Self-Booking Check (Backend layer validation)
    if (parseInt(mentor_id) === parseInt(student_id)) {
      return res.status(400).json({ error: "Invalid Action: You cannot schedule a tutoring session with yourself." });
    }

    try {
      // 3. Advanced Relational Business Logic: Conflict Prevention Query
      // Checks if the target tutor already has an active conflicting booking at that precise date/time slot
      const conflictCheckQuery = `
        SELECT session_id FROM session 
        WHERE mentor_id = $1 
          AND scheduled_time = $2 
          AND session_status IN ('pending', 'confirmed');
      `;
      const conflictResult = await db.query(conflictCheckQuery, [mentor_id, scheduled_time]);

      if (conflictResult.rowCount > 0) {
        return res.status(409).json({ 
          error: "Scheduling Conflict: This tutor is already reserved for this specific date and time slot." 
        });
      }

      // 4. Secure Transaction Insertion using Parameterized SQL Elements
      const insertSessionQuery = `
        INSERT INTO session (mentor_id, student_id, service_id, scheduled_time, session_status)
        VALUES ($1, $2, $3, $4, 'pending')
        RETURNING session_id, mentor_id, student_id, scheduled_time, session_status;
      `;
      const newSession = await db.query(insertSessionQuery, [mentor_id, student_id, service_id, scheduled_time]);

      return res.status(201).json({
        message: "Session booking request initialized successfully inside PostgreSQL!",
        booking: newSession.rows
      });

    } catch (err) {
      return res.status(500).json({ error: "Database transaction exception fault.", details: err.message });
    }
  },

  // Handles updating the session status (Tutor confirming or cancelling)
  updateStatus: async (req, res) => {
    const { id } = req.params; // Grabs the session_id from the URL parameters
    const { status, mentor_id } = req.body; // Status values must look like: 'confirmed', 'cancelled', 'completed'

    if (!status || !mentor_id) {
      return res.status(400).json({ error: "Missing required profile identification parameters." });
    }

    try {
      const updateQuery = `
        UPDATE session 
        SET session_status = $1 
        WHERE session_id = $2 AND mentor_id = $3
        RETURNING session_id, mentor_id, student_id, scheduled_time, session_status;
      `;
      const updatedRecord = await db.query(updateQuery, [status, id, mentor_id]);

      if (updatedRecord.rowCount === 0) {
        return res.status(404).json({ error: "Update target not found or unverified authorization permissions." });
      }

      return res.json({
        message: `Database state machine record shifted successfully to ${status}!`,
        updated_session: updatedRecord.rows
      });

    } catch (err) {
      return res.status(500).json({ error: "Database execution transition fault.", details: err.message });
    }
  }
};

module.exports = sessionController;