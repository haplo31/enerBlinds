'use strict';

var express = require('express');
var controller = require('./instantData.controller');
var InstantData = require('./instantData.model');
var router = express.Router();

router.get('/', controller.index);
router.get('/rtmon',startRTMLoop);
router.get('/rtmoff',stopRTMLoop);
router.get('/blindup',blindUp);
router.get('/blinddown',blindDown);
router.get('/locopt',locOpt);
router.get('/globopt',globOpt);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

var serialPort=require('./../../app.js').serialPort
var mainApp=require('./../../app.js')
var RTMLoop=null;
var RTMActive=0;
function startRTMLoop(req,res){
	if (RTMActive===0){
		RTMActive=1;
		clearInterval(RTMLoop)
		console.log("RTM Started")
		RTMLoop=setInterval(function() {
			var serialPort=require('./../../app.js').serialPort
			mainApp.newCommandToSend("RTM", function(err, results) {
				InstantData.create({date:new Date(),message:"RTM called. "}, function(err, instantData) {
			  });
			});
			
		}, 60000);
		return res.status(200).send('No Content');		
	}
	else{
		console.log("RTMActive:"+RTMActive)
		RTMActive++;
		return res.status(200).send('No Content');
	}
}
function stopRTMLoop(req,res){
	if(RTMActive===1){
		console.log("RTM stopped")
		clearInterval(RTMLoop)
		InstantData.create({date:new Date(),message:"RTM stopped. "}, function(err, instantData) {});
		RTMActive=0;
		return res.status(200).send('No Content');
	}
	else{
		RTMActive--;
		console.log("RTMActive:"+RTMActive)
		return res.status(200).send('No Content');
	}
}
function blindUp(req,res){
	var serialPort=require('./../../app.js').serialPort
	mainApp.newCommandToSend("BUP", function(err, results) {
		InstantData.create({date:new Date(),message:"Changing blind position.(UP) "}, function(err, instantData) {});
		 return res.status(200).send('No Content');
	});
}
function blindDown(req,res){
	var serialPort=require('./../../app.js').serialPort
	mainApp.newCommandToSend("BDO", function(err, results) {
		InstantData.create({date:new Date(),message:"Changing blind position.(DOWN) "}, function(err, instantData) {});
		return res.status(200).send('No Content');
	});
}
function locOpt(req,res){
	var serialPort=require('./../../app.js').serialPort
	mainApp.newCommandToSend("LOP", function(err, results) {
		InstantData.create({date:new Date(),message:"Searching local optimum. "}, function(err, instantData) {});
		return res.status(200).send('No Content');
	});
}
function globOpt(req,res){
	var serialPort=require('./../../app.js').serialPort
	mainApp.newCommandToSend("GOP", function(err, results) {
		InstantData.create({date:new Date(),message:"Searching global optimum. "}, function(err, instantData) {});
		return res.status(200).send('No Content');
	});
}
module.exports = router;