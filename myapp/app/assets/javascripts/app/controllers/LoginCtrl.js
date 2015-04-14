'use strict';

angular.module('myapp.controllers')
	.controller('LoginController', 
    function($scope, LoginService, $q) {
      $scope.signup = function(email, pass) {
	      LoginService.signup(email, pass)
	      .then(function(status) {
	       	alert(status);
	      })
	      .catch(function(error) {
	      	alert(error);
	      });
      }
  });