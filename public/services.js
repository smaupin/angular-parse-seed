/*
 * SERVICES
 */


'use strict';

var app = angular.module('myApp.services', []);

app.factory('Report', function ($resource) {
  var url = "https://api.parse.com/1";
  return $resource(url + '/classes/Report/:id', {id:'@id'}, {
    query: { isArray: false }
  });
});
