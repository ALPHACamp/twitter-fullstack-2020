# Aphitter,  AlphaCamp Twitter

**AC全端開發結業作品**

> 使用Node.js 及 express framework 展示簡易Twitter功能

> [Demo on Heroku](https://frozen-dusk-97283.herokuapp.com/)

* MySQL 資料庫規劃建立
* 資料庫CRUD操作及進階關聯 
* RESTful 路由 及 API 設計
* MVC架構

## Features

1. **註冊/登入/登出**
> * 除了註冊和登入頁，使用者一定要登入才能使用網站
>> * 後端驗證錯誤，頁面重新整理後顯示錯誤提示
> * 註冊時，使用者可以設定 account、name、email 和 password
> * 使用者能編輯自己的 account、name、email 和 password
> * 註冊/編輯時，account 和 email 不能與其他人重覆，若有重覆會跳出錯誤提示
>> * 錯誤提示「account 已重覆註冊！」或「email 已重覆註冊！」，頁面重新整理後顯示錯誤提示
> * 使用者能編輯自己的暱稱、自我介紹、個人頭像與封面

2.  **種子資料設計**
> * Admin 
>> * account: root
>> * email: root@example.com
>> * password: 12345678
> * 5 個一般使用者
>> * account: user1 ~ user5
>> * email: user1@example.com ~ user5@example.com
>> * password: 12345678
> * 每個使用者有 10 篇 post
> * 每篇 post 有至少 3 個留言者，每個人至少有 1 則留言

3. **貼文留言**
> * 使用者能在首頁瀏覽所有的推文，所有 Tweets 依 create 日期排序，最新的在前
> * 點擊貼文方塊時，能查看貼文與回覆串
> * 使用者能回覆別人的推文
>> * 回覆文字不能為空白
>> * 若不符合規定，會跳回同一頁並顯示錯誤訊息
> * 點擊貼文中使用者頭像時，能瀏覽該使用者的個人資料及推文
> * 使用者能新增推文
>> * 推文字數限制在 140 以內
>> * 推文不能為空白

4. **使用者互動**
> * 使用者可以追蹤/取消追蹤其他使用者 (不能追蹤自己)
> * 使用者能對別人的推文按 Like/Unlike
> * 使用者能編輯自己的名稱、介紹、大頭照和個人頁橫幅背景

5. **數據摘要**
> * 任何登入使用者都可以瀏覽特定使用者的以下資料
>> * 推文 (Tweets)：排序依日期，最新的在前
>> * 推文與回覆：使用者回覆過的內容，排序依日期，最新的在前
>> * 跟隨中 (Following)：該使用者的關注清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
>> * 跟隨者 (Follower)：該使用者的跟隨者清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
>> * 喜歡的內容 (Like)：該使用者 like 過的推文清單，排序依 like 紀錄成立的時間，愈新的在愈前面
> * 使用者能在首頁的側邊欄，看見跟隨者 (followers) 數量排列前 10 的使用者推薦名單

6. **後台**
> * 管理者可從專門的後台登入頁面進入網站後台
>> * 管理者帳號不可登入前台
>> * 若使用管理帳號登入前台，或使用一般使用者帳號登入後台，等同於「帳號不存在」
> * 管理者可以瀏覽全站的 Tweet 清單
>> * 可以直接在清單上快覽 Tweet 的前 50 個字
>> * 可以在清單上直接刪除任何人的推文
> * 管理者可以瀏覽站內所有的使用者清單，清單的資訊包括
>> * 使用者社群活躍數據，包括推文數量、關注人數、跟隨者人數、推文被 like 的數量 (Sprint #2 討論註記：「推文數量」指使用者的 Tweet 累積總量；「推文被 like 的數量」指使用者的 Tweet 獲得 like 的累積總量)
>> * 清單預設按推文數排序

## Environment Setup

* 使用Node.js v10.15.0 或以上版本

* 其他套件請參閱package.json

## Installation

* Terminal git clone

```bash
git clone https://github.com/yulaie1012/twitter-fullstack-2020/tree/master/public/icons
```
* 並執行安裝包含於package.json內套件
```bash
npm install
```

## Usage

>使用 [NPM](https://www.npmjs.com/) (Node Package Manager) 運行

* step 1 資料庫與種子資料 (需自行修改/config/config.json內資料庫帳號及密碼)
```bash
npm run seed
```
* step 2 在跟目錄新增.env (執行下列或參照.env.example檔修改)
```bash
echo "PORT=3000" > .env & echo "SESSION_SECRET=yourSessionSecret" >> .env & echo "IMGUR_CLIENT_ID=yourImgurId" >> .env
```
* step 3 啟動 (於本地運行 http://locakhost:3000)
```bash
npm run start
```
* 開發者模式 (需安裝[nodemon](https://www.npmjs.com/package/nodemon)) (於本地運行 http://locakhost:3000)
```bash
npm run dev
```
* 資料庫重置
```bash
npm run reset
```
* 測試資料庫建置或重置，與測試
```bash
npm run test-reset
npm run test
```

## Contributing
歡迎 Pull requests，如有重大改變，請先開啟 issue 討論您將執行的更新/升級。

請確保根據需要更新測試。

## License
None