# AC 學期 3 ｜ Twitter專案

利用 Node.js 和 Express 打造一個類似Twitter互動網頁。

## 安裝套件

    "axios": "^0.21.4",
    "bcrypt-nodejs": "0.0.3",
    "body-parser": "^1.18.3",
    "chai": "^4.2.0",
    "connect-flash": "^0.1.1",
    "dotenv": "^10.0.0",
    "express": "^4.16.4",
    "express-handlebars": "^3.0.0",
    "express-session": "^1.15.6",
    "faker": "^4.1.0",
    "imgur-node-api": "^0.1.0",
    "method-override": "^3.0.0",
    "mocha": "^6.0.2",
    "moment": "^2.29.1",
    "multer": "^1.4.3",
    "mysql2": "^1.6.4",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "sequelize": "^4.42.0",
    "sequelize-cli": "^5.5.0",
    "sinon": "^7.2.3",
    "sinon-chai": "^3.3.0"

## 基本功能

(1)使用者可以註冊帳號，並透過註冊的帳號密碼登入或登出。

(2)使用者可以新增貼文，並在首頁看見所有使用者的貼文、推文時間。

(3)使用者可以點擊任意貼文，查看詳細內容、新增回覆留言、按下或取消喜歡。

(4)使用者可以只瀏覽自己按下喜歡的內容、自己貼文以及回覆。

(5)使用者可以追蹤或取消追蹤其他使用者。

(6)使用者可以修改自己的帳號密碼等個人資料。

(7)使用者可以點擊任一頭貼，查看該使用者的詳細資訊。

(8)使用者可以和其他在線的使用者們一起即時聊天。


## Getting Started
Clone respository to your local computer
```
$ git clone https://github.com/WeiHsin-Chen/twitter-fullstack-2020.git
```
Install by npm
```
$ npm install
```
Execute
```
$ npm run dev
```
Terminal show the message
```
Express is running on localhost:3000
```
Now you can browse the website on
```
http://localhost:3000
```
Update the models seeder
```
$ npm run seed
```
種子資料-一般使用者
```
帳號：user1
密碼：123
```
種子資料-後臺管理員
```
帳號：root
密碼：12345678
```