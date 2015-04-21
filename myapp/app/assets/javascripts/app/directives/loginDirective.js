// app/assets/javascripts/app/directives/loginDirectives.js

'use strict';

angular.module('myapp.directives')
	.directive('userPanel', function() {
		return {
			templateUrl: '/templates/user_panel.html',
			controller: function($scope, LoginService) {
				LoginService.currentUser().then(function(user) {
					$scope.currentUser = user;					
				});

				$scope.$on("user:set", function(evt, currentUser) {
					$scope.currentUser = currentUser;
				});

				$scope.logout = function() {
					LoginService.logout().then(function() {
						$scope.currentUser = null;
					});
				};
			}
		};
	});