/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var PowerData = require('../api/powerdata/powerdata.model');


PowerData.find({}).remove(function() {
  PowerData.create({
    date: Date,
    power: 100,
    volt: 20,
    amp: 5,
  }, {
    date: Date,
    power: 200,
    volt: 20,
    amp: 10,
  }, {
    date: Date,
    power: 200,
    volt: 20,
    amp: 10,
  },  {
    date: Date,
    power: 150,
    volt: 20,
    amp: 7.5,
  },  {
    date: Date,
    power: 100,
    volt: 20,
    amp: 5,
  },{
    date: Date,
    power: 200,
    volt: 20,
    amp: 10,
  });
});