# Simple Twitter

## **Introduction 專案簡介**

使用 Node.js + Express + MySQL 製作的簡易社群網站，使用者可以註冊帳號、登入，並進行發文、瀏覽他人推文、回覆他人留言、對別人的推文按 Like，以及追蹤其他使用者等。

(待補：網站截圖)

## **Features 功能**

- 使用者可以註冊，並登入帳號使用網站服務
- 使用者能在首頁瀏覽所有的推文 (tweet)
- 使用者能新增推文
- 使用者能回覆別人的推文
- 使用者能對別人的推文按 Like/Unlike
- 使用者可以追蹤/取消追蹤其他使用者
- 使用者能編輯自己的名稱、自我介紹、個人頭像與封面

## **Prerequisites 環境設置**

- [VScode](https://code.visualstudio.com/)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## **Installation 開始使用**

```
# 開啟終端機 並 Clone 此專案至本機
$ git clone https://github.com/thpss91103/twitter-fullstack-2023.git

# 於終端機進入存放本專案的資料夾
$ cd xxxxx

# 安裝 npm 套件
$ npm install

# 新增.env檔案，並請根據.env.example檔案內資訊設置環境變數

# 修改 config.json 中的 development 設定，使用個人 MySQL 的 username、password 和 database
  development": {
      "username": "<your username>",
      "password": "<your password>",
      "database": "<your database>",
      "host": "127.0.0.1",
      "dialect": "mysql"
  }

# 新增資料表和種子資料
$ npx sequelize db:migrate
$ npx sequelize db:seed:all

# 啟動伺服器，執行 app.js 檔案
$ npm run dev 

# 若在終端機看到下方訊息代表順利運行，於瀏覽器中輸入該網址(http://localhost:3000)即可開始使用本網站
"App is running on http://localhost:3000"
```

## **Contributors 貢獻者**

(待補)