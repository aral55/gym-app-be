const db = require("../db");

//Create a new workout log
exports.createWorkoutLogs = (req, res) => {
  const { user_id, workout_id, sets_done, reps_done, weight_done, date } =
    req.body;
  const sql = `
    INSERT INTO workout_logs (user_id, workout_id, sets_done, reps_done, weight_done, date)
    VALUES (?,?,?,?,?, ?)
    `;
  db.query(
    sql,
    [
      user_id,
      workout_id,
      sets_done,
      reps_done,
      weight_done,
      date || new Date(),
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "Workout log created", id: results.insertId });
    }
  );
};

//Read All workout logs (optionall by users)
exports.getWorkoutLogs = (req, res) => {
  const userId = req.params.userId;
  let sql = "SELECT * FROM workout_logs";
  const params = [];

  if (userId) {
    sql += " WHERE user_id = ?";
    params.push(userId);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

//Update a workout log
exports.updateWorkoutLog = (req, res) => {
  const { id } = req.params;
  const { sets_done, reps_done, weight_done, date } = req.body;

  const sql = `UPDATE workout_logs SET sets_done = ?, reps_done = ?, weight_done = ?, date = ? WHERE id = ?`;

  db.query(
    sql,
    [sets_done, reps_done, weight_done, date, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Workout log not found" });
      res.json({ message: "Workout log updated" });
    }
  );
};

//Delete a workout log
exports.deleteWorkoutLog = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM workout_logs WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Workout log not found" });
    res.json({ message: "Workout log deleted" });
  });
};

//Get workout history for a user, grouped by date and workout
exports.getWorkoutHistory = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId param" });
  }

  const sql = `
  SELECT DATE(wl.date) AS date,
  wl.workout_id,
  w.name AS workout_name,
  wl.sets_done,
  wl.reps_done,
  wl.weight_done
  FROM workout_logs wl
  LEFT JOIN workouts w ON wl.workout_id = w.id
  WHERE wl.user_id = ?
  ORDER BY wl.date DESC, wl.workout_id, wl.id;
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    //Group rows by date, workout_id, entries
    const grouped = [];
    const byDate = {}; //temporary map

    rows.forEach((r) => {
      const dateKey = r.date ? r.date.toISOString().slice(0, 10) : null;
      if (!byDate[dateKey]) {
        byDate[dateKey] = { date: dateKey, workouts: {} };
      }

      const dateGroup = byDate[dateKey];

      const wId = r.workout_id || 0;
      if (!dateGroup.workouts[wId]) {
        dateGroup.workouts[wId] = {
          workout_id: wId,
          name: r.workout_name || "Unknown",
          entries: [],
        };
      }

      dateGroup.workouts[wId].entries.push({
        sets_done: r.sets_done,
        reps_done: r.reps_done,
        weight_done: r.weight_done,
      });
    });

    //convert map to array with workouts as array
    Object.values(byDate).forEach((d) => {
      const workoutsArray = Object.values(d.workouts);
      grouped.push({
        date: d.date,
        workouts: workoutsArray,
      });
    });

    //ensure descending by date:
    grouped.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    res.json(grouped);
  });
};

//Get PB for a user
exports.getPBs = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId params" });
  }

  const sql = `
  SELECT 
  wl.workout_id,
  w.name AS workout_name,
  MAX (wl.weight_done) AS heaviest,
  MAX (wl.reps_done) AS best_reps,
  MAX (wl.sets_done * wl.reps_done * wl.weight_done) AS best_volume,
  m.weight_unit
  FROM workout_logs wl
  LEFT JOIN workouts w ON wl.workout_id = w.id
  WHERE wl.user_id = ?
  GROUP BY wl.workout_id, m.weight_unit 
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(404).json({ error: err.message });

    //Converter from kg to lbs if needed
    const convertWeight = (value, unit) => {
      if (!value) return value;
      if (unit === "lbs") return Math.round(value * 2.20462);
    };

    const pbData = results.map((r) => {
      const unit = r.weight_unit || "kg";

      return {
        workout: r.workout_name,
        heaviest: r.heaviest,
        bestReps: r.best_reps,
        bestVolume: convertWeight(r.best_volume, unit),
        unit,
      };
    });

    res.json(pbData);
  });
};
