'use strict';

angular.module('myapp.services')
	.service('SignupService', function($http, $q) {
		this.add_patient = function(info) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: "http://localhost:5025/patients",
				data: info
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
		this.add_doctor = function(info) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: "http://localhost:5025/doctors",
				data: info
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
					url: "http://localhost:5025/user/"+data['email']+"/info",
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