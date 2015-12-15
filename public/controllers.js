/*
 * CONTROLLERS
 */

'use strict';

angular.module('myApp.controllers', [])
  .controller('MainCtrl', function ($rootScope, $scope) {
    // INITIALIZATION AND NAVBAR LOGIC
  })

  //REPORTS
  .controller('ReportsIndexCtrl', function ($scope, $http, Report) {

    // GET REPORT
    Report.query(function(data) {
      $scope.reports = data.results;
    });
    

    // CREATE REPORT
    $scope.createReport = function() {   
      var report = new Report($scope.report);
      report.$save(function(data) {
        Report.get({ id: data.objectId }, function(report) {
          $scope.reports.unshift(report);
          $scope.report = {};
        });
      });
    }; 

    // DELETE A SEARCHREPORT
    $scope.deleteReport = function(report, index) {
      Report.delete({ id: report.objectId }, function(data) {
        $scope.reports.splice(index, 1);
      });
    };
  });