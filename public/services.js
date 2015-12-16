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

app.factory('twitterService', function($q) {
    var authorizationResult = false;

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('xF6uWXMSxdy-VEuoDIwNZu0b5Pg', {
                cache: true
            });
            //try to create an authorization result when the page loads,
            // this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create("twitter");
        },
        isReady: function() {
            return (authorizationResult);
        },
        connectTwitter: function() {
            var deferred = $q.defer();
            OAuth.popup("twitter", {
                cache: true
            }, function(error, result) {
                // cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else {
                    //do something if there's an error

                }
            });
            return deferred.promise;
        },
        clearCache: function() {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },
        getLatestTweets: function(maxId) {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var url = '/1.1/statuses/home_timeline.json';
            if (maxId) {
                url += '?max_id=' + maxId;
            }
            var promise = authorizationResult.get(url).done(function(data) {
                // https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                // when the data is retrieved resolve the deferred object
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            });
            //return the promise of the deferred object
            return deferred.promise;
        },
        getUserTweets: function(query) {
        	
        },
        getHashtagTweets: function(tag) {
        	var deferred = $q.defer();
        	var url = "/1.1/search/tweets.json?q=%23";
        	url += tag;

        	var promise = authorizationResult.get(url).done(function(data) {
                // https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                // when the data is retrieved resolve the deferred object
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            });
            //return the promise of the deferred object
            return deferred.promise;
        },
        determineQuery: function(input) {
        	if (input[0] === "@") {
        		// getUserTweets(input);
        		console.log("user searched for a user")
        	} else {
        		// getHashtagTweets();
        		console.log("user entered a hashtag")
        	}
        }
    };
});
