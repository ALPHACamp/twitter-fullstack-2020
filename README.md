# Twitter-fullstack-2020
使用 Node.js + Express 打造類似Twitter的簡易網站。

## 開發環境
1. Node.js v14.16.0
2. mySQL v8.0.31

## Features - 產品功能
1. 使用者可以註冊帳號。註冊所需資料包括：帳號、名稱、Email、密碼、確認密碼。
2. 當使用者註冊時，能夠提示使用者輸入是否合乎規定要求。
3. 使用者的密碼使用 bcrypt 加密處理。
4. 使用者必須登入才能開始使用。
5. 使用者登入後，可以查看所有推文，並可以回覆貼文，觀看推文的所有回覆，以及將推文加入喜歡。
6. 使用者可以查看自己的推文，查看自己所有回覆，查看喜歡的推文。
7. 使用者可以到設定頁，編輯個人帳戶設定。
8. 使用者可以透過個人檔案編輯個人大頭照及個人頁面背景照。
9. 管理者可以查看所有的推文、及刪除推文
10. 管理者可以查看所有的使用者資訊，包括推文數、喜歡數量、被追蹤、追蹤數量
11. 使用者可以查看自己以及其他使用者的追蹤對象、被誰追蹤

## Installing - 專案安裝流程

1. 開啟終端機(Terminal)，Clone 此專案至本機電腦。

```
git clone https://github.com/Leon-Chun/twitter-fullstack-2020.git
```

2. 使用終端機(Terminal)指令，進入存放此專案的資料夾。

```
cd twitter-fullstack-2020
```

3. 在專案資料夾下，使用終端機(Terminal)，輸入 npm 套件安裝指令。

```
npm install
```

4. 安裝 nodemon 套件 (若已再global安裝則不須重新安裝)

```
npm install -g nodemon
```

5. 開啟MySQLWorkbench ，使用SQL指令，在本地(local)建立資料庫。

```
create database ac_twitter_workspace;
```

6. 回到專案資料夾下的終端機(Terminal)，建立mySQL Table。

```
npx sequelize db:migrate
```

7. 匯入種子檔案， 產生測試用的初始資料。

```
npx sequelize db:seed:all
```

8. 執行npm腳本指令，啟動伺服器

```
npm run dev
```

9. 現在可以開啟任一瀏覽器瀏覽器輸入 [http://localhost:3000](http://localhost:3000) 開始使用！

10. 可以使用種子帳號來做測試：

管理者種子帳號：
帳號：root
密碼：12345678

提供使用者 user1~user5，密碼皆相同，也可以自己註冊新的帳號做測試
帳號：user1
密碼：12345678

## 開發組員： MIN、馬君、Waylin
