# twitter-fullstack-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (全端開發組)

![/public/stylesheets/icons/home_page_img.png](https://github.com/sherryylin0719/twitter-fullstack-2020/blob/README/public/stylesheets/icons/home_page_img.png?raw=true)

## 安裝與使用

### ※事前準備
### 進行下列步驟前請先確認已註冊 [Imgur](https://imgur.com/) 帳號並建立自己的Application
### 確認已安裝 [Node.js](https://nodejs.org/zh-tw/download) 與 [MySQL](https://dev.mysql.com/doc/)
### 並在MySQL中建立名為`ac_twitter_workspace`的資料庫


### 1. 下載至本機並安裝套件
開啟cmd並輸入下方指令
```js
git clone 網址
```
繼續在cmd中輸入指令
```js
cd twitter-fullstack-2020
```
進入本機資料夾後接著輸入
```js
npm install
```

### 2. 建立資料表與種子資料
安裝完套件後輸入
```js
npx sequelize db:migrate
```
再接著建立種子資料
```js
npx sequelize db:seed:all
```

### 3. 設定環境變數並啟用
輸入以下指令建立環境變數
```js
touch .env
```
至.env的檔案中將ImgurID 與 Secret存入

回到cmd輸入
```js
npm run start
```
如出現`Example app listening on port 3000!`表示已成功啟動

啟動後點選下方連結進入

[http://localhost:3000](http://localhost:3000)

以預設帳號登入

前台：
帳號 user1
密碼 12345678

後台：
帳號 root
密碼 12345678

或自行註冊一組新帳號登入

### 4. 功能
#### 前台：
1. 左側導覽頁
- 「首頁」可回到首頁(所有推文頁)
- 「個人資料」可進入使用者頁面
- 「設定」可修改使用者帳戶資料
- 「推文」可發布一則新推文
- 「登出」可登出當前使用帳號

2. 首頁
- 可瀏覽所有推文(依時間排序，由新到舊)與推文回覆數、喜歡數、發布時間
- 可發布一則新推文(字數上限140字)
- 可喜歡/收回喜歡單一推文
- 點選單一推文可查看該推文發布時間與回覆串
- 可針對點選推文進行回覆
- 點選使用者頭像可瀏覽該使用者個人頁面

3. 右側推薦跟隨
- 可跟隨/取消跟隨其他使用者
- 點選頭像、名稱或帳號可瀏覽該使用者個人頁面

4. 個人頁面
- 可看到使用者基本資料(姓名、帳號、自我介紹、頭像、封面照、追蹤及跟隨人數等)
- 可編輯基本資料(限使用者本人)
- 最上方可看到該使用者發布推文總數，點選「←」可回到上一頁
- 下方有三個頁籤可切換
  - 「推文」可瀏覽該使用者所有推文與回覆數、喜歡數、發布時間
  - 「回覆」可查看該使用者所有回覆
  - 「喜歡的內容」可查看該使用者喜歡的所有推文

#### 後台：
1. 左側導覽頁
- 「推文清單」可瀏覽所有前台使用者的推文(依時間排序，由新到舊)
  - 每則推文顯示前50個字，後台管理者可點選「X」刪除任一推文
- 「使用者列表」可查看所有使用者資料(依推文數排列，由多至少)
  - 使用者資料包含名稱、帳號、頭像、封面照、推文數、推文喜歡數、跟隨中與跟隨者
- 「登出」可登出當前管理者帳號
