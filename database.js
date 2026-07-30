const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./hospital.db", (err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to SQLite Database");
    }
});

db.serialize(() => {

    // ===========================
    // APPOINTMENTS TABLE
    // ===========================

    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            doctor TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ===========================
    // DOCTORS TABLE
    // ===========================

    db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialization TEXT NOT NULL,
            available TEXT DEFAULT 'Yes'
        )
    `);

    // ===========================
    // DEFAULT DOCTORS
    // ===========================

    db.run(`
        INSERT OR IGNORE INTO doctors
        (id, name, specialization, available)
        VALUES
        (1,'Dr. Ahmed','Cardiologist','Yes'),
        (2,'Dr. Abdullah','Dentist','Yes'),
        (3,'Dr. Sarah','Dermatologist','Yes'),
        (4,'Dr. Ali','Orthopedic','Yes')
    `);

});

module.exports = db;