var app = angular.module('articleApp', ['ngRoute', 'ngResource']);

// Configure router to open different HTMLs based on path
// Implement a SPA
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'articleController'
        })
        .when('/about', {
            templateUrl: 'about.html'
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'authController'
        })
        .when('/signin', {
            templateUrl: 'signin.html',
            controller: 'authController'
        })
});

// Create a factory of services to get all articles from Mongo DB (routes/api.js)
app.factory('articleService', function($resource) {
    return $resource('/api/articles');
});

app.controller('articleController', function($scope, articleService) {
    // Create an articles array to store all articles
    $scope.articles = [];

    // Call articleservice and show all articles
    $scope.articles = articleService.query();

    // Call Post service (routes/ api.js) and show information
    $scope.post = function() {
        $scope.newArticle.timeStamp = Date.now(); // Use the current date/time while inserting record
        
        articleService.save($scope.newArticle, function(res){
            $scope.articles = articleService.query();   // Get all articles
            // Reset values on screen for user
            $scope.newArticle = {userName: '', title: '', text: '', timeStamp:''};
        });
    }
});

// For Authentication pages (Signin/ Signup)
app.controller('authController', function($scope) {
    $scope.user = {userName: '', password: ''};
    $scope.msg = '';

    $scope.signin = function() {
        $scope.msg = 'Sign in request received for user : ' + $scope.user.userName;
    };

    $scope.signup = function() {
        $scope.msg = 'Sign up request received for user : ' + $scope.user.userName;
    };
});