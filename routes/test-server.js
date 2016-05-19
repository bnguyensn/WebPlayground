var express = require('express');
var router = express.Router();
var fs = require("fs");

router.get('/', function(req, res, next) {

    var qry = req.query.q.split('').sort();

    var aTrie;
    var posAng = {};

    var maxWL = 0; // Max possible word length to filter out "impossible" word combinations
    var finalRes = [];

    fs.readFile('tmp/enable1-ang.json', "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }

        //wordListProcess(JSON.parse(data));
        //createTrie(aTrie, wordList);
        //loadTrie(aTrie);

        aTrie = require('../tmp/enable1-trie.json');
        console.log("Total brE: " + countBrEs(aTrie));

        rcvPosAng(qry, aTrie, []);
        //posAng = removeUnique(posAng);
        //console.log("Found " + posAng.length + " possible anagrams for " + qry.join(""));
        var str = "";
        Object.keys(posAng).forEach(function (key) {
            str += key + "; "
        });
        console.log("posAng's keys: " + str);

        // Find all possible word combinations e.g. [5], [4, 1], ... (Note these are sorted descending).
        var wordCombs = [];
        findIntComb(wordCombs, qry.length);
        console.log('Found ' + wordCombs.length + ' different ways to make up the sum: ' + wordCombs.join(" | "));

        /* Filter out "impossible" word combinations i.e.
         - Words that are too long / short. */
        var wordCombsFltd = [];
        for (var i = wordCombs.length; i--;) {

            if (wordCombs[i][0] <= maxWL) {
                wordCombsFltd.push(wordCombs[i]);
            } else {
                break;
            }
        }
        console.log("Total possible word combinations after filtering: " + wordCombsFltd.join(" | "));

        // Loop through each word combination.
        for (var j = 0; j < wordCombsFltd.length; j++) {
            if (wordCombsFltd[j].length == 1) {
                // There is only 1 case where this could happen. Consider optimising this.

            } else {
                findMAng(wordCombsFltd[j], 0, 0, [], qry);
            }
        }

        // Finally, return result
        console.log('Total multi-word anagrams found: ' + finalRes.length);
    });

    function findMAng(wComb, wCombPos, startPos, curAng, lPool) {
        var setLen = wComb[wCombPos];

        // Loop through each word in the word set.
        for (var i = startPos; i < posAng[setLen].length; i++) {
            var word = posAng[setLen][i].split('');
            var newLPool = lPool.slice();

            /* Verify that the word can be added to the anagram by checking if lPool contains every letter word[n]
            in word. Quit the loop as soon as the check fails. */
            var str = '';
            for (var n = 0; n < word.length; n++) {
                var indexOfN = newLPool.indexOf(word[n]);
                if (indexOfN >= 0) {
                    newLPool.splice(indexOfN, 1);
                    str += word[n];
                } else { break;}
            }

            /* Check if a word is to be added, add it, then recurse to next set,
            unless if there is no next set, then push the anagram to the final result. */
            if (str.split('').length == setLen) {
                curAng.push(str);
                var newStartPos = 0;

                // If the next word set is similar to this word set, we only need to loop from i onwards.
                if (wCombPos > 0 && wComb[wCombPos] == wComb[wCombPos + 1]) { newStartPos = i; }
                if (wCombPos < wComb.length) {
                    findMAng(wComb, wCombPos + 1, newStartPos, curAng, newLPool);
                } else {
                    finalRes.push(curAng.join(''));
                }
            }
        }
    }
    // Debug function (count number of "words" in the trie)
    function countBrEs(node) {
        var countBrE = 0;
        var tNode = node;
        Object.keys(tNode.br).forEach(function(key) {
            if (tNode.br[key].brE) {
                countBrE += 1;
            }
            countBrE += countBrEs(tNode.br[key]);
        });
        return countBrE;
    }

    function rcvPosAng(lPool, trie, cur) {
        var curNode = trie;
        for (var i = 0; i < lPool.length; i++) {
            if ('undefined' !== typeof curNode.br[lPool[i]]) {
                //console.log('Found a key that matches a letter in the letter pool');
                var newCur = cur.slice();
                newCur.push(lPool[i]);

                // Is it a word? -> Add to posAng | Also check word length
                if (curNode.br[lPool[i]].brE) {

                    if ('undefined' !== typeof posAng[newCur.length]) {
                        posAng[newCur.length].push(newCur.join(""));
                    } else {
                        posAng[newCur.length] = [newCur.join("")];
                    }


                    //posAng.push(newCur.join(""));
                    if (maxWL < newCur.length) {
                        maxWL = newCur.length;
                        console.log("New long word: " + newCur.join(""));
                    }
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

    // Find unique combinations of integers that add up to a sum, ignoring certain combinations.
    function findIntComb(res, rem, cur) {
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
                findIntComb(res, rem - i, newArr);
            }
        }
    }

    // Remove unique items from array
    function removeUnique(arr) {
        return Array.from(new Set(arr));
    }

    // Load the "word" list to create the trie
    // Obsolete now that we load a pre-rendered trie
    /*
    var wordList = [];
    function wordListProcess(obj) {
        Object.keys(obj).forEach(function(key) { wordList.push(key); });
        console.log("Created wordList with length = " + wordList.length);
    }
    */

    // Load the pre-rendered trie
    // Obsolete now that we can just use require('...')
    /*
    function loadTrie(trie) {
        fs.readFile('tmp/enable1-trie.json', 'utf8', function(err, data) {
            if (err) { return console.log(err); }
            trie = JSON.parse(data);
            console.log('Total brE = ' + countBrEs(trie));
        });
    }
    */

    // The TNode object, used to generate the trie
    // Obsolete now that we load a pre-rendered trie
    /*
    function TNode(branchEnd) {
        this.brE = branchEnd;
        this.br = {};

        this.addBr = function(str) {
            var letters = str.split("");
            var tNode = this;
            var i;
            for (i = 0; i < letters.length; i++) {
                if (!(tNode.br.hasOwnProperty(letters[i]))) {
                    tNode.br[letters[i]] = new TNode(i == letters.length - 1);
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
    */

    // Create the trie (done)
    /*
    function createTrie(trie, wordList) {
        trie = new TNode(false);
        var i;
        for (i = 0; i < wordList.length; i++) {
            trie.addBr(wordList[i]);
        }
        console.log("Number of words in trie: " + trie.countBrE());

        fs.writeFile('tmp/enable1-trie.json', JSON.stringify(trie, null, 4), function(err) {
            if (err) { return console.log(err); }
            console.log("JSON saved!");
        });
    }
    */

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
     //writeDict(aDict, 'tmp/enable1-trie.json');

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