'use strict';

angular.module('myapp.controllers')
	.controller('LoginController', 
    function($scope, LoginService, $q) {
      $scope.signup = function(email, pass) {
	      LoginService.signup(email, pass)
	      .then(function(status) {
	       	console.log("login");
	      })
	      .catch(function(error) {
	      	console.log("login error");
	      });
      }
  });