# twitter-fullstack-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (全端開發組)

## 畫面

![asignin](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/28645bb7-d212-460a-88d3-3535539e0c76)
![admi-signin](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/efa1714f-cadc-4780-a9ab-5d171e19a845)
![signup](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/624ea2de-f028-4a69-94a3-b3ec18c9c53b)
![tweets](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/990466b3-4f45-4a80-bbd6-79d7f3e78beb)
![create-new-tweet](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/395738ce-4806-4d93-b519-12c219ff193c)
![tweet-reply](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/46c4737f-ebb5-4fb0-8aed-47447cce2405)
![user-profile](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/661d5d90-eb24-4f33-bf0e-53379bff3d41)
![user-edit](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/c0146f06-e191-4d07-a7e5-244e8f49334e)
![user-account-edit](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/b203dd07-c19c-42ff-a723-ac02e63cf7dc)
![admin-tweets](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/7ff6ce85-8e63-4ec1-82dd-d2a86d162d11)
![admin-users](https://github.com/alvinkane/twitter-fullstack-2020/assets/55631549/f47b02b1-fecc-413a-b62a-baaa228569ae)


## 功能

這個網站有兩種使用角色：

一般使用者 ( 以下稱 `user` )、管理員 ( 以下稱 `admin` )。

user 活動的地方稱為「`前台`」。

admin 活動的地方稱為「`後台`」。

admin 帳號`不能登入前台、不能使用前台的功能`。

user 帳號`也不能登入後台、不能使用後台的功能`。

前台與後台有不同的登入入口。

### 註冊 / 登入

訪客可以自行註冊成為 user，但 admin 帳號`無法自行註冊`。

admin 帳號會由工程師手動開設，例如直接操作資料庫或設定種子資料。

除了`註冊`和`登入頁`，使用者一定要登入才能使用網站。當使用者`尚未註冊`便試圖登入時，會有錯誤提示 : `帳號或密碼錯誤`。

`註冊`時訪客可以設定 account、name (上限 50 字)、email 和 password。

`註冊/編輯`時，account 和 email 不能與其他人重複，若有重複會跳出錯誤提示 : `account 已重複註冊！`、`email 已重複註冊！`。

### 個人資料

`使用者`能編輯自己的名稱、自我介紹、個人頭像與封面，自我介紹數字上限 160 字、暱稱上限 50 字，超過會跳出錯誤提示 : `字數超出上限！`。

個人頁面橫幅背景預設山景圖。

### 貼文留言

`使用者`能在首頁瀏覽所有的推文 (tweet)，所有 Tweets 依 create 日期排序，最新的在前。

`使用者`點擊貼文方塊時，能查看貼文與回覆串。

`使用者`能回覆別人的推文，回覆文字不能為空白，空白會跳出錯誤提示 : `內容不可空白`。

`使用者`無法回覆他人回覆，也無法針對他人的回覆按 Like/Unlike。

`點擊貼文中使用者頭像`時，能瀏覽該使用者的個人資料及推文。

使用者能新增推文，字數限制在 140 以內，空白或超過會跳出錯誤提示 : `內容不可空白`、`字數不可超過140字`。

### 使用者互動

`使用者`可以追蹤/取消追蹤其他使用者 (不能追蹤自己)。

`使用者`能對別人或自己的推文按 Like/Unlike。

### 數據摘要

任何登入使用者都可以瀏覽特定使用者的以下資料：

`推文 (Tweets)`：排序依日期，最新的在前。

`推文與回覆`：使用者回覆過的內容，排序依日期，最新的在前。

`跟隨中 (Following)`：該使用者的關注清單，排序會先排(正在追隨->自己->未追隨)再來才會依照追蹤紀錄成立的時間，愈新的在愈前面。

`跟隨者 (Follower)`：該使用者的跟隨者清單，排序會先排(正在追隨->自己->未追隨)再來才會依照追蹤紀錄成立的時間，愈新的在愈前面。

`喜歡的內容 (Like)`：該使用者 like 過的推文清單，排序依 like 紀錄成立的時間，愈新的在愈前面。

`使用者`能在`首頁的側邊欄`，看見跟隨者 (followers) 數量排列前 10 的推薦跟隨名單。

### 後台

管理者可從專門的後台登入頁面進入網站後台。

管理者帳號`不可登入前台`。

若使用管理帳號登入前台，或使用一般使用者帳號登入後台，等同於「帳號不存在」。

管理者可以`瀏覽全站的 Tweet 清單`。

可以直接在清單上`快覽 Tweet 的前 50 個字`。

可以在清單上`直接刪除任何人的推文`。

管理者可以`瀏覽站內所有的使用者清單`，清單的資訊包括 : 

* 使用者的 :

  * 推文數量（指使用者的 Tweet 累積總量）。

  * 跟隨人數。

  * 跟隨者人數。

  * 推文被 like 的數量（指使用者的 Tweet 獲得 like 的累積總量）。

使用者清單預設按推文數排序，由多至少。


## 初始化
### 下載專案
```
git clone https://github.com/alvinkane/twitter-fullstack-2020.git
```
### 下載相關套件
移動到資料夾內後執行以下指令下載套件
```
npm install
```
### 設定環境變數
參考.env.example新增.env檔設定環境變數
### 確認測試環境設定
packge.json裡指令預設使用set \"NODE_ENV=test\"指令來改變測試環境，適用於Cmder。
若你是使用git bash可以參考以下手動更改測試環境:
由於本地開發預設會使用 development 設定，因此需要使用指令切換到測試環境。
切換到測試環境，如果在等號後加其他的字串，則會切到其他的環境。
```
export NODE_ENV=test
```
確認目前使用的環境。
```
echo $NODE_ENV
```
第一次呼叫 `echo $NODE_ENV` 時，回傳值會是空白的，但在空白情況下，本地會預設使用 development 環境。
### 設定資料庫
新增兩個資料庫，開發環境用的，以及測試環境用的。
在一個新的 Query 頁面輸入 SQL 指令。
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
use 後面加上要使用的資料庫
```
use ac_twitter_workspace;
```
### 執行 Migration
```
npx sequelize db:migrate
```
查看現有版本
```
npx sequelize db:migrate:status
```
將所有的 Migrations 還原至最初尚無 Migration 的階段。
```
npx sequelize db:migrate:undo:all
```
### 執行Sseeder
用指令生成種子資料：
```
npx sequelize db:seed:all
```
還原
```
npx sequelize db:seed:undo:all
```
如果忘記指令怎麼拼，可以使用 sequelize --help 叫出指令清單。
```
sequelize --help
```
### 執行測試
執行測試檔前 要先執行 npx sequelize db:seed:undo:all 清空資料庫
```
npm run test
```
package.json還提供其他指令
```
npm run start
npm run dev
```
分別對應以下功能
"start": "set \"NODE_ENV=development\" && node app.js",
"dev": "set \"NODE_ENV=development\" && nodemon app.js",
"test": "set \"NODE_ENV=test\" && mocha test --exit --recursive --timeout 5000"
執行完npm run start後就能在網頁輸入網址http://localhost:3000/ 開始使用twitter
### 測試帳號

* 1 組 admin 帳號：`root`
* 5 組 user 帳號：`user1 ~ 5`
* 密碼都是：`12345678`
