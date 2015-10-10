'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InstantDataSchema = new Schema({
  date: Date,
  message: String
});

module.exports = mongoose.model('InstantData', InstantDataSchema);