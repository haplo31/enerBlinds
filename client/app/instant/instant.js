'use strict';

angular.module('solarWindowApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/instant', {
        templateUrl: 'app/instant/instant.html',
        controller: 'InstantCtrl'
      });
  });
