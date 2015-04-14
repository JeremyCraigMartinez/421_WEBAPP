// app/assets/javascripts/app/controllers/Home.js

'use strict';

angular.module('myapp.controllers')
  .controller('HomeController',
    function($scope, UsersService, $q) {
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