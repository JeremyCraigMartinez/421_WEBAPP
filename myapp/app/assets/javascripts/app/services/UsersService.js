'use strict';

angular.module('myapp.services')
	.service('UsersService', function($http, $q) {
		this.patients = function() {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://localhost:5025/patients",
			}).
			then(function(res) {
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}
		this.patient_info = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://localhost:5025/patients/"+id,
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
	});