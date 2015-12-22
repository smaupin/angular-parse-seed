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

        getTweetText: function(data) {
        	var tweets = [];
        	data.statuses.forEach(function(tweet){
        		tweets.push(tweet.text);
        	});
        	return tweets;
        },

        getHashtagTweets: function(tag) {
        	// console.log("original tag", tag);
        	if (tag[0] === "#") {
        		tag = tag.replace(/[#]/, "");
        		// console.log("replaced tag is:", tag);
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
        	// console.log("original input", input);
        	if (input[0] === "#") {
        		input = input.replace(/[#]/, "");
        		// console.log("replaced input is:", input);
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

// this is the canvas image being generated on the page 
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



           var neg = 70;
           var pos = 30; 
           var neu = 0;

           var labelTag = "UFC";

           // function randomPicker () {
           //  var neg = Math.ceil(Math.random() * 100);
           //  var pos = 100-neg;
           //  var neu = Math.ceil(Math.random() * 100);
           // }

           var theR = Math.ceil((neg / 100) * 255);
           var theG = Math.ceil((pos / 100) * 255);
           var theB = Math.ceil((neu / 100) * 255);

           function componentToHex(c) {
               var hex = c.toString(16);
               return hex.length == 1 ? "0" + hex : hex;
           }

           function rgbToHex(r, g, b) {
               return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
           }

           var hexColor = rgbToHex(theR, theG, theB); // #0033ff


           var color = hexColor;

           // adding text and colors to the canvas
           scope.context.fillStyle = color;
           scope.context.fillRect(0, 0, scope.canvas.width, scope.canvas.height);
           scope.context.fillStyle = "white";
           scope.context.font = "50px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("#" + labelTag, (scope.canvas.width / 2), (scope.canvas.height / 2));
            // adding circles to the bottom of the image
           scope.context.beginPath();
           scope.context.arc(50, 400, 120, 0, (2*Math.PI));
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
           scope.context.beginPath();
           scope.context.arc(400, 530, 190, 0, (2*Math.PI));
           scope.context.closePath();
           scope.context.fill();
           scope.context.beginPath();
           scope.context.arc(530, 400, 70, 0, (2*Math.PI));
           scope.context.closePath();
           scope.context.fill();
           scope.context.beginPath();
           scope.context.arc(620, 400, 100, 0, (2*Math.PI));
           scope.context.closePath();
           scope.context.fill();
           // rectangle to fill the rest of the bottom of the canvas with white.
           scope.context.fillRect(0, 450, scope.canvas.width, 240);
           // the text of the hexcolor in the target color
           scope.context.fillStyle = color;
           scope.context.font = "25px Helvetica";
           scope.context.textAlign = "left";
           scope.context.fillText(color, 335, 370);

           // This is the graph display for the R
           var rX = 160;
           scope.context.lineWidth = 4;
           scope.context.strokeStyle = color;
           scope.context.beginPath();
           scope.context.moveTo(rX, 450);
           scope.context.lineTo(rX, 600);
           scope.context.stroke();
           // lines on the side
           scope.context.beginPath();
           scope.context.moveTo(140, 450);
           scope.context.lineTo(162, 450);
           scope.context.stroke();
           scope.context.beginPath();
           scope.context.moveTo(140, 600);
           scope.context.lineTo(162, 600);
           scope.context.stroke();
           // thinner lines down the side
           scope.context.lineWidth = 3;
           scope.context.beginPath();
           scope.context.moveTo(145, 525);
           scope.context.lineTo(rX, 525);
           scope.context.stroke();

           scope.context.lineWidth = 2;
           scope.context.beginPath();
           scope.context.moveTo(150, 487);
           scope.context.lineTo(rX, 487);
           scope.context.stroke();
           scope.context.beginPath();
           scope.context.moveTo(150, 562);
           scope.context.lineTo(rX, 562);
           scope.context.stroke();
           // the text at the top for the R and the %'s
           scope.context.font = "15px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("- Negative -", rX, 440);
           scope.context.font = "25px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("R", rX, 425);
           scope.context.font = "12px Helvetica";
           scope.context.textAlign = "right";
           scope.context.fillText("100%", 135, 455);
           scope.context.fillText("0%", 135, 605);
           // start by saving the current context (current orientation, origin)
           scope.context.save();
            
           // when we rotate we will be pinching the
           // top-left hand corner with our thumb and finger
           scope.context.translate( rX - 20, 477 );
            
           // now rotate the canvas anti-clockwise by 90 degrees
           // holding onto the translate point
           scope.context.rotate(3 * Math.PI / 2 );
            
           // specify the font and colour of the text
           scope.context.font = "14px Helvetica";
           scope.context.fillStyle = color; // red
            
           // set alignment of text at writing point (left-align)
           scope.context.textAlign = "right";
            
           // write the text
           scope.context.fillText( "of Non-Neutral", 0, 0 );
            
           // now restore the canvas flipping it back to its original orientation
           scope.context.restore();
           // The bar to the side of the graph
           scope.context.fillStyle = 'red';
           var rPercent = neg;
           var rHeight = rPercent*(1.5);
           var rStartPoint = (150 - rHeight);
           // scope.context.fillRect(165, (450 + rStartPoint), 30, rHeight);
           scope.context.lineWidth = 5;
           scope.context.strokeStyle = 'red';
           scope.context.beginPath();
           scope.context.moveTo(rX + 5, 450 + rStartPoint);
           scope.context.lineTo(rX + 35, 450 + rStartPoint);
           scope.context.stroke();
           // put the percentage on the top of the graph
           scope.context.font = "15px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText(rPercent + "%", rX + 20, 445 + rStartPoint);

           // This is the graph display for the G
           scope.context.fillStyle = color;
           var gX = 320;
           scope.context.lineWidth = 4;
           scope.context.strokeStyle = color;
           scope.context.beginPath();
           scope.context.moveTo(gX, 450);
           scope.context.lineTo(gX, 600);
           scope.context.stroke();
           // lines on the side
           scope.context.beginPath();
           scope.context.moveTo(300, 450);
           scope.context.lineTo(322, 450);
           scope.context.stroke();
           scope.context.beginPath();
           scope.context.moveTo(300, 600);
           scope.context.lineTo(322, 600);
           scope.context.stroke();
           // thinner lines down the side
           scope.context.lineWidth = 3;
           scope.context.beginPath();
           scope.context.moveTo(305, 525);
           scope.context.lineTo(gX, 525);
           scope.context.stroke();

           scope.context.lineWidth = 2;
           scope.context.beginPath();
           scope.context.moveTo(310, 487);
           scope.context.lineTo(gX, 487);
           scope.context.stroke();
           scope.context.beginPath();
           scope.context.moveTo(310, 562);
           scope.context.lineTo(gX, 562);
           scope.context.stroke();
           // the text at the top for the R and the %'s
           scope.context.font = "15px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("+ Positive +", gX, 440);
           scope.context.font = "25px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("G", gX, 425);
           scope.context.font = "12px Helvetica";
           scope.context.textAlign = "right";
           scope.context.fillText("100%", 295, 455);
           scope.context.fillText("0%", 295, 605);
           // label on the side of the graph
           // start by saving the current context (current orientation, origin)
           scope.context.save();
            
           // when we rotate we will be pinching the
           // top-left hand corner with our thumb and finger
           scope.context.translate( gX - 20, 525 );
            
           // now rotate the canvas anti-clockwise by 90 degrees
           // holding onto the translate point
           scope.context.rotate(3 * Math.PI / 2 );
            
           // specify the font and colour of the text
           scope.context.font = "14px Helvetica";
           scope.context.fillStyle = color; // red
            
           // set alignment of text at writing point (left-align)
           scope.context.textAlign = "center";
            
           // write the text
           scope.context.fillText( "of Non-Neutral", 0, 0 );
            
           // now restore the canvas flipping it back to its original orientation
           scope.context.restore();


           // The bar to the side of the graph
           scope.context.fillStyle = 'green';
           var gPercent = pos;
           var gHeight = gPercent*(1.5);
           var gStartPoint = (150 - gHeight);
           // scope.context.fillRect(325, (450 + gStartPoint), 30, gHeight);
           scope.context.lineWidth = 5;
           scope.context.strokeStyle = 'green';
           scope.context.beginPath();
           scope.context.moveTo(gX + 5, 450 + gStartPoint);
           scope.context.lineTo(gX + 35, 450 + gStartPoint);
           scope.context.stroke();
           // put the percentage on the top of the graph
           scope.context.font = "15px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText(gPercent + "%", gX + 20, 445 + gStartPoint);

           // This is the graph display for the B
           scope.context.fillStyle = color;
           var bX = 480;
           scope.context.lineWidth = 4;
           scope.context.strokeStyle = color;
           scope.context.beginPath();
           scope.context.moveTo(bX, 450);
           scope.context.lineTo(bX, 600);
           scope.context.stroke();
           // lines on the side
           scope.context.beginPath();
           scope.context.moveTo(460, 450);
           scope.context.lineTo(482, 450);
           scope.context.stroke();
           scope.context.beginPath();
           scope.context.moveTo(460, 600);
           scope.context.lineTo(482, 600);
           scope.context.stroke();
           // thinner lines down the side
           scope.context.lineWidth = 3;
           scope.context.beginPath();
           scope.context.moveTo(465, 525);
           scope.context.lineTo(bX, 525);
           scope.context.stroke();

           scope.context.lineWidth = 2;
           scope.context.beginPath();
           scope.context.moveTo(470, 487);
           scope.context.lineTo(bX, 487);
           scope.context.stroke();
           scope.context.beginPath();
           scope.context.moveTo(470, 562);
           scope.context.lineTo(bX, 562);
           scope.context.stroke();
           // the text at the top for the B and the %'s
           scope.context.font = "15px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("¯\\_Neutral_/¯", bX, 440);
           scope.context.font = "25px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText("B", bX, 425);
           scope.context.font = "12px Helvetica";
           scope.context.textAlign = "right";
           scope.context.fillText("100%", 455, 455);
           scope.context.fillText("0%", 455, 605);
           // start by saving the current context (current orientation, origin)
           scope.context.save();
            
           // when we rotate we will be pinching the
           // top-left hand corner with our thumb and finger
           scope.context.translate( bX - 20, 525 );
            
           // now rotate the canvas anti-clockwise by 90 degrees
           // holding onto the translate point
           scope.context.rotate(3 * Math.PI / 2 );
            
           // specify the font and colour of the text
           scope.context.font = "14px Helvetica";
           scope.context.fillStyle = color; // red
            
           // set alignment of text at writing point (left-align)
           scope.context.textAlign = "center";
            
           // write the text
           scope.context.fillText( "of All", 0, 0 );
            
           // now restore the canvas flipping it back to its original orientation
           scope.context.restore();
           // The bar to the side of the graph
           scope.context.fillStyle = 'blue';
           var bPercent = neu;
           var bHeight = bPercent*(1.5);
           var bStartPoint = (150 - bHeight);
           // scope.context.fillRect(485, (450 + bStartPoint), 30, bHeight);
           scope.context.lineWidth = 5;
           scope.context.strokeStyle = 'blue';
           scope.context.beginPath();
           scope.context.moveTo(bX + 5, 450 + bStartPoint);
           scope.context.lineTo(bX + 35, 450 + bStartPoint);
           scope.context.stroke();
           // put the percentage on the top of the graph
           scope.context.font = "15px Helvetica";
           scope.context.textAlign = "center";
           scope.context.fillText(bPercent + "%", bX + 20, 445 + bStartPoint);
           


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

// this posts tweets to datum for sentiment analysis
app.factory("Datum", function ($http) {
	var factory = {};
	factory.analyze = function (data) {
		// console.log("analyze function firing", data);
		return $http.post("/api/analyze", data);
	};
	return factory;
});


