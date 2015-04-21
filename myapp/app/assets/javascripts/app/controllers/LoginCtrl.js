'use strict';

angular.module('myapp.controllers')
	.controller('LoginController', 
		function($scope, $location, LoginService) {
			$scope.signup = {};
			$scope.login = {};

			LoginService.currentUser().then(function(user) {
				$scope.user = user;
			});

			$scope.submitSignup = function() {
				LoginService.login($scope.signup.email).then(function(user) {
					console.log(user);
					$scope.user = user;
					$location.path('/');
				});
			}

			$scope.submitLogin = function() {
				LoginService.login($scope.login.email).then(function(user) {
					$scope.user = user;
					$location.path('/');
				});
			}
		});