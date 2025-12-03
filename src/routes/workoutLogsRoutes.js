const express = require("express");
const router = express.Router();
const workoutLogsControler = require("../controllers/workoutLogsContoller");

router.post("/", workoutLogsControler.createWorkoutLogs); // create
router.get("/", workoutLogsControler.getWorkoutLogs); // get all
router.get("/history/:userId", workoutLogsControler.getWorkoutHistory); //get history for a user
router.get("/pb/:userId", workoutLogsControler.getPBs); //get pb for a user
router.get("/:userId", workoutLogsControler.getWorkoutLogs); // get by user
router.put("/:id", workoutLogsControler.updateWorkoutLog); //Update
router.delete("/:id", workoutLogsControler.deleteWorkoutLog); //Delete


module.exports = router;
