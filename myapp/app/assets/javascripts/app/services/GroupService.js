'use strict';

angular.module('myapp.services')
	.service('GroupService', function($http, $q) {
		this.groups = function() {
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://dev.api.wsuhealth.wsu.edu:5025/groups",
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
				url: "https://dev.api.wsuhealth.wsu.edu:5025/groups",
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
				else if (error.status === 401) {
					console.log(error);
					alert("A request to add this group has been sent");
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
				url: "https://dev.api.wsuhealth.wsu.edu:5025/groups/remove",
				data: {_id:id}
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				if (error.status === 404) {
					console.log(error);
					console.log('group: '+id+' does not exist');
					deferred.reject(error);
				}
				else if (error.status === 401) {
					console.log(error);
					alert("A request to delete this group has been sent");
					deferred.reject(error);
				}
				else 
					console.log(error);
			});
			return deferred.promise;
		}
	});