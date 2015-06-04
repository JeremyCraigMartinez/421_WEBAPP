'use strict';// app/assets/javascripts/app/app.jsangular.module('myapp', [  'ngRoute',  'ngCookies',  'myapp.controllers',  'myapp.services',  'myapp.directives',])  .config(function($routeProvider, $locationProvider) {    $routeProvider      .when('/user/:user_id',         {          controller: 'ProfileController',          templateUrl: '/templates/profile.html'        })      .when('/login',         {          controller: 'LoginController',          templateUrl: '/templates/login.html'        })      .when('/',         {          controller: 'PatientController',          templateUrl: '/templates/users.html'        })      .when('/users',         {          controller: 'PatientController',          templateUrl: '/templates/users.html'        })      .when('/groups',         {          controller: 'GroupController',          templateUrl: '/templates/groups.html'        })      .when('/account',         {          controller: 'AccountController',          templateUrl: '/templates/account.html'        })      .when('/about',         {          templateUrl: '/templates/about.html'        })      .when('/contact_us',         {          templateUrl: '/templates/contact_us.html'        })      .when('/faq',         {          templateUrl: '/templates/faq.html'        })      .when('/404',        {          templateUrl: '/404.html'        })      .otherwise({redirectTo: '/404'});    $locationProvider.html5Mode(true);  })//;  .run(function (LoginService, $location, $rootScope, $cookieStore, $http) {    $rootScope.globals = $cookieStore.get('globals') || {};    if ($rootScope.globals.currentUser) {      $http.defaults.headers.common['Authorization'] = 'Basic '+$rootScope.globals.currentUser.authdata;    }    $rootScope.$on('$locationChangeStart', function (event, next, current) {      console.log($location.path());      console.log('user: '+$rootScope.user);      console.log($rootScope.globals.currentUser);      if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {        $location.path('/login');      }    });    /*LoginService.currentUser().then(function(user) {      if (!user) {        $location.path('/login');      }    });*/  })