# TWITTER

一個使用 Node.js + Express 打造的社群網站，並透過 MySQL 資料庫取得資料。
可以註冊帳號，並使用帳號登入。
可以在首頁瀏覽所有最新的貼文，並自己新增推文。

## 專案畫面

首頁
![image]()

登入頁
![image]()

## Features - 產品功能

1. 使用者可以點擊任一頭貼，查看該使用者的詳細資訊。
2. 使用者可以點擊任意貼文，查看詳細內容，可以新增回覆留言。
3. 使用者可以新增貼文。
4. 使用者可以註冊新帳號。
5. 使用者可以透過註冊的帳號密碼登入。
6. 使用者可以追蹤其他使用者。
7. 使用者可以修改自己的帳號密碼等個人資料。

## Environment SetUp - 環境建置

1. [MySQL 8.0 以上](https://dev.mysql.com/downloads/mysql/)
2. [Node.js](https://nodejs.org/en/)

## Installing - 專案安裝流程

1. 打開你的 terminal，Clone 此專案至本機電腦

```
git clone https://github.com/Nina19980108/twitter-fullstack-2020.git
```

2. 開啟終端機(Terminal)，進入存放此專案的資料夾

```
cd twitter-fullstack-2020
```

3. 安裝 npm 套件

```
在 Terminal 輸入 npm install 指令
```

4. 安裝 nodemon 套件

```
在 Terminal 輸入 nodemon app.js 指令
```

5. 匯入種子檔案與初始設定

```
在 Terminal 輸入 npx sequelize db:migrate 指令

在 Terminal 輸入 npx sequelize db:seed:all 指令

```

6. 啟動伺服器，執行 app.js 檔案

```
nodemon app.js
```

7. 當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結

```
App is running on http://localhost:3000
```

8. 可使用種子資料的帳號密碼登入

```
信箱：root@example.com
密碼：12345678
```

## Contributor - 專案開發人員

> [Nina Liu](https://github.com/Nina19980108)
