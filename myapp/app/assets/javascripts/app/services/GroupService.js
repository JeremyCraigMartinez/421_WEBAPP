'use strict';

angular.module('myapp.services')
	.service('GroupService', function($http, $q) {
		this.groups = function() {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "http://localhost:5024/groups",
			}).
			then(function(res) {
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}
		this.add_group = function(id) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: "http://localhost:5024/group",
				data: {_id:id}
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 400) {
					console.log(error);
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
		this.remove_group = function(id) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: "http://localhost:5024/group/remove",
				data: {_id:id}
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log('group: '+id+' does not exist');
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
	});