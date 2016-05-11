var express = require('express');
var router = express.Router();
var fs = require("fs");


router.get('/', function(req, res, next) {

    var qry = req.query.q.split("").sort();

    // The "word" list & trie
    var wordList = [];
    var aTrie = new TNode("", false, {});
    var posAng = [];

    initAll();

    function initAll() {
        fs.readFile('tmp/enable1-ang.json', "utf8", function(err, data) {
            if (err) { return console.log(err); }
            wordListProcess(JSON.parse(data));
            createTrie(aTrie, wordList);
            rcvPosAng(qry, aTrie, []);
            console.log("Found " + posAng.length + " possible anagrams for " + qry.join(""));
        });
    }

    function wordListProcess(obj) {
        Object.keys(obj).forEach(function(key) { wordList.push(key); });
        console.log("Created wordList with length = " + wordList.length);
    }

    // The trie node object
    function TNode(letter, branchEnd, parent) {
        this.l = letter;
        this.brE = branchEnd;
        this.p = parent;
        this.br = {};

        this.addBr = function(str) {
            var letters = str.split("");
            var tNode = this;
            var i;
            for (i = 0; i < letters.length; i++) {
                if (!(tNode.br.hasOwnProperty(letters[i]))) {
                    tNode.br[letters[i]] = new TNode(letters[i], i == letters.length - 1, tNode);
                } else if (i == letters.length - 1) {
                    tNode.br[letters[i]].brE = true;
                }
                tNode = tNode.br[letters[i]];
            }
        };

        this.countBrE = function() {
            var count = 0;
            var tNode = this;
            Object.keys(tNode.br).forEach(function(key) {
                if (tNode.br[key].brE) {
                    count += 1;
                }
                count += tNode.br[key].countBrE();
            });
            return count;
        };
    }

    function createTrie(trie, wordList) {
        var i;
        for (i = 0; i < wordList.length; i++) {
            trie.addBr(wordList[i]);
        }
        console.log("Number of words in trie: " + trie.countBrE());
    }

    function rcvPosAng(lPool, trie, cur) {
        var curNode = trie;
        for (var i = 0; i < lPool.length; i++) {
            if ('undefined' !== typeof curNode.br[lPool[i]]) {
                //console.log('Found a key that matches a letter in the letter pool');
                var newCur = cur.slice();
                newCur.push(lPool[i]);

                // Is it a word? -> Add to posAng
                if (curNode.br[lPool[i]].brE) {
                    posAng.push(newCur.join(""));
                    //console.log("Pushed " + newCur.join("") + " to posAng.")
                }

                var newLP = lPool.slice();
                newLP.splice(i, 1);
                if (newLP.length > 0) {
                    //console.log("Calling rcv: newLP="+newLP+"; newCur="+newCur);
                    rcvPosAng(newLP, curNode.br[lPool[i]], newCur);
                }

            }
        }
    }

    // Find unique combination of integers that add up to a sum
    var resD = []; var count = 0;
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
            resD.push(cur);
        } else {
            for (var i = Math.min(nJP, rem); i >= 1; i--) {
                var newArr = cur.slice();
                newArr.push(i);
                // Recurse:
                findD(rem - i,newArr);
            }
        }
    }

    // Create the .json dictionary (done)
    /*
     //createADict(dfPath);
    function createADict(path) {
        fs.readFile(path, "utf8", function(err, data) {

            if (err) {
                return console.log(err);
            }

            var aDict = {};
            initDict(aDict, data.split(/\r?\n/));
            //writeDict(aDict, 'tmp/tmp.json');

            // Create object
            function initDict(dict, wordList) {
                var wCount = 0, aCount = 0;
                for (var i = 0; i < wordList.length; i++) {
                    var newWord = wordList[i].split("").sort().join("");
                    if ('undefined' !== typeof dict[newWord]) {
                        dict[newWord].push(wordList[i]);
                    } else {
                        dict[newWord] = [wordList[i]];
                        aCount += 1;
                    }
                    wCount += 1;
                }
                console.log("Number of words iterated: " + wCount);
                console.log("Number of anagram entries: " + aCount);
            }

            // Write .json
            function writeDict(dict, path) {
                fs.writeFile(path, JSON.stringify(dict, null, 4), function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("JSON saved to " + path);
                    }
                })
            }
        });
    }
    */
});

module.exports = router;
