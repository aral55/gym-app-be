const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "gymapp",
  password: "gym123",
  database: "gym_app",
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");

  //members table
  const createMembersTable = `
    CREATE TABLE IF NOT EXISTS members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      membership VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createMembersTable, (err) => {
    if (err) console.log("Error creating members table:", err);
    else console.log("Members table ready");
  });

  //workouts table
  const createWorkoutsTable = `
    CREATE TABLE IF NOT EXISTS workouts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255),
      sets VARCHAR(10),
      reps VARCHAR(10),
      weight VARCHAR(20),
      day VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createWorkoutsTable, (err) => {
    if (err) console.log("Error creating workouts table:", err);
    else console.log("Workouts table ready");
  });

  //Workout log table
  const createWorkoutLogsTable = `
CREATE TABLE IF NOT EXISTS workout_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  workout_id INT NOT NULL,
  sets_done VARCHAR(10),
  reps_done VARCHAR(10),
  weight_done VARCHAR(20),
  date DATE DEFAULT (CURRENT_DATE()),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES members(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id)
);
`;
  db.query(createWorkoutLogsTable, (err) => {
    if (err) console.log("Error creating workout_logs table:", err);
    else console.log("Workout logs table ready");
  });

  // Seed sample members
  const members = [
    {
      name: "Feridun Canselen",
      email: "feriduncanselen@mail.com",
      phone: "073214568",
      membership: "Gold",
    },
    {
      name: "Asrin Ilkerli",
      email: "asrin@mail.com",
      phone: "05338418930",
      membership: "Gold",
    },
    {
      name: "Emily Marchant",
      email: "em.marchant@mail.com",
      phone: "07934597393",
      membership: "Silver",
    },
    {
      name: "Kyle Baker",
      email: "kb@mail.com",
      phone: "073354671857",
      membership: "Bronze",
    },
  ];

  members.forEach((m) => {
    db.query(
      "INSERT INTO members (name, email, phone, membership) VALUES (?, ?, ?, ?)",
      [m.name, m.email, m.phone, m.membership],
      (err) => {
        if (err) console.log(err);
      }
    );
  });

  // Seed sample workouts
  const workouts = [
    {
      name: "Bench Press",
      description: "Chest strength",
      sets: "3",
      reps: "6-8",
      weight: "35kg",
      day: "Monday",
    },
    {
      name: "Tricep Rope Pushdown",
      description: "Tricep strength",
      sets: "4",
      reps: "8-10",
      weight: "22kg",
      day: "Monday",
    },
    {
      name: "Lat cable pull down",
      description: "Lateral Strength",
      sets: "3",
      reps: "5-8",
      weight: "65kg",
      day: "Wednesday",
    },
    {
      name: "Z Bar Curl",
      description: "Bicep strength",
      sets: "3",
      reps: "8-10",
      weight: "30kg",
      day: "Wednesday",
    },
    {
      name: "Squats",
      description: "Leg strength",
      sets: "3",
      reps: "6-8",
      weight: "50kg",
      day: "Friday",
    },
    {
      name: "Shoulder Press",
      description: "Shoulder strength",
      sets: "4",
      reps: "6-8",
      weight: "25kg",
      day: "Monday",
    },
  ];

  workouts.forEach((w) => {
    db.query(
      "INSERT INTO workouts (name, description, sets, reps, weight, day) VALUES (?, ?, ?, ?, ?, ?)",
      [w.name, w.description, w.sets, w.reps, w.weight, w.day],
      (err) => {
        if (err) console.log(err);
      }
    );
  });

  console.log("Seeded members and workouts successfully!");
});

module.exports = db;
