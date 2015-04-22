'use strict';

angular.module('myapp.controllers')
	.controller('AccountController', 
    function($scope, AccountService) {
      /*AccountService.patients().then(function(patients) {
        $scope.patients = [];
        for (var patient in patients) {
          AccountService.patient_info(patients[patient]).then(function(info) {
            if (info)
              $scope.patients.push(info);
          });
        }
      });*/
  });