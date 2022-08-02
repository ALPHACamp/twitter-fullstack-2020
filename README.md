# Twitter-fullstack-2020
使用 Node.js + Express 打造類似Twitter的簡易網站。

## 開發環境
1. Node.js v14.16.0
2. mySQL v8.0.15

## Features - 產品功能
1. 使用者可以註冊帳號，註冊的資料包括：帳號、名稱、email、密碼、確認密碼。
2. 使用者的密碼使用 bcrypt 來處理
3. 使用者必須登入才能開始使用
4. 使用者登入後，可以追蹤使用者，追蹤後顯示追縱者推文，並且回覆推文，觀看推文的所有回覆，以及將推文加入喜歡
5. 使用者可以透過個人檔案編輯個人大頭照及個人頁面背景照
6. 使用者可以透過設定編輯自己帳戶資訊
7. 管理者可以查看所有的推文、及刪除推文
8. 管理者可以查看所有的使用者資訊，包括推文數、喜歡數量、被追蹤、追蹤數量

## Installing - 專案安裝流程

1. 打開你的 terminal，Clone 此專案至本機電腦

```
git clone https://github.com/Doug0849/twitter-fullstack-2020.git
```

2. 開啟mySQL - Workbench 建立資料庫

```
create database ac_twitter_workspace;
```

3. 開啟終端機(Terminal)，進入存放此專案的資料夾

```
cd twitter-fullstack-2020
```

4. 回到終端機專案資料夾下安裝 npm 套件

```
在 Terminal 輸入 npm install 指令
```

5. 安裝 nodemon 套件 (若已再global安裝則不須重新安裝)

```
在 Terminal 輸入 npm install -g nodemon 指令
```

6. 建立mySQL Table

```
執行 npx sequelize db:migrate
```

7. 匯入種子檔案

```
執行 npx sequelize db:seed:all 產生測試用的初始資料
```

8. 執行npm腳本，啟動伺服器

```
在 Terminal 輸入 npm run dev 指令啟動伺服器
```

9. 現在可以開啟任一瀏覽器瀏覽器輸入 [http://localhost:3000](http://localhost:3000) 開始使用Alphitter囉！

10. 可以使用種子帳號來做測試：

提供管理者
帳號：root
密碼：12345678

提供使用者 user1~user5，密碼皆相同，也可以自己註冊新的帳號做測試
帳號：user1
密碼：12345678

## Alpha Camp學員 Simple Twitter 專案開發小組： Dhal、Choyz、Cuisine


