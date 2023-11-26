require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

const Reservation = require('./models/reservation'); // Import the Reservation model

const app = express();
const port = process.env.PORT || 3006;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// Check MongoDB connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Check for MongoDB connection errors
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  // Exit the process on MongoDB connection error
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Reserve endpoint
app.post('/api/reserve', async (req, res) => {
  try {
    const { name, phone, email, date, table } = req.body;

    // Create a new reservation
    const reservation = new Reservation({
      name,
      phone,
      email,
      date,
      table
    });

    // Save the reservation to the database
    await reservation.save();

    res.status(200).send('Reservation successful');
  } catch (error) {
    console.error('Error processing reservation:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Routes
app.use("/availability", require("./routes/availabilityRoute"));
app.use("/reserve", require("./routes/reservationRoute"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
