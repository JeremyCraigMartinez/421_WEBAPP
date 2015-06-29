// app/assets/javascripts/app/controllers/PatientsCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('PatientController',
    function($scope, PatientService, $q, $rootScope) {
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

      $scope.search = $rootScope.globals.search || "";

      $scope.firstContainsSecond = function (patient,search) {
        delete patient._id;
        delete patient.__v;

        var keys = Object.keys(patient);
        for (var each in keys) {
          if (typeof patient[keys[each]] === 'string') {
            if (patient[keys[each]].includes(search)) return true;
          }
          else if (typeof patient[keys[each]] === 'number') {
            if (patient[keys[each]] == search) return true;
          }
          else {
            for (var each_group in patient[keys[each]]) {
              if (patient[keys[each]][each_group].includes(search)) return true;
            }
          }
        }
        return false;
      }
  });