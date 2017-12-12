  var app = angular.module( 'tinyurlApp',['ngRoute','ngResource', 'chart.js'] );


  app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }]);

  // 所有Angular控制的路径，前边自动加 #/;没有加#的路径，由后端处理
  app.config(function($routeProvider){
    $routeProvider
      .when("/",{
        templateUrl: "../public/views/home.html",
        controller: "homeController"
      })

      .when("/urls/:shortUrl",{
        templateUrl: "../public/views/url.html",
        controller: "urlController"
      })
      ;

  });
