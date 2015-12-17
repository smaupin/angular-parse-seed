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
  })

  .controller('TwitterController', function ($scope, $q, twitterService, Datum) {
    $scope.tweets = []; //array of tweets

    twitterService.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function(maxId) {
        twitterService.getLatestTweets(maxId).then(function(data) {
            $scope.tweets = $scope.tweets.concat(data);
        }, function() {
            $scope.rateLimitError = true;
        });
    };

    $scope.showQueryResults = function(query) {
      twitterService.getHashtagTweets(query)
      .then(function(data) {
        var tweets = twitterService.getTweetText(data);
        Datum.analyze(tweets)
        .then(function(analysis) {
          console.log("analyzed tweets");
          console.log(analysis);
          //  {"output":{"status":1,"result":"negative"}}
        });
        $scope.tweets = data.statuses;
        // console.log("showQueryResults worked");
      }, function() {
        console.log("showQueryResults error");
      })
    }

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function() {
        twitterService.connectTwitter().then(function() {
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                $('#connectButton').fadeOut(function() {
                    $('#getTimelineButton, #signOut').fadeIn();
                    $scope.refreshTimeline();
                    $scope.connectedTwitter = true;
                });
            } else {

            }
        });
    };

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function() {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        $('#getTimelineButton, #signOut').fadeOut(function() {
            $('#connectButton').fadeIn();
            $scope.$apply(function() {
                $scope.connectedTwitter = false;
            });
        });
    };

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut').show();
        $scope.connectedTwitter = true;
        // $scope.refreshTimeline();
    }
});
