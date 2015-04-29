// app/assets/javascripts/app/controllers/UsersCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('UsersController',
    function($scope, UsersService, $q) {
      $scope.Math = window.Math;
      UsersService.patients().then(function(patients) {
        $scope.patients = [];
        for (var patient in patients) {
          UsersService.patient_info(patients[patient]).then(function(info) {
            if (info)
              $scope.patients.push(info);
          });
        }
      });
      
  });