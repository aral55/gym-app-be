const express = require("express");
const router = express.Router();
const workoutLogsControler = require("../controllers/workoutLogsContoller");

router.post("/", workoutLogsControler.createWorkoutLogs); // create
router.get("/", workoutLogsControler.getWorkoutLogs); // get all
router.get("/:userId", workoutLogsControler.getWorkoutLogs); // get by user
router.put("/:id", workoutLogsControler.updateWorkoutLog); //Update
router.delete("/:id", workoutLogsControler.deleteWorkoutLog); //Delete

module.exports = router;
