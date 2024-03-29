// app/assets/javascripts/app/controllers/GroupCtrl.js

'use strict';

angular.module('myapp.controllers')
  .controller('GroupController',
    function($scope, GroupService, $q, LoginService, $location, $rootScope) {
      $scope.Math = window.Math;
      GroupService.groups().then(function(groups) {
        $scope.groups = [];
        for (var group in groups) {
          $scope.groups.push(groups[group]._id);
        }
      });

      $scope.add_group = function (id) {
        GroupService.add_group(id).then(function (res) {
          $scope.groups.push(id);
        });
      }
      $scope.remove_group = function (id) {
        if (confirm("Are you sure you want to delete "+id+" as a group?")) {
          GroupService.remove_group(id).then(function (res) {
            console.log("remove_group");
            $scope.groups.splice($scope.groups.indexOf(id),1);
          });
        }
      }
      $scope.firstContainsSecond = function (str, substr) {
        console.log(str);
        return str.includes(substr);
      }
      $scope.search = "";

      $scope.searchPatientsInGroup = function (group) {
        $rootScope.globals.search = group;
        $location.path('/patients');
      }
  });