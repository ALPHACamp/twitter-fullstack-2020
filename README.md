# Tweet tweet 
A social media platform enabling users to 💡post tweet, 💬reply, ❤like and 🤝follow others!
![twitter-preview](https://user-images.githubusercontent.com/36234793/180364385-59d2e252-566a-499d-93e9-57a6224e0912.PNG)

## Features
### User
* Browse all tweets on the site
* Reply or like a tweet
* Browse single tweet and see its replies and other information
* Check the number of likes and replies of a single tweet
* Follow other users
* Browse other users' profile and see their tweets and the tweets they liked and replied
* Popular user list with most followers
* Browse posted tweets, liked tweets and replied tweets
* Edit avatar, cover photo, name and introduction
* Edit account, email and password

### Admin
* Browse all tweets on the site
* Delete tweet
* View user data, including name, number of tweets and likes, followings and followers

## Prerequisites
1. Git
2. Node.JS (v14.16.0 or above)
3. Express
4. MySQL

## Install
1. Clone this project to your local machine
<pre><code>$ git clone https://github.com/snmo2546/twitter-fullstack-2020.git</code></pre>
2. Find the directory and install dependencies
<pre><code>$ cd twitter-fullstack-2020
$ npm install</code></pre>
3. Create `.env` file to the directory<br>
Please check `.env.example` file for required data

## Database Setup
1. Create database
<pre><code>DROP DATBASE IF EXISTS ac_twitter_workspace;
CREATE DATABASE ac_twitter_workspace;</code></pre>

2. Change password to your MySQL Workbench password in `config/config.json` file
<pre><code> "development": {
  "username": "root",
  "password": "YOUR MySQL Workbench Password",
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
}</code></pre>

3. Use Sequlize to create tables
<pre><code>$ npx sequelize db:migrate</code></pre>

4. Set up seed files
<pre><code>$ npx sequelize db:seed:all</code></pre>

## Run the app
<pre><code>$ npm run dev or $ node app.js</code></pre>
The app will be running on `localhost:3000`

## Contributor
[Jacky Chen](https://github.com/snmo2546)
