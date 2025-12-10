const express = require("express");
const router = express.Router();
const { getProgress, logProgress, copyLastWorkout, saveFromTemplate } = require("../controllers/progressController");

router.get("/copy-last/:userId", copyLastWorkout);
router.get("/:userId", getProgress);
router.post("/", logProgress);
router.post("/from-template", saveFromTemplate);

module.exports = router;
