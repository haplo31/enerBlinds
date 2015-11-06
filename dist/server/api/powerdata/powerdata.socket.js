/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Powerdata = require('./powerdata.model');

exports.register = function(socket) {
	
  Powerdata.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Powerdata.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('powerdata:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('powerdata:remove', doc);
}