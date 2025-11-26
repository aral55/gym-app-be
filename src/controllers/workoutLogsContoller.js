const db = require("../db");

//Create a new workout log
exports.createWorkoutLogs = (req, res) => {
  const { user_id, workout_id, sets_done, reps_done, weigth_done, date } =
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
      weigth_done,
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
    sql += "WHERE user_id =?";
    params.push(userId);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

//Update a workout log
exports.updateWorkoutLog = (req, res) => {
  const id = req.params;
  const { sets_done, reps_done, weigth_done, date } = req.body;

  const sql = `UPDATE workout_logs SETS sets_done = ?, reps_done = ?, weight_done = ?, date = ? WHERE id = ?`;

  db.query(sql, [sets_done, reps_done, weigth_done, date], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Workout log not found" });
    res.json({ message: "Workout log updated" });
  });
};

//Delete a workout log
exports.deleteWorkoutLog = (req, res) => {
  const id = req.params;
  const sql = "DELETE FROM workout_logs WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Workout log not found" });
    res.json({ message: "Workout log deleted" });
  });
};
