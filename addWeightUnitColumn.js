const db = require("./src/db");

// First, describe the members table to see existing columns
db.query("DESCRIBE members", (err, results) => {
  if (err) {
    console.error("Error describing members table:", err);
    db.end();
    return;
  }

  const columns = results.map(col => col.Field);
  console.log("Existing columns in members table:", columns);

  if (!columns.includes("weight_unit")) {
    console.log("weight_unit column missing. Adding now...");

    const addColumnQuery = `
      ALTER TABLE members
      ADD COLUMN weight_unit VARCHAR(5) DEFAULT 'kg'
    `;
    db.query(addColumnQuery, (err) => {
      if (err) {
        console.error("Error adding weight_unit column:", err);
        db.end();
        return;
      }
      console.log("weight_unit column added successfully!");
      updateExistingRows();
    });
  } else {
    console.log("weight_unit column already exists. Updating existing rows...");
    updateExistingRows();
  }

  function updateExistingRows() {
    const updateQuery = "UPDATE members SET weight_unit = 'kg' WHERE weight_unit IS NULL";
    db.query(updateQuery, (err) => {
      if (err) console.error("Error updating existing members:", err);
      else console.log("Existing members updated successfully!");
      db.end();
    });
  }
});
