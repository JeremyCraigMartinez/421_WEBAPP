// app/assets/javascripts/app/controllers/UsersCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('PatientController',
    function($scope, PatientService, $q) {
      $scope.Math = window.Math;
      PatientService.patients().then(function(patients) {
        $scope.patients = [];
        for (var patient in patients) {
          PatientService.patient_info(patients[patient]).then(function(info) {
            if (info)
              $scope.patients.push(info);
          });
        }
      });
      $scope.predicate = 'last_name';
      $scope.reverse = true;
      $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
      }
  });