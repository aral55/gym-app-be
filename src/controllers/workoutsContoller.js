const db = require("../db");

//Get All Workouts
exports.getAllWorkouts = (req, res) => {
  db.query("SELECT * FROM workouts", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

//Get individual workout by id
exports.getWorkoutById = (req, res) => {
  db.query("SELECT * FROM workouts WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Workout not Found!" });
    res.status(200).json(results[0]);
  });
};
