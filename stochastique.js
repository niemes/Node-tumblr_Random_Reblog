//______________________________STOCHASTIQUE_BLOG_______________________________
//
//______________________MADE___BY___NIEMES_____INFO =-} niemes.info_____________
// -----------------------------------------------------------------------------
var jsonfile = require('jsonfile'),
    tagFile = './tags.json',
    oldPostFile = './old_ids.json';

var tumblr = require('tumblr.js');
var client = tumblr.createClient({
    consumer_key: '0tCOeHnQ4hXpr5rV3yXkM0ZMOuwuP69hTmYBqCl1RenIcrhzgD',
    consumer_secret: '6ohKGU61xOeChsRDuAJ27KYziVwONY2kSxEyvX2AHjJr8lHHMa',
    token: '6wNn5poHKW2rZbOD7H0GYJyyNhEPADTqGfALUkGIPeTS98PYXy',
    token_secret: 'legcynUDRj3v82I2mJg7RpCTesBVEnd8vbnL1P54J3In21Pc2L'
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
        console.log("Json tagList - taille original : ", tagObj.tags.length);

        function init() {

            var postNumber = 250; // Number of Post every 24H. (250 max)
            var timeToPost = 86400000 / postNumber;

            console.log("-------- INIT --------");

            var reblogKey = [];
            var postList = [];
            var postIdList = [];
            // starter tag.

            function GetPostKey() {

                var randTag = Math.floor((Math.random() * tagObj.tags.length) + 1);
                var tag = tagObj.tags[randTag];
                console.log(tag);

                client.taggedPosts(tag, {
                    filter: 'html'
                }, function(err, data) {

                    if (data !== null && data.length !== null) {

                        for (var i = 0; i < data.length; i++) {

                            if (data[i].tags !== undefined && (data[i].reblog_key !== undefined || data[i].id !== undefined)) {

                                reblogKey.push(data[i].reblog_key);
                                postIdList.push(data[i].id);

                                if (tagObj.tags.length < 35000) { // ex 5000 - Size limit of the taglist
                                    if (data[i].tags.length !== 0) {
                                        for (var j = 0; j < data[i].tags.length; j++) {
                                            if (tagObj.tags.indexOf(data[i].tags[j]) == -1) {
                                                tagObj.tags.push(data[i].tags[j]);
                                            }
                                        } //grab some tags.
                                    }
                                }
                            }
                        }
                        if (err) {
                            console.log('TAG PROBLEM ' + err);
                        } else {
                            console.log('Tags/Keys/Ids catched -= OK =- ');
                            jsonfile.writeFile(tagFile, tagObj, {
                                spaces: 2
                            }, function(err) {
                                if (err !== null) {
                                    console.log("erreur json writeFile erreur : ", err);
                                }
                            });
                        }
                    }
                });

            }
            GetPostKey();
            setInterval(GetPostKey, 30000); // Time to grab post = id + key

            function reblogMachine() {
                jsonfile.readFile(oldPostFile, function(err, obj) {

                    old.ids = obj.ids;

                    var randKey = Math.floor((Math.random() * reblogKey.length) + 1);
                    var key = reblogKey[randKey];
                    var postId = postIdList[randKey];
                    var blogName = 'stochastique-blog.tumblr.com';
                    var commentaires = ['Experiment - Automatic Random_Reblog - Ask me !', "I dont Understand...", "Why ?!", 'Dont do that', 'Okay, this is interesting', 'Lol', 'Why Not...', 'You can be someone else', 'Cool', 'I can do Better', 'sharing something like this...', 'Weird', 'Usefull Stuff', 'hmm...', 'Tell me what you want ! What you really really want', 'True', 'false', 'Here we go', 'Love me', 'Love you', 'Insert Random Comments', 'Im Human', 'This is your god', 'Love is all'];
                    var myCom = commentaires[Math.floor((Math.random() * commentaires.length))]; // comment: if you want to add a comment on every rebloged-post. Leave empty if you want.

                    if (key !== undefined && postIdList.length !== 0) {
                        if (old.ids.indexOf(postId) == -1) {
                            client.reblogPost(blogName, {
                                id: postId,
                                reblog_key: key,
                                comment: myCom
                            }, function(err, data) {
                                if (err) {
                                    console.log('REBLOG PROBLEM ' + err);
                                } else {
                                    old.ids.push(postId);
                                    jsonfile.writeFile(oldPostFile, old, {
                                        spaces: 2
                                    }, function(err) {
                                        if (err !== null) {
                                            console.log("erreur json old_ids.json writeFile : ", err);
                                        }
                                    });
                                    // --------- ERROR LOG -----------
                                    console.log('Reblog -= [OK] =- ');
                                }
                            });
                        } else {
                            reblogMachine();
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
