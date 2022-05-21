# alphitter 1.0
## 簡介
Alphitter 為 alphacamp 學期三團體協作專案，主要目的為依照 User story 與指定規格複製一個 twitter，並從中實際體驗軟體開發流程。

## 功能

### 使用者
- 使用者必須註冊，並登入後才能使用這個網站的所有功能
  - 使用者需要提供帳號(account)、電子信箱(email)、姓名(name)、密碼(password) 以註冊會員
  - 使用者需要輸入帳號與密碼登入
  - 使用者可以編輯會員資料
- 使用者對推文有以下互動：
  - 發表一篇推文
  - 查看其他使用者的推文
  - 回覆推文
  - 喜歡推文
- 使用者可以編輯自己主頁的名稱、介紹、大頭照和個人頁橫幅背景
- 使用者可以瀏覽其他使用者的以下資料
  - 推文 (Tweets)：排序依日期，最新的在前
  - 推文與回覆：使用者回覆過的內容，排序依日期，最新的在前
  - 跟隨中 (Following)：該使用者的關注清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
  - 跟隨者 (Follower)：該使用者的跟隨者清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
  - 喜歡的內容 (Like)：該使用者 like 過的推文清單，排序依 like 紀錄成立的時間，愈新的在愈前面
- 使用者可以追隨其他使用者

### 管理者
- 管理者可從專門的後台登入頁面進入網站後台
  - 管理者帳號不可登入前台，詳見【角色權限】單元說明
  - 若使用管理帳號登入前台，或使用一- 般使用者帳號登入後台，等同於「帳號不存在」
- 管理者可以瀏覽全站的 Tweet 清單
  - 可以直接在清單上快覽 Tweet 的前 50 個字
  - 可以在清單上直接刪除任何人的推文
- 管理者可以瀏覽站內所有的使用者清單 (參照圖片)，清單的資訊包括
  - 使用者社群活躍數據，包括
    - 推文數量（指使用者的 Tweet 累積總量）
    - 關注人數
    - 跟隨者人數
    - 推文被 like 的數量（指使用者的 Tweet 獲得 like 的累積總量）
- 清單預設按推文數排序，由多至少


## 安裝
1. 開啟終端機，確認好路徑，`git clone` 此專案，cd 到底下
```
$ pwd
[current_path]
$ git clone https://github.com/kuangtsao/twitter-fullstack-2020.git
$ cd twitter-fullstack-2020
```
2. 透過 `npm install` 安裝需要的 package
```
$ npm install
```
3. 啟動前先檢查有沒有 nodemon，沒有的話請依照這個以下指令安裝
```
$ which nodemon
# 如果有出現路徑就代表已經安裝了
$ npm install nodemon
# 如果要讓他變成到處都可以用，多帶一個 -g 的 flag
```

4. 安裝 mysql 8.0 & mysql workbench  
參考[官網安裝文件](https://dev.mysql.com/doc/refman/8.0/en/installing.html)進行安裝，並安裝 `mysql workbench`
執行以下指令
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

5. 設定環境變數  
參考 `.env.example` 這個檔案設定變數  
`IMGUR_CLIENT_ID` 到 [imgur](https://imgur.com/) 申請帳號後，並到[申請 API client](https://api.imgur.com/oauth2/addclient)的地方點選`OAuth2 authorization without a callback URL` 申請，並記錄 CLIENT_ID 到 .env 使用  
`SESSION_SECRET` 可以依需求自行替換

6. 注入種子資料
請先確認是否還在 clone 下來的路徑
```
[project path] $ npx sequelize db:seed:all
```
## 啟動專案
挑一個喜歡的
```
[project path] $ npm run start
[project path] $ node app.js
[project path] $ npm run dev
[project path] $ nodemon app.js
```
只要有看到這個訊息，就可以到瀏覽器輸入 `http://localhost:3000`，就可以使用該專案功能
```
 alphitter listening on port 3000
```
## 開發工具
axios 0.27.2  
bcrypt-nodejs 0.0.3  
bcryptjs 2.4.3  
body-parser 1.18.3  
chai 4.2.0  
connect-flash 0.1.1  
dayjs 1.10.6  
dotenv 10.0.0  
express 4.16.4  
express-handlebars 3.0.0  
express-session 1.15.6  
faker 4.1.0  
imgur 1.0.2  
method-override 3.0.0  
multer 1.4.3  
mysql2 1.6.4  
nodemon 2.0.16  
passport 0.4.0  
passport-local 1.0.0  
sequelize 6.18.0  
sequelize-cli 5.5.0  
sinon 10.0.0  
sinon-chai 3.3.0  
eslint 7.32.0  
eslint-config-standard 16.0.3  
eslint-plugin-import 2.23.4  
eslint-plugin-node 11.1.0  
eslint-plugin-promise 5.1.0  
mocha 8.2.0  
proxyquire 2.1.3  
sequelize-test-helpers 1.4.2  
supertest 3.3.0  
