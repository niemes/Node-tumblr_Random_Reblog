/**  
 * Stochastique-Blog Reblog Bot.  
 * @author Niemes.info
 * @version 1.0.0
 * @example  
 * Simple automatic random post reblog bot.
 */

import secrets from './secrets'
import tumblr = require('tumblr.js');

const client = tumblr.createClient({
    consumer_key: secrets.consumer_key,
    consumer_secret: secrets.consumer_secret,
    token: secrets.token,
    token_secret: secrets.token_secret
});

interface Comments {
    positive: string[];
    neutral: string[];
    negative: string[];
}

type Post = {
    id: string,
    key: string
}

type AppConfig = {
    verbose: Boolean,
    postNumber: number // Number of Post every 24H. (250 max,
    timeToPost: number;
    maxTags: number,
    tags: string[],
    posts: Array<Post>,
    posted: string[],
    blogName: string,
    comsType: string[],
    comments: Comments,
};

const config: AppConfig = {
    verbose: true,
    postNumber: 250, // Number of Post every 24H. (250 max,
    maxTags: 100000,
    timeToPost: 0,
    tags: ["abstract", "creative", "beautiful", "anonymous", "love", ""],
    posts: [],
    posted: [],
    blogName: 'stochastique-blog.tumblr.com',
    comsType: ["positive", "neutral", "negative"],
    comments: {
        positive: [
            'Usefull Stuff', 'Okay, this is interesting', 'Cool', 'Love you',
            'Tell me what you want ! What you really really want', 'True', 'Love is all',
        ],
        neutral: [
            'Experiment - Automatic Random_Reblog - Ask me !',
            "Why ?!", 'hmm...', 'False', 'Here we go', 'Im Human'
        ],
        negative: [
            'You can be someone else', "I dont Understand...", 'Weird', 'Love me',
            'I can do Better', 'Dont do that', 'sharing something like this...',
            'This is your god'
        ]
    }
}
config.timeToPost = 86400000 / config.postNumber
console.log("Time/min before every post : ", (config.timeToPost / 1000) / 60, "mins");

/**  
 * @type function to get list of post and their respective keys.   
 */
function grabPosts(): Promise<Array<object> | Object> {
    var randTag = Math.floor((Math.random() * config.tags.length) + 1);
    var tag = config.tags[randTag];

    return new Promise((resolve, reject) => {
        client.taggedPosts(tag, { filter: 'html' }, function (err: Object, posts: Array<object>) {
            if (!err && posts && posts.length > 0) resolve(posts)
            else reject(err)
        });
    })
}

/**  
 * @type function to get key of post to reblog.   
 */
async function GetPostKey(): Promise<boolean | Object> {

    return new Promise(async (resolve, reject) => {
        await grabPosts().then((posts: any) => {

            posts.forEach((elem: any) => {

                let tags: Array<string> = elem.tags
                let postId: string = elem?.id ? elem.id : null
                let reblog_key: string = elem?.reblog_key ? elem.reblog_key : null

                if (tags && reblog_key && postId && tags.length > 0) {
                    let post: Post = { id: postId, key: reblog_key }
                    config.posts.push(post)

                    if (config.tags.length <= config.maxTags) { // ex 5000 - Size limit of the taglist
                        for (var j = 0; j < tags.length; j++) {
                            if (!config.tags.includes(tags[j])) config.tags.push(tags[j]);
                        }
                    }
                }
            })
            // if (config.verbose) console.log('Tags/Keys/Ids catched -= OK =- ', config.tags.length);
            resolve(true)

        }).catch((err) => {
            if (config.verbose) console.log('TAG PROBLEM ' + err);
            reject(err)
        })
    })
}

setInterval(() => {
    GetPostKey().catch(err => console.log(err))
}, 30000); // Time to grab post = id + key

function reblogMachine(): void {

    const randKey = Math.floor((Math.random() * config.posts.length) + 1);
    const { key, id } = config.posts[randKey];

    const randComType = config.comsType[Math.floor((Math.random() * config.comsType.length))] as string
    const comdTypeKey = randComType as keyof typeof config.comments;

    const myComment: string = config.comments[comdTypeKey][Math.floor((Math.random() * config.comments[comdTypeKey].length))];

    if (key && config.posts.length > 0) {
        if (!config.posted.includes(id)) {
            client.reblogPost(config.blogName, { id: id, reblog_key: key, comment: myComment }, (err: string, data: any) => {
                if (err && config.verbose) console.log('REBLOG PROBLEM ' + err);
                else {
                    config.posted.push(id);
                    config.posts.splice(randKey, 1)
                    if (config.verbose) console.log('Reblog -= [OK] =- Resp', data);
                }
            });
        } else {
            reblogMachine();
        }
    }
}

GetPostKey();
setInterval(reblogMachine, config.timeToPost);