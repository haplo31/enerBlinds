/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var InstantData = require('./instantData.model');

exports.register = function(socket) {
  InstantData.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  InstantData.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('instantData:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('instantData:remove', doc);
}