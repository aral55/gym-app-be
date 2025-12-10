const db = require("../db");
const { connect } = require("../routes/progress");

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

const copyLastWorkout = (req, res) => {
  const { userId } = req.params;

  const query = `
  SELECT wl.workout_id, wl.sets_done, wl.reps_done, wl.weight_done, w.name AS workout_name
  FROM workout_logs wl
  JOIN workouts w ON wl.workout_id = w.id
  WHERE wl.user_id = ?
  ORDER BY wl.date DESC
  LIMIT 1
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error copying last workout:", err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }

    if (results.length === 0) {
      return res.json({
        template: {
          date: new Date().toISOString().slice(0, 10),
          exercises: [],
        },
      });
    }

    const last = results[0];

    const template = {
      date: new Date().toISOString().slice(0, 10),
      exercises: [
        {
          name: last.workout_name,
          sets: [
            {
              weight: last.weight_done,
              reps: last.reps_done,
            },
          ],
        },
      ],
    };

    return res.json({ template });
  });
};

const saveFromTemplate = (req, res) => {
  const { date, exercises } = req.body;

  if (!Array.isArray(exercises)) return res.status(400).json({ message: "exercises must be an array" });

  const workoutDate = date || new Date().toISOString().slice(0, 10);

  // Insert workout
  const insertWorkoutSql = `INSERT INTO workouts (date) VALUES (?)`;
  db.query(insertWorkoutSql, [workoutDate], (workoutErr, workoutResult) => {
    if (workoutErr) {
      console.error("Insert workout error:", workoutErr);
      return res.status(500).json({ message: "Failed to insert workout", error: workoutErr.message });
    }

    const workoutId = workoutResult.insertId;

    // Insert exercises and sets
    exercises.forEach((ex) => {
      const insertExSql = `INSERT INTO exercises (workout_id, name) VALUES (?, ?)`;
      db.query(insertExSql, [workoutId, ex.name], (exErr, exResult) => {
        if (exErr) {
          console.error("Insert exercise error:", exErr);
          return;
        }

        const exerciseId = exResult.insertId;

        (ex.sets || []).forEach((s) => {
          const insertSetSql = `INSERT INTO sets (exercise_id, weight, reps) VALUES (?, ?, ?)`;
          db.query(insertSetSql, [exerciseId, s.weight || 0, s.reps || 0], (setErr) => {
            if (setErr) console.error("Insert set error:", setErr);
          });
        });
      });
    });

    return res.status(201).json({ message: "Workout created successfully", workoutId });
  });
};

module.exports = {
  getProgress,
  logProgress,
  copyLastWorkout,
  saveFromTemplate,
};
