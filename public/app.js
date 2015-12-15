/*
 * ANGULAR APP.JS
 */

'use strict';

angular.module('myApp', ['ui.router',
                         'ngResource',
                         'myApp.services',
                         'myApp.interceptors',
                         'myApp.controllers'])
  
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('reports', {
        url: "/",
        templateUrl: 'templates/reports-index.html',
        controller: 'ReportsIndexCtrl'
      });

    $urlRouterProvider.otherwise("/");

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
  });
