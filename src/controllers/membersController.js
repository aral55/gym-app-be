const { v4: uuidv4 } = require("uuid");

const members = [
  {
    id: uuidv4(),
    name: "Chris Wilson",
    membership: "Gold",
    email: "chris-wilson@example.com",
    phone: "+441234567890",
  },
  {
    id: uuidv4(),
    name: "Emily Marchant",
    membership: "Silver",
    email: "emily.marchant@example.com",
    phone: "+447654321098",
  },
  {
    id: uuidv4(),
    name: "Kyle Baker",
    membership: "Platinum",
    email: "kyle.b@example.com",
    phone: "+447934597393",
  },
];

//Random phone generator
const randomPhone = () => {
  const prefix = "+44";
  const number = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${number}`;
};

//Random email generator
const randomEmail = (name) => {
  const formatted = name.toLowerCase().replace(/ /g, ".");
  return `${formatted}@example.com`;
};

//Get all Members
exports.getMembers = (req, res) => {
  res.status(200).json(members);
};

//Get individual member by ID
exports.getMemberById = (req, res) => {
  const id = req.params.id;
  const member = members.find((m) => m.id === id);

  if (!member) {
    return res.status(404).json({ message: "Member not found!" });
  }

  res.status(200).json(member);
};

//Create a new member
exports.createMember = (req, res) => {
  const { name, membership, email } = req.body;

  if (!name || !membership) {
    return res.status(400).json({ message: "Name and Membership required" });
  }

  const newMember = {
    id: uuidv4(),
    name,
    membership,
    email: email || randomEmail(name),
    phone: randomPhone(),
  };

  members.push(newMember);
  res.status(201).json(newMember);
};

//update a member
exports.updateMember = (req, res) => {
  const id = req.params.id;
  const { name, membership, email } = req.body;

  const member = members.find((m) => m.id === id);

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  if (name) member.name = name;
  if (membership) member.membership = membership;
  if (email) member.email = email;

  res.status(200).json(member);
};

//Delete a member
exports.deleteMember = (req, res) => {
  const id = req.params.id;
  const index = members.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Member not found" });
  }
  members.splice(index, 1);
  res.status(200).json({ message: "Member deleted successfully" });
};
