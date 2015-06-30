// app/assets/javascripts/app/controllers/AccountCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('AccountController',
    function($scope, $q, DoctorService, PatientService) {
      var service;
      if ($scope.userType === "patient") service = PatientService;
      else if ($scope.userType === "doctor" || $scope.userType === "admin") service = DoctorService;

      service.info($scope.currentUser.email).then(function (data) {
      	delete data['__v'];
        delete data['_id'];

        $scope.first_name = data.first_name;
        $scope.last_name = data.last_name;
        $scope.email = data.email;

        delete data['first_name'];
        delete data['last_name'];
        delete data['email'];

        console.log($scope.first_name);

        $scope.account_info = data;

        $scope.change_states = {};
        for (var each in $scope.account_info) {
          $scope.change_states[each] = false
        }
        $scope.change_states.first_name = false;
        $scope.change_states.last_name = false;
        $scope.change_states.email = false;

      });

      var change__all = [
	      "change__first_name",
				"change__last_name",
				"change__email",
				"change__hospital",
				"change__specialty",
        "change__age",
        "change__height",
        "change__weight",
        "change__sex"
			]

      console.log($scope.userType);

      $scope.changeState = function (changeMe) {
      	var old = change__all;
      	$scope.change_states[changeMe] = ($scope.change_states[changeMe]) ? false : true;

      	// set all others to false
      	change__all.splice(change__all.indexOf(changeMe),1);

      	for (var each in $scope.change_states) {
      		$scope.change_states[change__all[each]] = false;
      	}

      	// set $scope.change__all back to original value
      	change__all.push(changeMe);
      }

      $scope.changeField = function (field) {
        if (field in $scope.account_info) tmp = $scope.account_info;
        else if (field in $scope) tmp = $scope;

        //POST request to API
        tmp[field] = $scope.new_fields[field];
        $scope.new_fields[field] = null;

        $scope.change_states[field] = false;
      }

      $scope.deleteAccount = function() {
        service.remove(function (removed) {
          LoginService.logout().then(function () {
            $scope.currentUser = null;
          });
        });
      }      
  });