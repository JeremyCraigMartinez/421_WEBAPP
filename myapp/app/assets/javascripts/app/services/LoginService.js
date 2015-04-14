'use strict';

angular.module('myapp.services')
	.service('LoginService', function($http, $q) {
		this.signup = function(email, pass) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: "http://localhost:5024/user/create",
				data: {email:email,pass:pass}
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				console.log(error);
				alert(error);
			});
			return deferred.promise;
		}
	});

