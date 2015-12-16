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

        getHashtagTweets: function(tag) {
        	console.log("original tag", tag);
        	if (tag[0] === "#") {
        		tag = tag.replace(/[#]/, "");
        		console.log("replaced tag is:", tag);
        	}
        	var deferred = $q.defer();

        	// this sets the count for the number of tweets it's getting, but maxes out at 100 for some reason
        	var url = "/1.1/search/tweets.json?count=100&q=%23";
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
        	console.log("original input", input)
        	if (input[0] === "#") {
        		input = input.replace(/[#]/, "");
        		console.log("replaced input is:", input)
        	}
        	if (input[0] === "@") {
        		// getUserTweets(input);
        		console.log("user searched for a user");
        	} else {
        		// getHashtagTweets();
        		console.log("user entered a hashtag");
        	}
        }
    };
});

app.directive("progressBar", function ()
  {
    return {
        restrict: 'E',
        scope: {
            progress: '=',
            progressId: '@'
        },
        template: "<canvas id='pgcanvas' width='640' height='640'  background-color: #C0C0C0'/>",
        link: function(scope, element, attrs) {
           // console.log(element);
           scope.canvas = element.find('canvas')[0];
           scope.context = scope.canvas.getContext('2d');

           // adding text and colors to the canvas
           scope.context.fillStyle = "#cccccc";
           scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
           scope.context.fillStyle = "white";
           scope.context.font = "50px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("#hashtag", (scope.canvas.width / 2), (scope.canvas.height / 2));

           // adding circles to canvas bottom for data overtop
           scope.context.beginPath();
           scope.context.arc(70, 400, 120, 0, (2*Math.PI));
           scope.context.closePath();
           scope.context.fill();
           scope.context.beginPath();
           scope.context.arc(170, 500, 150, 0, (2*Math.PI));
           scope.context.closePath();
           scope.context.fill();
           scope.context.beginPath();
           scope.context.arc(260, 450, 100, 0, (2*Math.PI));
           scope.context.closePath();
           scope.context.fill();
 
           // scope.$watch('progress', function(newValue) {
           //   var barWidth = Math.ceil(newValue / 100 * scope.canvas.width);
           //   scope.context.fillStyle = "#DDD";
           //   scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
           //   scope.context.fillStyle = "#F00";
           //   scope.context.fillRect(0, 0, barWidth, scope.canvas.height);
           // });
        }        
    };
});
