var app = angular.module("tinyurlApp");

app.controller("homeController",
  ["$scope", "$http", "$location", function($scope, $http, $location){
  $scope.submit = function(){
    $http.post("/api/v1/urls" ,{
      longUrl: $scope.longUrl
    })
      .then( function(response){
        $location.path("/urls/" + response.data.shortUrl );  // this url is not the generated short URL. It is only used to jump to a new page, which is related to the shortURL
      });
  }


}]);
