/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);
// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});




//Start Serial
var sp=require("serialport")
var SerialPort = sp.SerialPort
var serialPort = new SerialPort("/dev/ttyUSB0", {
	baudrate: 9600,
	parser: sp.parsers.readline("\n")
});
var InstantData = require('./api/instantData/instantData.model');
var Powerdata = require('./api/powerdata/powerdata.model');
var ListCmd = [];
serialPort.on("open", function () {
	console.log('Serial Port Open');
	
  // 	setTimeout(function() {
		// serialPort.write("ping", function(err, results) {
		// 	    console.log('err ' + err);
		// 	    console.log('results ' + results);
		//   	});
  //     }, 3000);
	serialPort.on('data', function(data) {
		console.log(data)
		if (data.indexOf('finished')>0){
			console.log("Before Shift "+ListCmd)
			ListCmd.shift()
			console.log("After Shift "+ListCmd)
			if (ListCmd.length>0){
				console.log("finished called Next : "+ListCmd[0])
				sendCommand(ListCmd[0])
			}
		}
		else if (data.indexOf('APM:')===0){
			//APM: 12.00V 07.00A
			var receivedVolt=data.substring(data.indexOf('V')-5,data.indexOf('V'))
			var receivedAmp=data.substring(data.lastIndexOf('A')-4,data.lastIndexOf('A'))
			console.log(receivedVolt)
			console.log(receivedAmp)
			var calculatedPower=receivedAmp*receivedVolt
			InstantData.create({date:new Date(),message:data}, function(err, instantData) {});
			Powerdata.create({date:new Date(),power: calculatedPower,volt: receivedVolt,amp: receivedAmp}, function(err, powerData) {});
		}
		else{
			InstantData.create({date:new Date(),message:data}, function(err, instantData) {});
			
		}

	});
});
function sendCommand(cmd){
	console.log("sendcommand: "+cmd)
	serialPort.write(cmd, function(err, results) {
		    console.log('err ' + err);
		    console.log('results ' + results);
  	});
}
var newCommandToSend = function(cmd,cb){
	if (ListCmd.length>0){
		ListCmd.push(cmd)
		console.log("NewCommandToSend newValue "+ListCmd)
		cb();
	}
	else{
		console.log("sendcommand call")
		ListCmd.push(cmd)
		sendCommand(cmd)
		cb();
	}
}
setInterval(function() {
	newCommandToSend("APM", function(err, results) {
		InstantData.create({date:new Date(),message:"APM called. "}, function(err, instantData) {
	  });
	});
}, 3600000);
// Expose app
exports.newCommandToSend=newCommandToSend
exports.ListCmd=ListCmd
exports = module.exports = {app:app,serialPort:serialPort};
