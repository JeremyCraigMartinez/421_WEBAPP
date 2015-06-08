// app/assets/javascripts/app/controllers/AccountCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('AccountController',
    function($scope, $q, DoctorService) {
      DoctorService.doctor_info($scope.currentUser.email).then(function (data) {
      	delete data['__v'];
      	delete data['_id'];

        $scope.account_info = data;
      });
      $scope.change__first_name = false;
      $scope.change__last_name = false;
      $scope.change__email = false;
      $scope.change__hospital = false;
      $scope.change__specialty = false;

      var change__all = [
	      "change__first_name",
				"change__last_name",
				"change__email",
				"change__hospital",
				"change__specialty"
			]

      $scope.changeState = function (changeMe) {
      	var old = change__all;
      	$scope[changeMe] = ($scope[changeMe]) ? false : true;

      	// set all others to false
      	change__all.splice(change__all.indexOf(changeMe),1);

      	for (var each in change__all) {
      		$scope[change__all[each]] = false;
      	}

      	// set $scope.change__all back to original value
      	change__all.push(changeMe);
      }

      $scope.deleteAccount = function() {
        console.log('here');
        DoctorService.remove_doctor(function (removed_doctor) {
          LoginService.logout().then(function () {
            $scope.currentUser = null;
          });
        });
      }      
  });