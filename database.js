const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./hospital.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to SQLite Database");

    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        doctor TEXT,
        date TEXT,
        time TEXT
      )
    `);
  }
});

module.exports = db;