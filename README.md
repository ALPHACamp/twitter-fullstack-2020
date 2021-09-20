# Simple Twitter
## Features
- 除了註冊和登入頁，使用者一定要登入才能使用網站
- 使用者可以創建帳號、登入、登出
- 使用者可以編輯自己的賬號設定
- 使用者可以瀏覽/回復/新增推文
- 使用者可以跟隨/被跟隨
- 使用者可以like/unlike推文和留言
- 管理員可以登入後台
- 管理員可以瀏覽全站的用戶
- 管理員可以瀏覽全站的推文
- 管理員可以刪除使用者的推文
## 測試帳號
|Account|Email|Password|
|----|----|----|
|root|root@example.com|12345678|
|user1|user1@example.com|12345678|
|user2|user2@example.com|12345678|
|user3|user3@example.com|12345678|
|user4|user4@example.com|12345678|
|user5|user5@example.com|12345678|
## 安裝
1. 開啟terminal，cd到存放專案位置執行：
```
git clone https://github.com/Rubyrubylai/twitter-fullstack-2020
```
2. 進入專案資料夾
```
cd twitter-fullstack-2020
```
3. 安裝npm
```
npm i
```
4. workbench新增database
```
create database ac_twitter_workspace
```
5. migrate檔案
```
npx sequelize db:migrate
```
6. 種子資料
```
npx sequelize db:seed:all
```
7. 執行專案
```
npm run start
```
