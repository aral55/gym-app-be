const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "root123",
  database: "gym_app",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

const createTables = () => {
  const workoutSql = `
    CREATE TABLE IF NOT EXISTS workouts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const exercisesSql = `
    CREATE TABLE IF NOT EXISTS exercises (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workout_id INT NOT NULL,
      name VARCHAR(255),
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );
  `;

  const setsSql = `
    CREATE TABLE IF NOT EXISTS sets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      exercise_id INT NOT NULL,
      weight DECIMAL(6,2) DEFAULT 0,
      reps INT DEFAULT 0,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
  `;

  const workoutLogsSql = `
    CREATE TABLE IF NOT EXISTS workout_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      workout_id INT NOT NULL,
      sets_done INT DEFAULT 0,
      reps_done INT DEFAULT 0,
      weight_done DECIMAL(6,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );
  `;

  [workoutSql, exercisesSql, setsSql, workoutLogsSql].forEach(sql => {
    db.query(sql, (err) => {
      if (err) console.error("Error creating table:", err);
    });
  });
};

db.createTables = createTables;
module.exports = db;
