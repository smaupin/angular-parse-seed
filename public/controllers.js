/*
 * CONTROLLERS
 */

'use strict';

angular.module('myApp.controllers', [])
  .controller('MainCtrl', function ($rootScope, $scope) {
    // INITIALIZATION AND NAVBAR LOGIC
  })

  //POSTS
  .controller('PostsIndexCtrl', function ($scope, $http, Post) {

    // GET POSTS
    Post.query(function(data) {
      $scope.posts = data.results;
    });
    

    // CREATE POST
    $scope.createPost = function() {   
      var post = new Post($scope.post);
      post.$save(function(data) {
        Post.get({ id: data.objectId }, function(post) {
          $scope.posts.unshift(post);
          $scope.post = {};
        })
      })
    }; 

    // DELETE A POST
    $scope.deletePost = function(post, index) {
      Post.delete({ id: post.objectId }, function(data) {
        $scope.posts.splice(index, 1);
      })
    }
  });