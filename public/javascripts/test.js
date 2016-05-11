var app = angular.module("testApp", []);

app.controller("testCtrl", function($scope, $http) {

    $scope.btnClick = function() {
        console.log("Hello wordl");
        findD(18);
        $scope.statusDisplay = "Total function calls: " + count
            + "\nTotal unique instances: " + res.length;
    };

    var res = []; var count = 0;
    function findD(rem, cur) {
        count += 1;
        var nJP;
        if (cur == null) {
            cur = [];
            nJP = rem;
        } else {
            nJP = cur[cur.length - 1];
        }
        if (rem == 0) {
            res.push(cur);
        } else {
            for (var i = Math.min(nJP, rem); i >= 1; i--) {
                var newArr = cur.slice();
                newArr.push(i);
                // Recurse:
                findD(rem - i,newArr);
            }
        }
    }

    function sumArr(arr) {
        return arr.reduce(function(pV, cV) {return pV + cV});
    }

});