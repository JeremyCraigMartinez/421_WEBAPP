'use strict';

angular.module('myapp.controllers')
	.controller('LoginController', 
		function($scope, $location, $q, LoginService, DoctorService, Base64, ProfileService) {
			$scope.signup = {};
			$scope.login = {};

			var str, enc
			str = "hello snerld";
			enc = Base64.encode(str);
			console.log('str: '+str);
			console.log('enc: '+enc);

			DoctorService.doctors().then(function (doctors) {
				var all = [];
				for (var doctor in doctors) {
					all.push(DoctorService.doctor_info(doctors[doctor]));
				}
				$q.all(all).then(function (doctors_info) {
					for (var doctor in doctors_info) {
						doctors_info[doctor].full_name = doctors_info[doctor].first_name + " " + doctors_info[doctor].last_name
					}
					$scope.list_of_doctors = doctors_info;
				});
			});

			LoginService.currentUser().then(function (user) {
				$scope.user = user;
			});

			$scope.submitSignup = function (signup) {
				if (signup.type === "doctor") {
					DoctorService.add_doctor(signup).then(function (data, user) {
						$scope.user = user;
						$location.path('/users');
					});
				}
				else if (signup.type === "patient") {
					signup["doctor"] = signup.doctor.email
					ProfileService.add_patient(signup).then(function (user) {
						$scope.user = user;
						$location.path('/users');
					});
				}
			}

			$scope.submitLogin = function() {
				LoginService.login($scope.login.email, $scope.login.password).then(function (user) {
					console.log(user===false);
					if (user===false) {
						$scope.failedLogin=true;
						$location.path('/login');
					}
					else {
						$scope.user = user;
						$location.path('/users');
					}
				});
			}
		});