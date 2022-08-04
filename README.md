# twitter-api-2020


## Live demo

[heroku連結](https://twitter-epcg.herokuapp.com/signin)

![demo]()

## 功能

-註冊/登入/登出
  -除了註冊和登入頁，使用者一定要登入才能使用網站
  -當使用者尚未註冊便試圖登入時，會有錯誤提示
  -使用者能編輯自己的 account、name、email 和 password
  -註冊時，account 和 email 不能與其他人重複，若有重複會跳出錯誤提示
  -編輯時，account 和 email 不能與其他人重複，若有重複會跳出錯誤提示
- 使用者
  - 使用者能瀏覽所有的推文
  - 使用者點擊貼文時，能查看該則貼文的詳情與貼文回覆
  - 點擊貼文中使用者頭像時，能瀏覽該使用者個人資料及推文
  - 使用者可以按讚/取消按讚推文
  - 使用者可以追蹤/取消追蹤其他使用者
  - 使用者能發佈推文
  - 使用者能回覆別人的推文
  - 使用者能編輯自己的名稱、介紹、大頭照和個人背景
  - 使用者能在首頁的側邊欄，看見跟隨者數量排列前 10 的使用者推薦名單
- 後台管理
  - 管理者可以瀏覽站內所有的使用者清單
  - 管理者可以瀏覽全站的推文清單或刪除推文


## 環境設置

### 開發與框架
```
"express": "^4.16.4"
"express-handlebars": "^3.0.0"
```
### 資料庫

````
"sequelize": "^6.18.0"
"sequelize-cli": "^5.5.0"
"mysql2": "^1.6.4"
"mySQL":"8.0.29"
````

### 使用者驗證

````
"passport": "^0.4.0"
"passport-local": "^1.0.0"
````

### 上傳圖片

````
"multer": "^1.0.2"
````
## 安裝與使用  
1. 使用cmd，clone專案
```
git clone  git@github.com:HuangYanHuei/twitter-fullstack-2020.git
```
2. 進入專案資料夾
```
 cd twitter-api-2020
```
3. 安裝套件
```
npm install
```
4. 安裝MySQL workbench後輸入以下指令建立資料庫
````
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
````
5. 資料庫建立Table
````
npx sequelize db:migrate
````
6. 新增種子資料
````
npx sequelize db:seed:all
````
7. 建立env
````
IMGUR_CLIENT_ID=SKIP //imgur須自行申請
SESSION_SECRET=SKIP 
````
8. 開發模式下執行
```
npm run dev
```

Heroku、本地種子資料操作帳號

|    role    | account | password |
| ---------- | ------- | -------- |
| user       |   user1 | 12346578 |
| admin      |    root | 12345678 |

### 後端協作者
|    name    | account |
| ---------- | ------- | 
| 永C | |
| 君  | |