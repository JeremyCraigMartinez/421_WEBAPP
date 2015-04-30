'use strict';

angular.module('myapp.controllers')
	.controller('LoginController', 
		function($scope, $location, $q, LoginService, SignupService, DoctorService) {
			$scope.signup = {};
			$scope.login = {};

			DoctorService.doctors().then(function (doctors) {
				var all = [];
				for (var doctor in doctors) {
					all.push(DoctorService.doctor_info(doctors[doctor]));
				}
				$q.all(all).then(function (doctors_info) {
					$scope.list_of_doctors = doctors_info;
					$scope.doctor_reference = {};
					for (var doctor in doctors_info) {
						$scope.doctor_reference[doctors_info[doctor].first_name] = doctors_info[doctor]._id;
					}
				});
			});

			LoginService.currentUser().then(function(user) {
				$scope.user = user;
			});

			$scope.submitSignup = function(signup) {
				if (signup.type === "doctor") {
					SignupService.add_doctor(signup).then(function(user) {
						console.log(user);
						$scope.user = user;
						$location.path('/users');
					});
				}
				else if (signup.type === "patient") {
					signup["doctor"] = $scope.doctor_reference[signup.doctor.first_name];
					SignupService.add_patient(signup).then(function(user) {
						console.log(user);
						$scope.user = user;
						$location.path('/users');
					});
				}
			}

			$scope.submitLogin = function() {
				LoginService.login($scope.login.email).then(function(user) {
					$scope.user = user;
					$location.path('/users');
				});
			}
		});