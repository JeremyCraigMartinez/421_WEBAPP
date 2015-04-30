'use strict';

angular.module('myapp.services')
	.service('DoctorService', function($http, $q, $routeParams) {
		this.doctors = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "http://localhost:5024/doctors",
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
		this.doctor_info = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "http://localhost:5024/doctors/"+id,
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
	});