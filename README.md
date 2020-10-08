# twitter-fullstack-2020
[HEROKU](https://salty-fortress-16177.herokuapp.com/"HEROKU")

## Test account:

- Admin
```
Account	: root

Password : 12345678
```
---
User
```
Account	: user1

Password : 12345678

```

## 相關環境變數
[env.example](https://.env.example "title text!")

## 網頁示意圖

利用Node.js、Express以及SQL關聯式資料庫建置的Simple-Twitter社群網站全端專案，
核心功能包含Simple Twitter前後台的操作情境以及使用者的互動。

## Features
User/前台
- 此專案可以註冊/登入/登出
- 使用者進入首頁後，可以操作:
  - 新增或是瀏覽推文
  - 查看回應
  - 瀏覽曾經按過like的推文
  - 對推文按like，或收回like
  - 瀏覽其他使用者頁面
  - 追蹤其他使用者，或退追蹤
  - 編輯使用者的Profile

Admin/後台
- 管理者可從專門的後台登入頁面進入網站後台
- 瀏覽、刪除所有使用者發佈過推文清單
- 瀏覽所有使用者的清單


## Environment SetUp

 - [Node.js](https://nodejs.org/en/ "title text!")
 
## Installing 

1.打開Terminal，複製此專案至本地端

```
git clone https://github.com/ChubbyKay/twitter-fullstack-2020
```

2.開啟Terminal，進入存放此專案的資料夾

```
cd expense-tracker
```

3.安裝 npm套件

```
npm install  //安裝套件
```

4.安裝 nodemon 套件

```
npm install -g nodemon
```

5.設定SQL資料庫
```
username: root
password: password
database: ac_twitter_workspace
```

6.Migrate
```
$ npx sequelize db:migrate
```

7.新增種子資料，運行npm run seed 腳本

```
npm run seed
```

8.設定 imgur
```
1. add .env              <add file name .env>
2. IMGUR_CLIENT_ID=XXX   <your imgur client id>
3. SECRET=XXX            <set your secret string>
```

9.透過nodemon 啟動伺服器，執行app.js

```
nodemon app.js
```

10.當 terminal 出現以下字樣，表示伺服器已啟動並成功連結

```
Express is listening on http://localhost:3000
```

## 開發環境

    "@handlebars/allow-prototype-access": "^1.0.3",
    "bcrypt-nodejs": "0.0.3",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "chai": "^4.2.0",
    "connect-flash": "^0.1.1",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-handlebars": "^3.1.0",
    "express-session": "^1.17.1",
    "faker": "^4.1.0",
    "handlebars": "^4.7.6",
    "imgur-node-api": "^0.1.0",
    "method-override": "^3.0.0",
    "mocha": "^6.0.2",
    "moment": "^2.29.0",
    "multer": "^1.4.2",
    "mysql2": "^1.6.4",
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "pg": "^8.4.0",
    "sequelize": "^4.42.0",
