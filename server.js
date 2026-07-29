const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hospital AI Agent Backend is Running 🚀"
  });
});

// Check Doctor Availability
app.get("/check-doctor-availability", (req, res) => {
  const { date } = req.query;

  res.json({
    success: true,
    doctor: "Dr. Ahmed",
    date: date,
    availableSlots: [
      "10:00 AM",
      "11:00 AM",
      "2:00 PM",
      "4:00 PM"
    ]
  });
});

// Schedule Appointment
app.post("/schedule-appointment", (req, res) => {
  const { name, phone, doctor, date, time } = req.body;

  res.json({
    success: true,
    message: "Appointment Scheduled Successfully",
    appointment: {
      name,
      phone,
      doctor,
      date,
      time
    }
  });
});

// Cancel Appointment
app.post("/cancel-appointment", (req, res) => {
  const { phone } = req.body;

  res.json({
    success: true,
    message: `Appointment for ${phone} cancelled successfully`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});