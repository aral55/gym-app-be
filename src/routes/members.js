const express = require("express");
const router = express.Router();
const membersController = require("../controllers/membersController");


router.get("/", membersController.getMembers);//get all members
router.get("/:id", membersController.getMemberById); //get member by id

//Creating a new Member
router.post("/", membersController.createMember)

//Updating a member
router.put("/:id", membersController.updateMember);

//Delet a member
router.delete("/:id", membersController.deleteMember);

module.exports = router;