'use strict';
//var socketio = io.connect('http://localhost:9000');
//socketio.emit("yop")
angular.module('solarWindowApp')
  .controller('InstantCtrl', function ($scope,$http,socket) {
	  //Launch RTM
	 	$scope.$on('$routeChangeSuccess', function (scope, next, current) {
	 		// console.log("on")
	 		// console.log(scope)
	 		// console.log(next)
	 		// console.log(current)
	  	$http.get('/api/instantdatas/rtmon')
		});
		//Stop RTM
		
		window.onbeforeunload = function () {
   		$http.get('/api/instantdatas/rtmoff')
		};
	  $scope.$on('$routeChangeStart', function(scope, next, current){
	  	// console.log("off")
	  	// console.log(scope)
	 		// console.log(next)
	 		// console.log(current)
	    $http.get('/api/instantdatas/rtmoff')
	  });

		function getRandomColor() {
		   var letters = '0123456789ABCDEF'.split('');
		   var choice = '#';
		   for (var i = 0; i < 6; i++ ) {
		       choice += letters[Math.floor(Math.random() * 16)];
		   }
		   //console.log(choice)
		   return {'color':choice,'border-color':choice}
	            
		}
		var chooseColor
    $http.get('/api/instantdatas').success(function(SolarDatas) {
    	$scope.SolarDatas = SolarDatas;
      $scope.message= []
      for (var i = SolarDatas.length - 1; i >= SolarDatas.length-11; i--) {
      	SolarDatas[i].date=SolarDatas[i].date.substring(8,10)+"/"+SolarDatas[i].date.substring(5,7)+" "+SolarDatas[i].date.substring(11,16)
      	chooseColor=getRandomColor();
      	$scope.message.push({date:SolarDatas[i].date,message:SolarDatas[i].message,color:chooseColor})
      };
      socket.syncUpdates('instantData', $scope.SolarDatas,function(event, item, array){
    	  var actionKey=item.message.substring(0,4)
    	  if (actionKey==="RTM:"){// RealTime Measurement
    	  	$scope.InstaVolt=item.message.substring(item.message.indexOf('V')-5,item.message.indexOf('V'))
    	  	$scope.InstaAmp=item.message.substring(item.message.indexOf('A')-4,item.message.indexOf('A'))
      		$scope.InstaPower=($scope.InstaVolt*$scope.InstaAmp).toFixed(2);
    	  }
    	  item.date=item.date.substring(8,10)+"/"+item.date.substring(5,7)+" "+item.date.substring(11,16)
    	  chooseColor=getRandomColor();
    	  $scope.message.push({date:item.date,message:item.message,color:chooseColor})
      });
      // var dataSend1 = {date:new Date(),message:"RTM: 12.00V 05.00A"}
      // var dataSend2 = {date:new Date()+1,message:"RTM: 12.10V 03.00A"}
      // $http.post('/api/instantdatas', dataSend1);
      
      // setTimeout(function() {
      // 	$http.post('/api/instantdatas', dataSend2);
      // 	$http.post('/api/instantdatas', dataSend2);
      // 	$http.post('/api/instantdatas', dataSend1);
      // }, 1000);
      // setTimeout(function() {
      // 	$http.post('/api/instantdatas', dataSend2);
      // 	$http.post('/api/instantdatas', dataSend1);
      // }, 2000);
      // setTimeout(function() {
      // 	$http.post('/api/instantdatas', dataSend1);
      // 	$http.post('/api/instantdatas', dataSend1);
      // 	$http.post('/api/instantdatas', dataSend2);
      // 	$http.post('/api/instantdatas', dataSend2);
      // 	$http.post('/api/instantdatas', dataSend1);
      // 	$http.post('/api/instantdatas', dataSend1);
      // }, 3000);
      // setTimeout(function() {
      // 	$http.post('/api/instantdatas', {date:new Date()+1,message:"RTM: 12.50V 12.20A"});
      // }, 5000);

      // socket.syncUpdates('powerdata', $scope.SolarDatas,function(event, item, array){
	     //  	$scope.InstaVolt=item.volt
	     //  	$scope.InstaAmp=item.amp
	     //  	$scope.InstaPower=item.power/1000
      // });
    });
		$scope.blindUp = function() {
      $http.get('/api/instantdatas/blindup');
    };
    $scope.blindDown = function() {
      $http.get('/api/instantdatas/blinddown');
    };
    $scope.localOpt = function() {
      $http.get('/api/instantdatas/locopt');
    };
    $scope.globalOpt = function() {
      $http.get('/api/instantdatas/globopt');
    };
    $scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
    };
  });
