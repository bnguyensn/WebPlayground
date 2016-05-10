var app = angular.module("testApp", []);

app.controller("testCtrl", function($scope, $http) {
    
    var count = 0;
    $scope.btnClick = function() {
        count += 1;
        $scope.statusDisplay = "Count = " + count;
    };

    // Find unique permutations of integer
    function NNode(number, chainEnd) {
        this.n = number;
        this.e = chainEnd;
        this.v = {};

        this.branchOut = function(n) {
            var nNode = this;
            if (n > 1) {
                var newN = n - 1;
                nNode.v["1"] = new NNode(1, false);
                nNode.v[newN] = new NNode(newN, true);
                nNode.v[newN].branchOut(newN);
            }
        }
    }
    
});