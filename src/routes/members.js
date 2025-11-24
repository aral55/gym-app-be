const express = require("express");
const router = express.Router();
const membersController = require("../controllers/membersController");


router.get("/", membersController.getMembers);//get all members
router.get("/:id", membersController.getMemberById); //get member by id
router.post("/", membersController.createMember) //create a new member
router.put("/:id", membersController.updateMember); //update a member
router.delete("/:id", membersController.deleteMember); //delete a member

module.exports = router;