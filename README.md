
# Simple Twitter

使用 node.js 和 express 打造的社交網站。使用者可以進行註冊、登入、登出、瀏覽和發布推文，編輯個人資料或瀏覽他人資料，瀏覽其他人的推文及回覆。此外，網站還設有後台管理功能，允許管理者瀏覽和刪除特定推文，以及查看所有使用者的資訊。

# 功能 Features

- 使用者功能
  - 註冊/登入/登出功能。
  - 重複註冊/登入資訊錯誤/尚未登入使用網站服務，會出現錯誤提示。
  - 使用者能在首頁瀏覽所有的推文。
  - 使用者可以新增推文。
  - 使用者能查看特定貼文的內容與回覆串。
  - 使用者能回覆別人推文。
  - 點擊貼文中使用者頭像時，能瀏覽該使用者的個人資料及推文內容。
  - 使用者可以追蹤/取消追蹤其他使用者。
  - 使用者能編輯自己的名稱、介紹、大頭照和個人背景。
  - 使用者可以對別人的推文按讚或取消讚。
  - 使用者在右側欄位能瀏覽並追蹤/取消追蹤排名前 10 的使用者推薦清單。
- 後台管理功能
  - 管理者可以瀏覽全站的推文內容清單 & 刪除特定推文。
  - 管理者可以瀏覽站內所有的使用者清單。


# 環境安裝 Environment Setup

詳細資訊請參考 package.json 檔案
- Visual Studio Code: 1.81.1
- Node.js: 14.16.0
- Express.js: 4.16.4
- Express-handlebars: 5.3.3
- bcryptjs: 2.4.3
- express-session: 1.15.6
- method-override: 3.0.0
- passport: 0.4.0
- passport-local: 1.0.0
- sequelize: 6.18.0
- sequelize-cli: 6.2.0

# 安裝與執行 Install & Execution

1. 安裝 Node.js
2. 開啟終端機將本專案存至本機:
```
git clone https://github.com/scheng0718/twitter-fullstack-2020.git
```
3. 進入存放專案的資料夾
```
cd twitter-fullstack-2020
```
4. 設定環境變數
參考根目錄底下的 .env.example 檔案，替換 SKIP 的內容，新增至 .env 檔案。

5. 建立資料庫
開啟 MySQL workbench，連線至本地資料庫，建立以下資料庫 

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
use ac_twitter_workspace;

drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
use ac_twitter_workspace_test;
```
6. 安裝 npm 套件
```
npm install
```
7. 安裝 nodemon
```
npm install -g nodemon
```
8. 資料庫遷移設定
```
npx sequelize db:migrate 
```
9. 加入預設種子資料
```
npx sequelize db:seed:all 
```
10. 啟動專案
```
npm run dev
```
11. 瀏覽器開啟本機頁面
當終端機出現下列訊息" "Example app listening on port 3000!" 表示本機伺服器建立成功，在瀏覽器輸入 http://localhost:3000 使用本專案。

12. 預設前台使用者及後台管理者帳號
加入種子資料後，可以使用預設帳號/密碼登入網站
- User Account 1
  - 帳號: user1
  - 密碼: 12345678
- User Account 2
  - 帳號: user2
  - 密碼: 12345678
- 管理者帳號
  - 帳號: root
  - 密碼: 12345678

13. 結束專案
```
Ctrl + C
```

## 開發人員 Developers
Annie/Evan/瑞晨