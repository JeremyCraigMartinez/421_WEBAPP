'use strict';

angular.module('myapp.services')
	.service('UsersService', function($http, $q) {
		this.patients = function() {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "http://104.236.169.12:5024/user",
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
				url: "http://104.236.169.12:5024/user/"+id,
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				console.log('user: '+id+' has no info');
				deferred.resolve(null);
			});
			return deferred.promise;
		}
	});