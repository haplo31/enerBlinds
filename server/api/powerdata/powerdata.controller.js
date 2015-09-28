'use strict';

var _ = require('lodash');
var Powerdata = require('./powerdata.model');

// Get list of powerdatas
exports.index = function(req, res) {
  Powerdata.find(function (err, powerdatas) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(powerdatas);
  });
};

// Get a single powerdata
exports.show = function(req, res) {
  Powerdata.findById(req.params.id, function (err, powerdata) {
    if(err) { return handleError(res, err); }
    if(!powerdata) { return res.status(404).send('Not Found'); }
    return res.json(powerdata);
  });
};

// Creates a new powerdata in the DB.
exports.create = function(req, res) {
  Powerdata.create(req.body, function(err, powerdata) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(powerdata);
  });
};

// Updates an existing powerdata in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Powerdata.findById(req.params.id, function (err, powerdata) {
    if (err) { return handleError(res, err); }
    if(!powerdata) { return res.status(404).send('Not Found'); }
    var updated = _.merge(powerdata, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(powerdata);
    });
  });
};

// Deletes a powerdata from the DB.
exports.destroy = function(req, res) {
  Powerdata.findById(req.params.id, function (err, powerdata) {
    if(err) { return handleError(res, err); }
    if(!powerdata) { return res.status(404).send('Not Found'); }
    powerdata.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}