var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Day = require("../models/day").model;
const Reservation = require("../models/reservation").model;

// Parameters:
// {
//   "date": String ("Dec 02 2019 06:00"),
//   "table": table id,
//   "name": String,
//   "phone": String,
//   "email": String
// }

router.post("/", async function(req, res, next) {
  try {
    const days = await Day.find({ date: req.body.date }).exec();

    if (days.length > 0) {
      let day = days[0];

      for (let table of day.tables) {
        if (table._id == req.body.table) {
          // The correct table is table
          table.reservation = new Reservation({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
          });
          table.isAvailable = false;
          await day.save();
          console.log("Reserved");
          res.status(200).send("Added Reservation");
          return; // Exit the loop once the reservation is added
        }
      }

      // If the loop completes without finding the table
      console.log("Table not found");
      res.status(404).send("Table not found");
    } else {
      console.log("Day not found");
      res.status(404).send("Day not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
