'use strict';

angular.module('myapp.controllers')
	.controller('SignupController', 
    function($scope, SignupService, $q) {
      $scope.signup = function(email, pass) {
	      SignupService.signup(email, pass)
	      .then(function(status) {
	       	alert(status);
	      })
	      .catch(function(error) {
	      	alert(error);
	      });
      }
  });