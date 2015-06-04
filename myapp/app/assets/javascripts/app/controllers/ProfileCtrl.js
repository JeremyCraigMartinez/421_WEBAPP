'use strict';

angular.module('myapp.controllers')
	.controller('ProfileController', 
    function($scope, ProfileService, $routeParams) {
      ProfileService.patient_info($routeParams['user_id']).then(function (info) {
      	$scope.first_name = info.first_name;
      	$scope.last_name = info.last_name;

      	delete info['__v'];
      	delete info['_id'];
      	delete info['first_name'];
      	delete info['last_name'];

        $scope.patient_info = info;
      });
  });