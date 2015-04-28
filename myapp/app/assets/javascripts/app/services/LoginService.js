'use strict';

angular.module('myapp.services')
	.service('LoginService', 
		function($q, $cookieStore, $rootScope, $location) {
			this._user = null;
			var service = this;

			this.login = function(email) {
				var deferred = $q.defer();
				var user = {
					email: email,
					id: 1
				}
				service._user = user;
				$cookieStore.put('user', user);
				$rootScope.$broadcast("user:set", user);

				deferred.resolve(user);
				return deferred.promise;
			}

			this.logout = function() {
				var deferred = $q.defer();
				service._user = null;
				$cookieStore.remove('user');
				$rootScope.$broadcast("user:unset");

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
		});