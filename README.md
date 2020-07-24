# AC畢業專案-Twitter論壇

> 這是由Yen,政昕,Tony共同打造的AC畢業專案

**Heroku 專案連結:** []()

## 專案畫面

**前台登入畫面/LoginPage**
![專案畫面](/public/images/screenshot_1.png)

**註冊畫面/RegisterPage**
![專案畫面](/public/images/screenshot_2.png)

## 安裝&使用

#### 下載專案

```
git clone https://github.com/waiting33118/restaurant-forum.git
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

#### 建立 Table & Schema (請在 VSCode 裡操作 Sequelize 指令)

```
npx sequelize db:migrate
```

#### 建立種子資料 (請在 VSCode 裡操作 Sequelize 指令)

```
npx sequelize db:seed:all
```

#### 修改環境變數 (請將 .env.example 檔案改為 .env)

```
IMGUR_CLIENT_ID = 填入您的imgur client ID
```

#### 使用 nodemon 啟動伺服器

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
"bcryptjs": "^2.4.3",
"body-parser": "^1.18.3",
"chai": "^4.2.0",
"connect-flash": "^0.1.1",
"dotenv": "^8.2.0",
"express": "^4.16.4",
"express-handlebars": "^3.0.0",
"express-session": "^1.15.6",
"faker": "^4.1.0",
"method-override": "^3.0.0",
"mocha": "^6.0.2",
"moment": "^2.27.0",
"mysql2": "^2.1.0",
"passport": "^0.4.0",
"passport-local": "^1.0.0",
"sequelize": "^6.3.3",
"sequelize-cli": "^6.2.0",
"sinon": "^7.2.3",
"sinon-chai": "^3.3.0"
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

- [x] [Yen Lai](https://github.com/YenLai)
- [x] [政昕](https://github.com/robert913152750)
- [x] [Tony Chung](https://github.com/waiting33118)
