'use strict';

angular.module('myapp.services')
	.service('SignupService', function($http, $q) {
		this.signup = function(email, pass) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: "http://104.236.169.12:5024/user/create",
				data: {email:email,pass:pass}
			})
			.then(function(res) {
				deferred.resolve(res.data);
			})
			.catch(function(error) {
				console.log('signup error');
				console.log(error);
			});
			return deferred.promise;
		}
		this.fillInInfo = function(data) {
			try {
				console.log(data['email']);
				var deferred = $q.defer();
				$http({
					method: "POST",
					url: "http://104.236.169.12:5024/user/"+data['email']+"/info",
					data: data
				})
				.then(function(res) {
					deferred.resolve(res.data);
				})
				.catch(function(error) {
					deferred.resolve('error');
					console.log('signup error');
					console.log(error);
				});
				return deferred.promise;
			}
			catch (error) {
				alert(error);
			}
		}
	});