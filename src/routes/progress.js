const express = require("express");
const router = express.Router();
const { getProgress, logProgress } = require("../controllers/progressController");

router.get("/:userId", getProgress); //get progress for a user
router.post("/", logProgress); //log a new workout  

module.exports = router;
