var app = angular.module("testApp", []);

app.controller("testCtrl", function($scope, $http) {
    

    $scope.btnClick = function() {
        var rand = 7;
        $scope.statusDisplay = "Sum components for " + rand + ": " + findD2(rand).toString();
    };




    var res = {};
    function findPI(number) {
        for (var i = number; i > 0; i--) {
            res[i] = [];


        }
    }

    function findD2(sum) {  // sum = integer only
        var res = [];
        for (var i = sum - 1; i >= sum / 2; i--) {
            res.push([i, sum - i]);
        }
        return res;
    }

});