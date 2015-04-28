'use strict';

angular.module('myapp.controllers')
	.controller('ProfileController', 
    function($scope, ProfileService, $routeParams) {
      ProfileService.patient_info($routeParams['user_id']).then(function (info) {
        $scope.patient_info = info;
      });
  });