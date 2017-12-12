var app = angular.module("tinyurlApp");

app.controller("urlController",
  ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
    $http.get("/api/v1/urls/" + $routeParams.shortUrl)
      .then( function(response) {
        $scope.shortUrl = response.data.shortUrl;
        $scope.longUrl = response.data.longUrl;
        $scope.shortUrlToShow = "http://localhost:3000/" + response.data.shortUrl;
      });

    $http.get("api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
        .then( function(data){
            $scope.totalClicks = data.data;
        });
    $scope.hour = "hour";
    $scope.day = "day";
    $scope.month = "month";

    $scope.getTime = function(time){
        $scope.lineLabels = [];
        $scope.lineData = [];
        $scope.time = time;
        $scope.lineOptions = [];

        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
            .then( function(data){      // data is a set of infos,like 'referer'
                data.data.forEach( function(info) {
                    var legend = '';
                    if( time === 'hour') {
                        if( info._id.minutes < 10 ){
                            info._id.minutes = '0' + info._id.minutes;
                        }
                        legend = info._id.hour + ':' + info._id.minutes;
                    }
                    if( time === 'day') {
                        legend = info._id.hour + ':00';
                    }
                    if( time === 'month') {
                        legend = info._id.month + ':' + info._id.day;
                    }
                    $scope['lineLabels'].push(legend);
                    $scope['lineData'].push(info.count);
                });
            });

        $scope['lineOptions'] = {
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }]
                                    }
                                };
    };
    $scope.getTime('hour');   // default display when first loaded


    var renderChart = function( chart, infos ){
        $scope[chart + 'Labels'] = [];
        $scope[chart + 'Data'] = [];
        $scope['barOptions'] = [];
        $scope['baseOptions'] = [];

        var count = 0;

        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
            .then( function(data){      // data is a set of infos,like 'referer'
                data.data.forEach( function(info) {
                    $scope[chart + 'Labels'].push(info._id);
                    $scope[chart + 'Data'].push(info.count);
                });
            });
        if( chart === "bar" || chart === "base" ){
            $scope['barOptions']  = {
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true
                                                }
                                            }]
                                        }
                                    };

            $scope['baseOptions'] = {
                                        scales: {
                                            xAxes: [{
                                                ticks: {
                                                    beginAtZero: true
                                                }
                                            }]
                                        }
                                    };
        }
    }
    renderChart( "pie", "referer" );
    renderChart( "doughnut", "country" );
    renderChart( "bar", "platform" );
    renderChart( "base", "browser" );
}]);
