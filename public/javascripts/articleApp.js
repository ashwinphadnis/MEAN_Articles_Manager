var app = angular.module('articleApp', 
    ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
        // $rootScope is a global object created to store the authentication and current user name
        // Initializing the variables
        $rootScope.authenticated = false;
        $rootScope.currentUser = 'Guest';

        // The variables shall be reset during logout
        $rootScope.signout = function() {
            $http.get('auth/signout');
            $rootScope.authenticated = false;
            $rootScope.currentUser = 'Guest';
        }
})

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
            $scope.newArticle = {username: '', title: '', text: '', timeStamp:''};
        });
    }
});

// For Authentication pages (Signin/ Signup)
app.controller('authController', function($scope, $http, $location, $rootScope) {
    $scope.user = {username: '', password: ''};
    $scope.msg = '';

    $scope.signin = function() {
        $http.post('/auth/signin', $scope.user).success(function(res) {
            if (res.state == 'success') {   // If successful login, redirect to article page (root)
                $rootScope.authenticated = true;    // Set global variable to authenticated
                $rootScope.currentUser = res.user.username; // Set global variable with user name
                $location.path('/');
            }
            else {
                $scope.msg = res.message;
            }
        });
    };

    $scope.signup = function() {
        $http.post('/auth/signup', $scope.user).success(function(res) {
            if(res.state == 'success') {    // If signup successful, redirect to article page (root)
                $rootScope.authenticated = true;    // Set global variable to authenticated
                $rootScope.currentUser = res.user.username; // Set global variable with user name
                $location.path('/');
            }
            else {
                $scope.msg = res.message;
            }
        });
    };
});