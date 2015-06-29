// app/assets/javascripts/app/controllers/ActivityCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('RerouteController',
    function($scope, $q, $location) {
    	$location.path('/contact_us');
  });