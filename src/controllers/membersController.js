const db = require("../db");
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
  db.query("SELECT * FROM members", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

//Get individual member by ID
exports.getMemberById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM members WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Member not found!" });
    res.status(200).json(results[0]);
  });
};

//Create a new member
exports.createMember = (req, res) => {
  const { name, membership, email, phone, weight_unit } = req.body;

  if (!name || !membership) {
    return res.status(400).json({ message: "Name and Membership required" });
  }

  const sql = "INSERT INTO members (name, membership, email, phone, weight_unit) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, membership, email || `${name.toLowerCase().replace(/ /g, ".")}@example.com`, phone || "+44xxxxxxxxxx", weight_unit || 'kg'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name, membership, email, phone, weight_unit: weight_unit || 'kg' });
  });
};

//Delete a Member
exports.deleteMember = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM members WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Member not found" });
    res.status(200).json({ message: "Member deleted successfully" });
  });
};

//Update a Member
exports.updateMember = (req, res) => {
  const { id } = req.params;
  const { name, membership, email, phone, weight_unit } = req.body;

  const sql = "UPDATE members SET name=?, membership=?, email=?, phone=?, weight_unit=? WHERE id=?";
  db.query(sql, [name, membership, email, phone, weight_unit || 'kg', id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Member not found" });
    res.status(200).json({ id, name, membership, email, phone, weight_unit: weight_unit || 'kg' });
  });
};
