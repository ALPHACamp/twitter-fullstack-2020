# twitter-fullstack-2020
The simple twitter project built with NODE.js, Express framework and MySQL.

## 環境
NODE.js v14.15.0

## 測試帳號
| 帳號     | 信箱           | 密碼  |
| ------------- |:-------------:| -----:|
| root     | root@example.com   | 12345678 |
| user1    | user1@example.com  | 12345678 |
| user2    | user2@example.com  | 12345678 |
| user3    | user3@example.com  | 12345678 |
| user4    | user4@example.com  | 12345678 |
| user5    | user5@example.com  | 12345678 |

## 安裝
1.開啟終端機(Terminal)到欲存放的資料夾(本機)位置，輸入以下指令
```
$ git clone Ace1862020/twitter-fullstack-2020.git
```
2.安裝套件
```
npm install
```
3.在Imgur上創建專案
4.並在專案的根目錄新增.env檔，建立你的 IMGUR_ID
```
IMGUR_CLIENT_ID="YOUR IMGUR CLIENT ID"
```
5.在workbrench新增database
```
create database ac_twitter_workspace
```
6.新增migrate
```
npx sequelize db:migrate
```
7.新增種子資料
```
npx sequelize db:seed:all
```
8.執行專案
```
npm run dev
```
9.在本機端 [http://localhost:3000](http://localhost:3000) 開啟網址

## 功能列表
* 網站功能
1. 可以註冊帳號
2. 使用者輸入帳號密碼可以登入首頁
3. 使用者不能登入管理者頁面
4. 使用者可以發布文章、留言及回覆留言
5. 使用者可以對文章或留言按讚
6. 使用者可以收回讚以及刪除文章和留言
7. 追蹤其他使用者，可以在網站上看到其他使用者的推文

* 使用者功能
1. 更改帳戶名稱、密碼、信箱等個人資料
2. 更改帳戶頭像或背景圖片時，能夠先預覽
3. 查看追蹤對象及誰追蹤你

* 後台功能
1. 管理者使用帳號密碼，可以登入管理這頁面
2. 管理者帳號，不能登入網站首頁
3. 對於不適宜的文章內容，可以進行刪除
4. 查看網站使用者

---------------
* 未完成的網站功能
1. (X)訂閱其他使用者(開啟小鈴鐺)，接受其發文時的通知
2. (X)可以發送私人訊息
3. (X)當有人追蹤你或對你的推文或留言按讚及回覆時，使用者會收到通知
* 使用者功能
1. (X)使用者頁面的留言、按讚
2. (X)使用者可以看到其他使用者的追蹤頁面
