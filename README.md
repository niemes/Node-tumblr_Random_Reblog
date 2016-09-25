# Node-tumblr_Random_Reblog

A simple Reblog Machine to reblog random post on Tumblr.

See <http://stochastique-blog.tumblr.com/> for a live demo.

## Install

1. Clone this repo.
2. Add your personals consumer_key, secret, token and token secret. Register an App on tumblr api if you don't have one : <https://www.tumblr.com/oauth/apps>. (For token and token_secret see Oauth or <https://github.com/stigok/node-oauth-tumblr-example> .)

3.

> cd Random-Reblog/

> npm install

> node random-reblog.js

## Run in background

### Use nohup command :

If output.log doesn't exist it will be create.

> nohup node random-reblog.js > output.log &

### check the process :

> ps axl | grep node

### To kill

> kill [number]

## ToDo

- [x] Avoid duplicate post.
- [ ] Handle error from the tumblr API.
- [x] Avoid duplicate Tags.
- [x] Add Taglist in a Json file to keep the list if you stop the script.
