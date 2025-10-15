const express = require("express");
const router = express.Router();
const {getMembers, getMemberById} = require("../controllers/membersController");

//Get all Members
router.get("/", getMembers);

//Get Member by Id
router.get("/:id", getMemberById);
module.exports = router;