'use strict';

angular.module('myapp.services')
	.service('LoginService', function($http, $q) {
		this.signup = function(email, pass) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: "http://104.236.169.12:5024/login",
				data: {email:email,pass:pass}
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				console.log('login error');
				console.log(error);
			});
			return deferred.promise;
		}
	});