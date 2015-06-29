'use strict';

angular.module('myapp.controllers')
	.controller('LoginController', 
		function($scope, $location, $q, GroupService, LoginService, DoctorService, Base64, ProfileService) {
			$scope.signup = {};
			$scope.login = {};

			DoctorService.doctors().then(function (doctors) {
				var all = [];
				for (var doctor in doctors) {
					all.push(DoctorService.info(doctors[doctor]));
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

			GroupService.groups().then(function(groups) {
				$scope.groups = [];
				for (var group in groups) {
					$scope.groups.push(groups[group]._id);
				}
			});

			$scope.remove_group = function (group) {
				$scope.signup.group = null;
				$scope.groups.push(group);
				$scope.selected_groups.splice($scope.selected_groups.indexOf(group),1);
			}

			$scope.selected_groups = [];
			$scope.setGroup = function(group){
				$scope.groups.splice($scope.groups.indexOf(group),1);
				$scope.selected_groups.push(group);
			};

			$scope.submitSignup = function (signup) {
				if (signup.type === "doctor") {
					DoctorService.add_doctor(signup).then(function (data, user) {
						console.log(signup.email);
						console.log(signup.pass);
						LoginService.login(signup.email, signup.pass).then(function (user) {
							if (user===false) {
								$scope.failedLogin=true;
								$location.path('/login');
							}
							else {
								$scope.user = user;
								$location.path('/patient_home');
							}
						});
					});
				}
				else if (signup.type === "patient") {
					signup["doctor"] = signup.doctor.email
					signup.group = $scope.selected_groups;
					ProfileService.add_patient(signup).then(function (user) {
						console.log(signup.email);
						console.log(signup.pass);
						LoginService.login(signup.email, signup.pass).then(function (user) {
							if (user===false) {
								$scope.failedLogin=true;
								$location.path('/login');
							}
							else {
								$scope.user = user;
								$location.path('/patients');
							}
						});
					});
				}
			}

			$scope.submitLogin = function() {
				LoginService.login($scope.login.email, $scope.login.password).then(function (user) {
					if (user===false) {
						$scope.failedLogin=true;
						$location.path('/login');
					}
					else {
						$scope.user = user;
						if ($scope.userType === "doctor") $location.path('/patients');
						else if ($scope.userType === "admin") $location.path('/admin');
						else if ($scope.userType === "patient") $location.path('/patient_home');
					}
				});
			}

		});