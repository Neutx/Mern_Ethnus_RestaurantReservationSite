var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Day = require("../models/day").model;

// Parameters:
// {
//   "date": String ("Dec 02 2019 06:00")
// }

router.post("/", async function(req, res, next) {
  console.log("request attempted");

  console.log(req.body);
  const dateTime = new Date(req.body.date);

  try {
    const docs = await Day.find({ date: dateTime }).exec();

    if (docs.length > 0) {
      // Record already exists
      console.log("Record exists. Sent docs.");
      res.status(200).send(docs[0]);
    } else {
      // Searched date does not exist and we need to create it
      const allTables = require("../data/allTables");
      const day = new Day({
        date: dateTime,
        tables: allTables
      });

      await day.save();

      // Saved date and need to return all tables (because all are now available)
      console.log("Created new datetime. Here are the default docs");
      const newDocs = await Day.find({ date: dateTime }).exec();
      res.status(200).send(newDocs[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Could not search for date");
  }
});

module.exports = router;
