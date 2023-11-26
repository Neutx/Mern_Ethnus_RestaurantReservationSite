const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  date: Date,
  table: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
