'use strict';

angular.module('myapp.services')
	.service('ProfileService', function($http, $q, $routeParams) {
		this.patient_info = function(id) {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "http://localhost:5024/patients/"+id,
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