/*
 * INTERCEPTORS
 */

'use strict';

var app = angular.module('myApp.interceptors', []);

// app.factory('authInterceptor', function ($rootScope, $q, $window) {
//   return {
//     request: function (config) {
//       config.headers = config.headers || {};
//       if ($window.localStorage.jwtToken) {
//         config.headers.Authorization = 'Bearer ' + $window.localStorage.jwtToken;
//       }
//       return config;
//     },
//     response: function (response) {
//       if (response.status === 401) {
//         // handle the case where the user is not authenticated
//       }
//       return response || $q.when(response);
//     }
//   };
// })

app.factory('parseInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers['X-Parse-Application-Id'] = 'JrC7tEcVEZpJwPgGdEBmRokLG1vv1MAnfdJhkx9V';
      config.headers['X-Parse-REST-API-Key'] = 'NfRdeQRSOdVJAkLIM4BjAQ1ekZcpuZYbH0GF4SgQ';

      return config;
    },
    response: function (response) {
      return response || $q.when(response);
    }
  };
})

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('parseInterceptor');
});