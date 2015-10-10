'use strict';

var _ = require('lodash');
var InstantData = require('./instantData.model');

// Get list of instantDatas
exports.index = function(req, res) {
  InstantData.find(function (err, instantDatas) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(instantDatas);
  });
};

// Get a single instantData
exports.show = function(req, res) {
  InstantData.findById(req.params.id, function (err, instantData) {
    if(err) { return handleError(res, err); }
    if(!instantData) { return res.status(404).send('Not Found'); }
    return res.json(instantData);
  });
};

// Creates a new instantData in the DB.
exports.create = function(req, res) {
  InstantData.create(req.body, function(err, instantData) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(instantData);
  });
};

// Updates an existing instantData in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  InstantData.findById(req.params.id, function (err, instantData) {
    if (err) { return handleError(res, err); }
    if(!instantData) { return res.status(404).send('Not Found'); }
    var updated = _.merge(instantData, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(instantData);
    });
  });
};

// Deletes a instantData from the DB.
exports.destroy = function(req, res) {
  InstantData.findById(req.params.id, function (err, instantData) {
    if(err) { return handleError(res, err); }
    if(!instantData) { return res.status(404).send('Not Found'); }
    instantData.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}