const express = require("express");
const cors = require("cors");
const db = require("./database");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ===========================
   API STATUS
=========================== */

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Hospital AI Agent Backend is Running 🚀",
    version: "1.0.0"
  });
});

/* ===========================
   HEALTH CHECK
=========================== */

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Server Online",
    database: "SQLite Connected"
  });
});

/* ===========================
   CHECK DOCTOR AVAILABILITY
=========================== */

app.get("/check-doctor-availability", (req, res) => {

  const { date } = req.query;

  res.json({
    success: true,
    doctor: "Dr. Ahmed",
    date,
    availableSlots: [
      "10:00 AM",
      "11:00 AM",
      "2:00 PM",
      "4:00 PM"
    ]
  });

});

/* ===========================
   SCHEDULE APPOINTMENT
=========================== */

app.post("/schedule-appointment", (req, res) => {

  const { name, phone, doctor, date, time } = req.body;

  if (!name || !phone || !doctor || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  db.run(
    `INSERT INTO appointments
    (name, phone, doctor, date, time)
    VALUES (?, ?, ?, ?, ?)`,
    [name, phone, doctor, date, time],

    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        message: "Appointment Scheduled Successfully",
        appointmentId: this.lastID
      });

    }

  );

});

/* ===========================
   GET ALL APPOINTMENTS
=========================== */

app.get("/appointments", (req, res) => {

  db.all(
    "SELECT * FROM appointments ORDER BY id DESC",
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        total: rows.length,
        appointments: rows
      });

    }
  );

});

/* ===========================
   UPDATE APPOINTMENT
=========================== */

app.post("/update-appointment", (req, res) => {

  const { id, name, phone, doctor, date, time } = req.body;

  if (!id || !name || !phone || !doctor || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  db.run(
    `UPDATE appointments
     SET
        name = ?,
        phone = ?,
        doctor = ?,
        date = ?,
        time = ?
     WHERE id = ?`,
    [name, phone, doctor, date, time, id],

    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        message: "Appointment Updated Successfully"
      });

    }

  );

});
/* ===========================
   CANCEL APPOINTMENT
=========================== */

app.post("/cancel-appointment", (req, res) => {

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required"
    });
  }

  db.run(
    "DELETE FROM appointments WHERE phone = ?",
    [phone],

    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.json({
          success: false,
          message: "Appointment not found"
        });
      }

      res.json({
        success: true,
        message: "Appointment Cancelled Successfully",
        deleted: this.changes
      });

    }

  );

});

/* ===========================
   SERVER
=========================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});