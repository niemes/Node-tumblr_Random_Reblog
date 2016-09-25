//______________________________STOCHASTIQUE_BLOG_Bot___________________________
//----------------_________________RANDOM_REBLOG_____________-------------------
//______________________MADE___BY___NIEMES_____INFO =-} niemes.info_____________
// -----------------------------------------------------------------------------

var jsonfile = require('jsonfile'),
    tagFile = './tags.json',
    oldPostFile = './old_ids.json';

var tumblr = require('tumblr.js');
var client = tumblr.createClient({
    consumer_key: 'your_consumer_key',
    consumer_secret: 'your_consumer_secret',
    token: 'your_token',
    token_secret: 'your_token_secret'
});
var tagObj = {
    'tags': []
};
var old = {
    'ids': []
};

function readList() {

    jsonfile.readFile(tagFile, function(err, obj) {

        tagObj.tags = obj.tags;

        function init() {

            var postNumber = 244; // Number of Post every 24H. (250 max)
            var timeToPost = 86400000 / postNumber;

            console.log("-------- INIT --------");

            var reblogKey = [],
                postList = [],
                postIdList = [];
            // starter tag.

            function GetPostKey() {

                var randTag = Math.floor((Math.random() * tagObj.tags.length) + 1);
                var tag = tagObj.tags[randTag];

                if (tagObj.tags.length < 35000) { // ex 5000 - Size limit of the taglist
                    client.taggedPosts(tag, {
                        filter: 'html'
                    }, function(err, data) {

                        if (data !== null && data.length !== null) {

                            for (var i = 0; i < data.length; i++) {

                                if (data[i].tags !== undefined && (data[i].reblog_key !== undefined || data[i].id !== undefined)) {

                                    reblogKey.push(data[i].reblog_key);
                                    postIdList.push(data[i].id);

                                    if (data[i].tags.length !== 0) {
                                        for (var j = 0; j < data[i].tags.length; j++) {
                                            if (tagObj.tags.indexOf(data[i].tags[j]) == -1) {
                                                tagObj.tags.push(data[i].tags[j]);
                                            }
                                        } //grab some tags.
                                    }
                                }
                            }
                            if (err) {
                                console.log('TAG Problem ' + err);
                            } else {
                                console.log('Tags/Keys/Ids catched -= OK =- ');
                                jsonfile.writeFile(tagFile, tagObj, {
                                    spaces: 2
                                }, function(err) {
                                    if (err !== null) {
                                        console.log("error jsonfile writeFile error : ", err);
                                    }
                                });
                            }
                        }
                    });
                }
            }
            GetPostKey();
            setInterval(GetPostKey, 15000); // Time to grab post = id + key

            function reblogMachine() {

                jsonfile.readFile(oldPostFile, function(err, obj) {

                    old.ids = obj.ids;

                    var randKey = Math.floor((Math.random() * reblogKey.length) + 1);
                    var key = reblogKey[randKey];
                    var postId = postIdList[randKey];
                    var blogName = 'your_blog.tumblr.com';
                    var myCom = 'your_comment.'; // comment: if you want to add a comment on every rebloged-post. Leave empty if you want.
                    if (key !== undefined && postIdList.length !== 0) {
                        if (old.ids.indexOf(postId) == -1) {
                            client.reblogPost(blogName, {
                                id: postId,
                                reblog_key: key,
                                comment: myCom
                            }, function(err, data) {
                                if (err) {
                                    console.log('Reblog Problem' + err);
                                } else {
                                    old.ids.push(postId);
                                    jsonfile.writeFile(oldPostFile, old, {
                                        spaces: 2
                                    }, function(err) {
                                        if (err !== null) {
                                            console.log("jsonfile error old_ids.json writeFile : ", err);
                                        }
                                    });
                                    // --------- ERROR LOG -----------
                                    console.log('Reblog -= [OK] =- ');
                                }
                            });
                        }
                    }
                });
            }
            setInterval(reblogMachine, timeToPost);
            console.log("Time/min before every post : " + parseInt(((timeToPost / 1000) / 60)) + "mins");
        }
        init();
    });

}
readList();
