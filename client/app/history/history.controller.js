'use strict';
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
function hourDiff(d1, d2)
{
	d1 = new Date(d1)
	d2 = new Date(d2)
	console.log(d1)
	console.log(d2)
  d1 = d1.getTime() / 3600000;
  d2 = d2.getTime() / 3600000;
  console.log(d1)
  console.log(d2)
  return new Number(d2 - d1).toFixed(0);
}
angular.module('solarWindowApp')
  .controller('HistoryCtrl', function ($scope,$http,socket) {

    
    $scope.volts = [];
    $scope.amps = [];
    $scope.powers = [];
    $scope.date = [];
    $scope.dateformat = [];
    $http.get('/api/powerdatas').success(function(SolarDatas) {
      $scope.SolarDatas = SolarDatas;
      //console.log(SolarDatas)

      for (var i=0;i<SolarDatas.length;i++){
      	$scope.volts.push(SolarDatas[i].volt)
      	$scope.amps.push(SolarDatas[i].amp)
      	$scope.powers.push(SolarDatas[i].power)
      	$scope.date.push(SolarDatas[i].date)
        $scope.dateformat.push(SolarDatas[i].date.substring(8,10)+"/"+SolarDatas[i].date.substring(5,7)+" "+SolarDatas[i].date.substring(11,16))
      }
      socket.syncUpdates('powerdata', $scope.SolarDatas,function(event, item, array){
	      	$scope.volts.push(item.volt)
	      	$scope.amps.push(item.amp)
	      	$scope.powers.push(item.power)
	      	$scope.date.push(item.date)
          $scope.dateformat.push(item.date.substring(8,10)+"/"+item.date.substring(5,7)+" "+item.date.substring(11,16))
      });
    });
    // $scope.addData = function(dataSend) {
    // 	dataSend.date = new Date();
    // 	dataSend.power=dataSend.volt*dataSend.amp;
    // 	//console.log(dataSend)
    //   $http.post('/api/powerdatas', dataSend);
    // };
   //  $scope.addAll = function() {
   //  	var dataSend1 = {date:new Date().addHours(-4),volt:20,amp:1,power:20}
   //    $http.post('/api/powerdatas', dataSend1);
   //    var dataSend2 = {date:new Date().addHours(-3),volt:20,amp:1.5,power:30}
   //    $http.post('/api/powerdatas', dataSend2);
   //    var dataSend3 = {date:new Date().addHours(-2),volt:20,amp:2,power:40}
   //    $http.post('/api/powerdatas', dataSend3);
   //    var dataSend4 = {date:new Date().addHours(-1),volt:20,amp:1,power:20}
   //    $http.post('/api/powerdatas', dataSend4);
   //    var dataSend5 = {date:new Date().toUTCString(),volt:20,amp:1.5,power:30}
   //    $http.post('/api/powerdatas', dataSend5);
   //  };
   // $scope.addAll();

	$scope.colors = ['#FD1F5E','#1EF9A1','#7FFD1F','#68F000'];
 	$scope.labels = $scope.dateformat;
  $scope.series = ['Volts','Amps','Power'];
  $scope.data = [
    $scope.volts,
    $scope.amps,
    $scope.powers,
  ];
  var nbselect=0
  $scope.onClick = function (points, evt) {
  	var pos1,pos2;
  	var dateStart,dateEnd
  	if (nbselect==2){
  		nbselect=0;
  		$scope.showStats=false;
  		$scope.showDatas=false;
  		$scope.periodVolt=0;
			$scope.periodAmp=0;
			$scope.periodPower=0;
  		$scope.kwh=0;
  	}
  	else if (nbselect==0){
  		$scope.showStats=true;
  		$scope.dateStart=points[0].label
  		$scope.periodStart=$scope.dateStart
  		$scope.period=$scope.periodStart;
  		nbselect++;
  		$scope.pos1 = $scope.SolarDatas.map(function(e) { return e.date.substring(8,10)+"/"+e.date.substring(5,7)+" "+e.date.substring(11,16); }).indexOf(points[0].label);
  	}
  	else{
  		dateEnd=points[0].label
  		$scope.periodEnd=dateEnd
  		$scope.period=$scope.periodStart+" to "+$scope.periodEnd
  		nbselect++;
			$scope.periodVolt=0;
			$scope.periodAmp=0;
			$scope.periodPower=0;
			for (var i = $scope.pos1; i <= $scope.SolarDatas.map(function(e) { return e.date.substring(8,10)+"/"+e.date.substring(5,7)+" "+e.date.substring(11,16); }).indexOf(points[0].label); i++) {
				console.log($scope.SolarDatas[i])
        $scope.periodVolt+=parseFloat($scope.SolarDatas[i].volt);
				$scope.periodPower+=parseFloat($scope.SolarDatas[i].power);
				if(i == $scope.SolarDatas.map(function(e) { return e.date.substring(8,10)+"/"+e.date.substring(5,7)+" "+e.date.substring(11,16); }).indexOf(points[0].label)){
					$scope.periodVolt=$scope.periodVolt/(i-$scope.pos1+1);
          $scope.periodPower=$scope.periodPower/(i-$scope.pos1+1);
					$scope.periodAmp=$scope.periodPower/$scope.periodVolt;
					$scope.showDatas=true;
          console.log($scope.dateStart.substring(0,2))
          console.log($scope.dateStart.substring(6,8))
          console.log($scope.dateStart.substring(9,11))
					$scope.timediff=hourDiff($scope.dateStart,dateEnd)
					$scope.power=($scope.periodVolt*$scope.periodAmp)
					$scope.kwh=$scope.power*$scope.timediff/1000
				}
			};
  	}
    //console.log(points[0].label);
    //console.log(points[1]);
    //console.log(points[2].value);
  };






  });
