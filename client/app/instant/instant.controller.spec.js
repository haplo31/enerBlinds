'use strict';

describe('Controller: InstantCtrl', function () {

  // load the controller's module
  beforeEach(module('solarWindowApp'));

  var InstantCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InstantCtrl = $controller('InstantCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
