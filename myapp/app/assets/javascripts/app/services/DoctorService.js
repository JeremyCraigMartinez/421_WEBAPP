'use strict';

angular.module('myapp.services')
	.service('DoctorService', function($http, $q, $routeParams, LoginService) {
		this.doctors = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/doctors",
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('doctors: '+id+' has no info');
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
		this.add_doctor = function(info) {
			var deferred = $q.defer();

			$http({
				method: "POST",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/doctors",
				data: info
			})
			.then(function(res) {
				LoginService.login(info.email, info.password).then(function (user) {
					deferred.resolve(res.data);
				});
			})
			.catch(function(error) {
				console.log('doctor signup error');
				console.log(error);
			});
			return deferred.promise;
		}
		this.doctor_info = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/doctors/"+id,
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('doctors: '+id+' has no info');
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
		this.remove_doctor = function(id) {
			var deferred = $q.defer();
			$http({
				method: "DELETE",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/doctors/remove",
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('unable to remove doctor: '+id);
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
	});