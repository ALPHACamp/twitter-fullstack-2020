# Simple Twitter
Simple Twitter是一個使用Express及MySQL打造出的社群網站。使用者需要註冊之後才能夠使用社群網站的功能。


## 功能
* 使用者可以註冊帳號。
* 除了註冊和登入頁，使用者一定要登入才能使用網站。
* 使用者可以在設定頁面重新設定帳戶資訊（帳號、名稱、Email、密碼）。
* 使用者可以瀏覽自己的個人資料
* 使用者可以瀏覽其他使用者的個人資料。
* 使用者可以編輯自己的個人資料（名稱、自我介紹、個人頭像及封面）。
* 使用者可以在首頁輸入文字直接推文或是點擊推文按鈕推文。
* 使用者可以在首頁瀏覽所有使用者發佈的推文。
* 使用者可以對推文按喜歡及取消喜歡。
* 使用者可以看到推文的喜歡數量及推文時間。
* 使用者可以點擊首頁推文查看個別推文及回覆串。
* 使用者可以在個別推文頁面回覆推文。
* 使用者可以在個人資料頁面查看自己發佈的所有推文、回覆過的留言及喜歡的內容。
* 使用者在個人資料頁面點擊跟隨中、跟隨者時會進入追隨頁面。
* 使用者可以在追隨頁面查看追隨狀況（追隨者、正在追隨）。
* 使用者可以跟隨及取消跟隨其他使用者。
* 使用者可以在首頁的側邊欄看到跟隨數量前十名的使用者。
* 經過授權的管理者（admin）可從專門的後台登入頁面進入網站後台。
* 管理者可以瀏覽網站上的推文清單（只顯示推文的前五十個字）。
* 管理者可以在推文清單上刪除任何人的推文。
* 管理者可以瀏覽所有的使用者清單（包括使用者推文數量、推文被喜歡的數量、關注人數、跟隨者人數）。

## 專案安裝步驟
1. 下載專案
    ```
    git clone https://github.com/zxc58/twitter-fullstack-2020.git
    ```

2. 切換到存放此專案的資料夾
    ```
    cd twitter-fullstack-2020
    ```

3. 安裝npm套件
    ```
    npm install
    ```

4. 在MySQL創建資料庫
    ```
    create database ac_twitter_workspace;
    ```

5. 建立 migration
    ```
    npx sequelize db:migrate
    ```

6. 建立種子資料
    ```
    npx sequelize db:seed:all
    ```

7. 啟動伺服器執行檔案
    ```
    npm run start
    ```

8. 若看見以下訊息則代表順利運作
    ```
    Example app listening on port 3000!
    ```

## 測試帳號
* 管理者帳號: root    密碼: 12345678    （具有管理者權限）
* 使用者帳號: user1   密碼: 12345678    （不具有管理者權限）


## 開發工具

* Express 4.17.1
* Express-handlebars 3.0.0
* Express-session 1.17.2
* mysql2 1.6.4
* passport 0.4.1
* passport-local 1.0.0
* sequelize 6.18.0
* sequelize-cli 5.5.0
* body-parser 1.18.3
* method-override 3.0.0
* connect-flash 0.1.1
* dotenv 10.0.0
* faker 4.1.0
* bcryptjs 2.4.3
* multer 1.4.3
* dayjs 1.10.6
* imgur 1.0.2
* Bootstrap 5.1.3
* Font-awesome Latest 5.x
