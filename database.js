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



    // ===========================
    // HOSPITAL SETTINGS TABLE
    // ===========================

    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            hospital_name TEXT,
            email TEXT,
            phone TEXT,
            ai_status TEXT DEFAULT 'Online'
        )
    `);



    // ===========================
    // DEFAULT SETTINGS
    // ===========================

    db.run(`
        INSERT OR IGNORE INTO settings
        (
            id,
            hospital_name,
            email,
            phone,
            ai_status
        )
        VALUES
        (
            1,
            'Dubai AI Hospital',
            'admin@hospital.com',
            '+971 50 0000000',
            'Online'
        )
    `);



    // ===========================
    // ADMINS TABLE
    // ===========================

    db.run(`
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    `);



    // ===========================
    // DEFAULT ADMIN
    // ===========================

    db.run(`
    INSERT OR IGNORE INTO admins
    (id, username, password)
    VALUES
    (
        1,
        'admin',
        '$2b$10$9DokcnK51h.38Z6F77NA2e4tN6qYEeXv5dyr40BMQjKyNKJLL3iZ2'
    )
    `);


});


module.exports = db;