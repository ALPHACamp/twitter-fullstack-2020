# Simple Twitter
使用 Node.js 搭配後端框架 Express 打造一個社群網站，可進行貼文﹑回覆其他使用者貼文﹑喜歡貼文﹑追蹤使用者…等功能。
# Features:功能
- 註冊/登入/登出
  - 使用者要登入才能使用網站
  - 使用者註冊重複/登入/登出失敗時，會看到對應的系統訊
- 使用者
  - 使用者能在首頁瀏覽所有的推文
  - 使用者點擊貼文方塊時，能查看該則貼文的詳情與回覆串
  - 點擊貼文中使用者頭像時，能瀏覽該使用者的個人資料及推文
  - 使用者能回覆別人的推文
  - 使用者可以追蹤/取消追蹤其他使用者
  - 使用者能編輯自己的名稱、介紹、大頭照和個人背景
  - 使用者能在首頁的側邊欄，看見跟隨者數量排列前 8 的使用者推薦名單
- 後台管理
  - 管理者可以瀏覽站內所有的使用者清單
  - 管理者可以瀏覽全站的推文清單 & 刪除

  # Environment Setup：環境安裝
- Node.js:v14.16.0
- Express.js:4.16.4
- Express-handlebars:^3.0.0

# Installing Procedure：安裝流程
1.開啟終端機將專案存至本機:
```
git clone https://github.com/EasonLu0425/twitter-fullstack-2020.git
```
2.進入存放此專案的資料夾
```
3.環境變數設定
將根目錄.env.example檔案中輸入imgur金鑰﹑預設頭貼網路位置﹑預設背景網路位置,再把.env.example檔案名稱修改為.env
4.建立資料庫
開啟 MySQL workbench，再連線至本地資料庫，輸入以下建立資料庫 

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
use ac_twitter_workspace;

drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
use ac_twitter_workspace_test;
```
5.安裝 npm 套件
```
npm install
```
6.db:migrate 設定
```
npx sequelize db:migrate 
```
7.加入種子資料
```
npx sequelize db:seed:all 
```
8.啟動專案
```
npm run dev
```
9.使用
終端機出現下列訊息" "Example app listening on port 3000!"
可開啟瀏覽器輸入 http://localhost:3000 使用

10.預設使用者 Seed User
- 一般使用者帳號有20組 (帳號:user1﹑user2﹑user3…etc，密碼皆為12345678)
- 管理者帳號僅有1組 (帳號:root ，密碼:12345678)