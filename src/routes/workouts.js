const express = require("express");
const router = express.Router();
const workoutsContoller = require("../controllers/workoutsContoller");

router.get("/", workoutsContoller.getAllWorkouts); //get all workouts
router.get("/:id", workoutsContoller.getWorkoutById); // get workout by id

module.exports = router;
