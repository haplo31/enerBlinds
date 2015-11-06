'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PowerDataSchema = new Schema({
  date: Date,
  power: String,
  volt: String,
  amp: String
});

module.exports = mongoose.model('PowerData', PowerDataSchema);