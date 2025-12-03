const db = require("./src/db");

// Extended example logs for multiple users
const workoutLogs = [
    // User 1
    {user_id: 1, workout_id: 1, sets_done:3, reps_done:8, weight_done:50, date: "2025-12-03"},
    {user_id: 1, workout_id: 2, sets_done:4, reps_done:10, weight_done:22, date: "2025-12-03"},
    {user_id: 1, workout_id: 3, sets_done:3, reps_done:6, weight_done:65, date: "2025-12-04"},
    // User 2
    {user_id: 2, workout_id: 1, sets_done:4, reps_done:8, weight_done:40, date: "2025-12-03"},
    {user_id: 2, workout_id: 2, sets_done:3, reps_done:10, weight_done:25, date: "2025-12-04"},
    {user_id: 2, workout_id: 3, sets_done:5, reps_done:5, weight_done:60, date: "2025-12-05"},
    // User 3
    {user_id: 3, workout_id: 1, sets_done:3, reps_done:10, weight_done:30, date: "2025-12-03"},
    {user_id: 3, workout_id: 2, sets_done:4, reps_done:8, weight_done:20, date: "2025-12-03"},
    {user_id: 3, workout_id: 4, sets_done:3, reps_done:10, weight_done:30, date:"2025-12-04"},
    // User 4
    {user_id: 4, workout_id: 1, sets_done:5, reps_done:5, weight_done:45, date: "2025-12-02"},
    {user_id: 4, workout_id: 2, sets_done:4, reps_done:6, weight_done:20, date: "2025-12-03"},
    {user_id: 4, workout_id: 3, sets_done:3, reps_done:8, weight_done:50, date: "2025-12-04"},
];

workoutLogs.forEach((log) => {
    db.query(
        "INSERT INTO workout_logs (user_id, workout_id, sets_done, reps_done, weight_done, date) VALUES (?, ?, ?, ?, ?, ?)",
        [log.user_id, log.workout_id, log.sets_done, log.reps_done, log.weight_done, log.date],
        (err)=> {
            if(err) console.error(err);
            else console.log("Workout log inserted:", log);
        }
    );
});

db.end();