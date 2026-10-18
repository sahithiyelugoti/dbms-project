// controllers/groupController.js
const db = require('../config/db');

const groupController = {
  // 1. Create a brand-new Study Group (Tutor or Student creates it)
  createGroup: async (req, res) => {
    const { group_name, description, created_by_student_id } = req.body;

    if (!group_name || !created_by_student_id) {
      return res.status(400).json({ error: "Missing required group creation fields." });
    }

    try {
      // Begin an atomic transaction block to create the group and join the creator in one go
      await db.query('BEGIN;');

      // Insert the group row metadata
      const groupInsertQuery = `
        INSERT INTO study_group (group_name, description, created_by_student_id)
        VALUES ($1, $2, $3)
        RETURNING group_id, group_name, description, created_at;
      `;
      const groupResult = await db.query(groupInsertQuery, [group_name, description || null, created_by_student_id]);
      const newGroup = groupResult.rows[0];

      // Automatically add the creator as a 'moderator' in the membership junction table
      const membershipInsertQuery = `
        INSERT INTO group_membership (group_id, student_id, role)
        VALUES ($1, $2, 'moderator');
      `;
      await db.query(membershipInsertQuery, [newGroup.group_id, created_by_student_id]);

      // If both steps succeed safely, commit them permanently to disk
      await db.query('COMMIT;');

      return res.status(201).json({
        message: "Study group initialized and creator registered as moderator!",
        group: newGroup
      });

    } catch (err) {
      // If anything fails, abort the operations to preserve structural integrity
      await db.query('ROLLBACK;');
      return res.status(500).json({ error: "Failed to create study group safely.", details: err.message });
    }
  },

  // 2. Join an Existing Study Group (Validates limits & duplicates)
  joinGroup: async (req, res) => {
    const { group_id, student_id } = req.body;

    if (!group_id || !student_id) {
      return res.status(400).json({ error: "Missing group ID or student ID parameters." });
    }

    try {
      // Check for duplicate membership row signatures
      const duplicateCheck = await db.query(
        'SELECT membership_id FROM group_membership WHERE group_id = \$1 AND student_id = \$2;',
        [group_id, student_id]
      );

      if (duplicateCheck.rowCount > 0) {
        return res.status(409).json({ error: "Conflict Error: You are already a member of this study circle." });
      }

      // Execute membership insertion using secure parameterized binds
      const joinQuery = `
        INSERT INTO group_membership (group_id, student_id, role)
        VALUES ($1, $2, 'member')
        RETURNING membership_id, group_id, student_id, joined_at;
      `;
      const result = await db.query(joinQuery, [group_id, student_id]);

      return res.status(201).json({
        message: "Successfully joined the study circle!",
        membership: result.rows[0]
      });

    } catch (err) {
      return res.status(500).json({ error: "Database execution join exception.", details: err.message });
    }
  },

  // 3. Fetch all Groups a specific student has joined (Multi-Table Aggregated Join)
  getStudentGroups: async (req, res) => {
    const { studentId } = req.params;

    try {
      const fetchQuery = `
        SELECT 
          sg.group_id,
          sg.group_name,
          sg.description,
          gm.role,
          gm.joined_at,
          (SELECT COUNT(*) FROM group_membership WHERE group_id = sg.group_id) AS total_members
        FROM study_group sg
        JOIN group_membership gm ON sg.group_id = gm.group_id
        WHERE gm.student_id = $1
        ORDER BY gm.joined_at DESC;
      `;
      
      const result = await db.query(fetchQuery, [studentId]);
      return res.json({ count: result.rowCount, groups: result.rows });

    } catch (err) {
      return res.status(500).json({ error: "Failed to pull aggregated group lists.", details: err.message });
    }
  }
};

module.exports = groupController;
