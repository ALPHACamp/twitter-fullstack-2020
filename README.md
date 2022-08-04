## Project Name
[Alphitter](https://shielded-springs-90732.herokuapp.com/signin) deployed on Heroku

## Description
Alphacamp 的期末分組挑戰：「用全端開發模式，建立類似 twitter 的使用者論壇」

## Members
- [Yu-Ming](https://www.linkedin.com/in/yumingchang1991/) as PM & Developer
- [Joseph]() as QA & Developer
- [Wanching]() as QA & Developer

## Core Technologies
- `Express` for framework
- `Passport` for authentication
- `MySQL` for database
- `Heroku` for deployment

## Steps to start this project from scratch

### 1) Clone a local copy of this repo
`git clone https://github.com/yumingchang1991/ac-twitter-fullstack-2022`


### 2) Change directory to local repo and install dependencies
`npm install`

### 3) Add a file named '.env' and fill in the required constant according to '.env.example'
`touch .env`  
    
&nbsp;&nbsp;_If you don't have client id and secret for imgur, you can apply [here](https://api.imgur.com/oauth2/addclient)_

### 4) Add a folder named 'temp'
`mkdir temp`

### 5) Create database connection and database according to the following
connection:
|parameter|value|
|---------|---------|
|hostname|127.0.0.1|
|username|root|
|password|password|

database:
|environment|database|
|:---------:|:------------------:|
|development|ac_twitter_workspace|
|test|ac_twitter_workspace_test|

### 6) Create required table in database
`npx sequelize db:migrate`

### 7) Create seeds in database
`npx sequelize db:seed:all`

### 8) start the server
`npm run dev`

### 9) Open browser and navigate to https://localhost:3000
&nbsp;&nbsp;_You can use the following accounts to login_
|role|account|password|
|:-----:|:-------:|:--------:|
|admin|root|12345678|
|user|user1|12345678|

### 10) Enjoy!
