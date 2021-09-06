![image](https://miro.medium.com/max/1400/1*pyHY_wy7wIHiuAjAC3npAA.png)

# Simple Twitter

2 週內採全端 3 人小組進行 TDD ＆ 敏捷開發，打造出可發文、可即時聊天的社群網站！

LIVE DEMO: [連結](https://twitter-fullstack-team-9.herokuapp.com/)

# Features：功能列表

- 註冊或登入系統
  - 使用者可以手動註冊帳號
  - 使用者登出、註冊失敗或登入失敗時，會看到對應的系統訊息
  - 若輸入重複的暱稱，不需提交表單便可以自動提醒
- 登入後，使用者可以執行下列動作：
  - 新增推文＆回覆
  - 喜歡或不喜歡某則推文
  - follow 或訂閱有興趣的用戶
  - 在公開聊天室即時聊天
- 後台管理
  - 管理者可以刪除不適合的推文或回覆
  - 管理者可以觀看目前不同使用者的情況

# Environment Setup：環境安裝

[Node.js](https://nodejs.org/en/)
[Express](https://expressjs.com/)
[MySQL](https://www.mysql.com/)
[Heroku](https://dashboard.heroku.com/)

# Installing Procedure：專案安裝

1.開啟終端機，新建資料夾後，並 cd 到預計要儲存的專案位置，執行：

```
mkdir twitter-fullstack-2020//建立專案資料夾
```

```
cd twitter-fullstack-2020 //切換到專案資料夾
```

```
git clone https://github.com/DennisWei9898/twitter-fullstack-2020.git
```

2.安裝套件、model 和種子資料：

```
npm install //安裝 npm 套件
```

```
npm run setup //建立伺服器的model，以及安裝種子資料
```

3.啟動伺服器，執行 app.js 檔案

```
npm run dev //成功啟動後，終端機會顯示：Simple Twitter web app is listening on port 3000

```

4.打開網址，體驗餐廳清單

> 進入下列網址，來體驗你個人專屬的社群網站： [http://localhost:3000/](http://localhost:3000/)

5.如果無法設定，請檢查是否有設好.env 檔案中的資訊

## 使用工具和技術

#### 主要前端技術

- [html]
- [css]
- [javascript]
- [jquery]
- [bootStrap5]
- [handlebars]

#### 主要後端 & TDD 測試檔技術

- [npm]
- [express]
- [session]
- [bcryptjs]
- [mysql2]
- [sequelize]
- [sequelize-cli]
- [passport]
- [sinon]
- [sinon-cha]

#### 即時聊天

- [socket.io]

#### 雲端部署

- [Heroku]
- [clearDB]

#### 其他

- [faker]
- [method-override]
- [imgur-node-api]
- [multer]
- [moment]
- [dotenv]

## 測試帳號

- 一般用戶帳號：

  - 帳號：user1 or user1@example.com
  - 密碼：12345678

- 管理員帳號：如有需要可以寄信前來索取～ denniseasycard@gmail.com

## 開發人員

Dennis
Hazel
Kou
