const express = require("express");
const cors = require("cors");
const memberRoutes = require("./routes/members");

const app = express();

app.use(cors());
app.use(express.json());

//Test route
app.get("/", (req, res) => {
    console.log("Request received at /");
  res.json({ message: "Gym back-end is running!" });
});

//Members route
app.use("/members", memberRoutes);

module.exports = app; 
