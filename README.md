# AC畢業專案-Alphitter

> 這是由大霖,Steven,幫啵共同打造的AC畢業專案

這是一個透過 Node.js＋express 打造的社群軟體，提供使用者發推、回應、追蹤、按讚和聊天等功能。

**Heroku 專案連結: 建置中

## 專案畫面

**前台登入畫面/LoginPage**


**註冊畫面/RegisterPage**


**首頁畫面/HomePage**


**推文畫面/TweetPage**


**個人資料畫面/personalPage**


**追蹤畫面/Followship Page**


**帳號設定畫面/Account Setting Page**


**後臺管理畫面/Management Page**

## 安裝&使用

#### 下載專案

```
git clone https://github.com/nick1092387456/twitter-fullstack-2020/tree/develop
```

#### 安裝 Package

```
npm install
```

#### 建立 MySQL Connection(請在 WorkBench 裡操作 SQL 指令)

**預設密碼為 password**

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
use ac_twitter_workspace;
```

#### 建立 Table & Schema & 種子資料 (請在 VSCode terminal執行npm script指令)

```
npm run seeder
```

#### 修改環境變數 (請將 .env.example 檔案改為 .env)

```
IMGUR_CLIENT_ID = 填入您的imgur client ID
```

#### 使用 nodemon 啟動伺服器(You need to install nodemon before you use)

```
npm run dev
```

#### 或正常啟動

```
npm start
```

#### 進入專案

[http://localhost:3000](http://localhost:3000)

#### 預設測試帳號 Default Testing Account

```
____________________________________
admin
____________________________________
   email:  root@example.com
password:  12345678
____________________________________
user
____________________________________
   email:  user1@example.com
password:  12345678
   email:  user2@example.com
password:  12345678
   email:  user3@example.com
password:  12345678
   email:  user4@example.com
password:  12345678
   email:  user5@example.com
password:  12345678
```

## 環境建置

```
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
"imgur-node-api": "^0.1.0",
"method-override": "^3.0.0",
"mocha": "^6.0.2",
"moment": "^2.27.0",
"multer": "^1.4.2",
"mysql2": "^2.1.0",
"passport": "^0.4.1",
"passport-local": "^1.0.0",
"proxyquire": "^2.1.3",
"sequelize": "^6.3.3",
"sequelize-cli": "^6.2.0",
"sinon": "^7.5.0",
"sinon-chai": "^3.5.0"
```

## 產品功能(User Story)

- 遊客必須先**註冊**帳號才可使用此服務
- 使用者可以**瀏覽**所有推播動態
- 使用者可以**瀏覽**Top 10人氣使用者
- 使用者可以**瀏覽**個人或其他使用者頁面
- 使用者可以**追蹤**喜歡的用戶
- 使用者可以**追蹤**喜歡的用戶
- 管理者可以**瀏覽**所有推文清單
- 管理者可以**刪除**所有推文清單
- 管理者可以**瀏覽**所有使用者列表

## Contributor

- [x] [幫啵](https://github.com/nick1092387456)
- [x] [Steven](https://github.com/steven4program)
- [x] [大霖](https://github.com/leo812leo)
