'use strict';

angular.module('myapp.controllers')
	.controller('SignupController', 
    function($scope, SignupService, $q) {
      $scope.signup = function(email, pass) {
	    	var data = {
					email:email,
					group:$scope.group,
					first_name:$scope.firstName,
					last_name:$scope.lastName,
					age:$scope.age,
					height:$scope.height,
					weight:$scope.weight,
					sex:$scope.sex
				};
	      SignupService.signup(email, pass)
	      .then(function(status) {
	       	SignupService.fillInInfo(data)
	       	.then(function(status) {
	       		alert(JSON.stringify(data));
	       	})
	       	.catch(function(error) {
	       		alert('err');
	       	});
	      })
	      .catch(function(error) {
	       	console.log("Signed up as "+email+" failed");
	      });
      }
  });