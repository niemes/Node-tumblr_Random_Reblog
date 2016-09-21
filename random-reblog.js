//______________________________STOCHASTIQUE_BLOG_Bot___________________________
//----------------_________________RANDOM_REBLOG_____________-------------------
//______________________MADE___BY___NIEMES_____INFO =-} niemes.info_____________
// -----------------------------------------------------------------------------
//-----------------------Authenticate Tumblr via OAuth--------------------------
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
    consumer_key: 'your_consumer_key',
    consumer_secret: 'your_consumer_secret',
    token: 'your_token',
    token_secret: 'your_token_secret'
});

function init() {
    var postNumber = 178; // Number of Post every 24H. (250 max)
    var timeToPost = 86400000 / postNumber;

    console.log("-------- INIT --------");
    var reblogKey = [],
        postList = [],
        postIdList = [];
    var tagList = ['design', 'moma', 'lol', 'geek', 'selfie', 'landscape', 'gif', 'illustration', 'embroidery', 'art', 'Architecture', 'streetart', 'PHOTOGRAPHY', 'URBAN', 'GRUNGE', 'ABANDONED', 'aesthetic', 'war', 'peace'];
    // starter tag.

    function GetPostKey() {

        var randTag = Math.floor((Math.random() * tagList.length) + 1);
        var tag = tagList[randTag];

        if (tagList.length < 5000) { // ex 5000 - Size limit of the taglist

            client.taggedPosts(tag, {
                filter: 'html'
            }, function(err, data) {
                if (data !== undefined) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].tags !== undefined && (data[i].reblog_key !== undefined || data[i].id !== undefined)) {
                            reblogKey.push(data[i].reblog_key);
                            postIdList.push(data[i].id);
                            if (tagList.indexOf(data[i].tags) == -1) { //check tagList.
                                tagList.push(data[i].tags); //grab some tags.
                            }
                        }
                    }
                    if (err) {
                        console.log('TAG PROBLEM ' + err);
                    } else {
                        console.log('Tags/Keys/Ids catched -= OK =- ');
                    }
                }
            });
        }
    }
    GetPostKey();
    setInterval(GetPostKey, 280000); // Time to grab post = id + key
    function reblogMachine() {

        var randKey = Math.floor((Math.random() * reblogKey.length) + 1);
        var key = reblogKey[randKey];
        var postId = postIdList[randKey];
        var blogName = 'your_tumblr.tumblr.com';
        var myCom = 'A simple comment'; // comment: if you want to add a comment on every rebloged-post. Leave empty if you want.
        if (key !== undefined && postIdList.length !== 0) {
            if (postList.indexOf(postId) == -1) {
                client.reblogPost(blogName, {
                    id: postId,
                    reblog_key: key,
                    comment: myCom
                }, function(err, data) {
                    if (err) {
                        console.log('REBLOG ERROR : ' + err);
                    } else {
                        postList.push(postId);
                        // --------- ERROR LOG -----------
                        console.log('Reblog -= [OK] =- ' + data);
                    }
                });
            }
        }
    }
    setInterval(reblogMachine, timeToPost); // time for reblog 1000 = 1s (max 250 reblog/day)
    console.log("Time/min before every post : " + ((timeToPost / 1000) / 60));
}

init();
