// app/assets/javascripts/app/controllers/AccountCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('AccountController',
    function($scope, $q, DoctorService) {
      DoctorService.doctor_info($scope.currentUser.email).then(function (data) {
        $scope.account_info = data;
      });
  });