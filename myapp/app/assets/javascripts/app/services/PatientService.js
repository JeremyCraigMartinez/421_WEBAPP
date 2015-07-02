'use strict';

angular.module('myapp.services')
	.service('PatientService', function($http, $q, LoginService, $rootScope, $cookieStore) {
		this.patients = function() {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/list_of_patients",
			}).
			then(function(res) {
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}
		this.info = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/patients",
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('patients: '+id+' has no info');
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
		this.patient_info = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/patients/"+id,
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('patients: '+id+' has no info');
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
		this.update_info = function(new_info) {
			var deferred = $q.defer();
			$http({
				method: "PUT",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/patients/update_info",
				data: new_info
			})
			.then(function(res) {
				console.log(new_info);
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('could not update info of: '+id);
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
		this.update_account = function(new_info) {
			var deferred = $q.defer();
			console.log(new_info);
			
			$http({
				method: "PUT",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/patients/update_account",
				data: new_info
			})
			.then(function(res) {
				deferred.resolve(res.data);
				LoginService.set_credentials(new_info.email || null, new_info.password || null).then(function (userr) {
					if (user===false)
						$location.path('/login');
					console.log(user);
				});
				/*
				LoginService.logout().then(function() {
					console.log($cookieStore.get('user'));

					LoginService.login(new_info.email || $rootScope.globals.email, new_info.password || null).then(function (user) {
						if (user===false) {
							$location.path('/login');
						}
					});
				});*/
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('could not update info of: '+id);
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
		this.remove = function(id) {
			var deferred = $q.defer();
			$http({
				method: "DELETE",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/patients/remove",
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('unable to remove patient: '+id);
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
	});