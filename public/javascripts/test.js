var app = angular.module("testApp", []);

app.controller("testCtrl", function($scope, $http) {
    
    $scope.textField = "marbles";
    
    $scope.btnClick = function() {
        // Do something
        $http.get('/test-server?f=&q=' + $scope.textField).then(function(res) {
            
        }, function(res) {
            $scope.statusDisplay = res.statusText;
        });
    };

    
});