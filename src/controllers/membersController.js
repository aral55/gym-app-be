
  const members = [
    { id: 1, name: "Chris Wilson", membership: "Gold" },
    { id: 2, name: "Emily Marchant", membership: "Silver" },
    { id: 3, name: "Kyle Baker", membership: "Platinum" },
  ];
  exports.getMembers = (req, res) => {
    res.status(200).json(members);
  }
  

//Get individual member by ID
exports.getMemberById = (req, res) => {
  const id = parseInt(req.params.id);
  const member = members.find((m) => m.id === id);

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }
  res.status(200).json(member);
};
