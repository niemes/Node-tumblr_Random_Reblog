# Node-tumblr_Random_Reblog
A simple Reblog Machine to reblog random post on Tumblr.

See http://stochastique-blog.tumblr.com/ for a live demo.
## Install

1. Clone this repo.
2. Add your personals consumer_key, secret, token and token secret. Register an App on tumblr api if you dont have one : https://www.tumblr.com/oauth/apps. 
(For token and token_secret see Oauth or https://github.com/stigok/node-oauth-tumblr-example .)
3. cd Node-tumblr_Random_Reblog/
4. Install tumblr.js : npm install .
5. Run node random-reblog.js

## Run in background

Use nohup command :

nohup node random-reblog.js > output.log &
