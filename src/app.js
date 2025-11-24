const express = require("express");
const cors = require("cors");
const memberRoutes = require("./routes/members");
const workoutRoutes = require("./routes/workouts");

const app = express();

app.use(cors());
app.use(express.json());



//Members route
app.use("/members", memberRoutes);

//Workouts route
app.use("/workouts", workoutRoutes);

module.exports = app; 
