'use strict';

angular.module('solarWindowApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/history', {
        templateUrl: 'app/history/history.html',
        controller: 'HistoryCtrl'
      });
  });
