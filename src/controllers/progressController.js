const db = require("../db");

const getProgress = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT wl.id, wl.user_id, wl.workout_id, wl.sets_done, wl.reps_done, wl.weight_done, wl.date, w.name AS workout_name
    FROM workout_logs wl
    JOIN workouts w ON wl.workout_id = w.id
    WHERE wl.user_id = ?
    ORDER BY wl.date DESC
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching progress:", err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
    res.status(200).json(results);
  });
};

const logProgress = (req, res) => {
  const { user_id, workout_id, sets_done, reps_done, weight_done, date } =
    req.body;

  if (!user_id || !workout_id || !sets_done || !reps_done || !weight_done) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const insertQuery = `
    INSERT INTO workout_logs (user_id, workout_id, sets_done, reps_done, weight_done, date)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    insertQuery,
    [
      user_id,
      workout_id,
      sets_done,
      reps_done,
      weight_done,
      date || new Date(),
    ],
    (err, results) => {
      if (err) {
        console.error("Error adding workout log:", err);
        return res
          .status(500)
          .json({ message: "Server error", error: err.message });
      }

      res.status(201).json({
        message: "Workout log created successfully",
        new_log_id: results.insertId,
      });
    }
  );
};

module.exports = { getProgress, logProgress };
