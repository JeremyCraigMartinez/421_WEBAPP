'use strict';

angular.module('myapp.services')
	.service('LoginService', 
		function($q, $cookieStore, $rootScope, $location, $http, Base64) {
			this._user = null;
			var service = this;

			this.login = function(email, password) {
				var deferred = $q.defer();

				$http({
					method: "POST",
					url: "https://dev.api.wsuhealth.wsu.edu:5025/auth",
					data: {email:email,password:password}
				})
				.then(function (res) {
					set_credentials(email, password, res.data.type);
					console.log(res.data);
					deferred.resolve(res.data);
				})
				.catch(function (error) {
					clear_credentials(this);
					console.log('auth failed for '+email+":"+password);
					deferred.resolve(false);
				});

				return deferred.promise;
			}

			var set_credentials = function (email, password, userType) {
				var user = {
					email: email,
					id: 1
				}
				service._user = user;
				$cookieStore.put('user', user);
				$cookieStore.put('userType', userType);
				$rootScope.$broadcast("user:set", user);
				$rootScope.$broadcast("userType:set", userType);
				
				var authdata = Base64.encode(email+':'+password)
				$rootScope.globals = {
					currentUser: {
						username: email,
						authdata: authdata
					}
				}
				$http.defaults.headers.common['Authorization'] = 'Basic '+authdata;
				$cookieStore.put('globals', $rootScope.globals);
			}

			var clear_credentials = function () {
				service._user = null;
				$cookieStore.remove('user');
				$rootScope.$broadcast("user:unset");

				$rootScope.globals = {};
				$cookieStore.remove('globals');
				$http.defaults.headers.common.Authorization = 'Basic ';
			}

			this.logout = function() {
				var deferred = $q.defer();

				clear_credentials(this);

				deferred.resolve();
				$location.path('/login');
				return deferred.promise;
			}

			this.currentUser = function() {
				var deferred = $q.defer();
				if (service._user) {
					deferred.resolve(service._user);
				}
				else if ($cookieStore.get('user')) {
					service._user = $cookieStore.get('user');
					$rootScope.$broadcast('user:set', service._user);
					deferred.resolve(service._user);
				}
				else {
					deferred.resolve(null);
				}
				deferred.resolve(service._user);
				return deferred.promise;
			}

			this.currentPass = function() {
				var deferred = $q.defer();
				if (service._password) {
					deferred.resolve(service._password);
				}
				else if ($cookieStore.get('password')) {
					service._password = $cookieStore.get('password');
					$rootScope.$broadcast('password:set', service._password);
					deferred.resolve(service._password);
				}
				else {
					deferred.resolve(null);
				}
				deferred.resolve(service._password);
				return deferred.promise;
			}			
		});