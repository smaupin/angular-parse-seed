/*
 * SERVICES
 */


'use strict';

var app = angular.module('myApp.services', []);

app.factory('Post', function ($resource) {
  var url = "https://api.parse.com/1";
  return $resource(url + '/classes/Post/:id', {id:'@id'}, {
    query: {isArray: false}
  });
})