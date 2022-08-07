# # Simple Twitter (Fullstack)

 使用Node.js + Express開發「基本款twitter」，包含使用者身分驗證、推文、回覆及追蹤功能。

![專案首頁截圖](https://user-images.githubusercontent.com/101697072/183285121-9d7d6342-de7a-4020-a7c2-87b7de79d1ee.png)

## Features 功能
> 註冊登入
- [ ] 註冊身分 (帳號、名稱、email、密碼)，密碼以bcrypt加密
- [ ] 需登入才能進入網站主頁
- [ ] 註冊、登入或設定有誤時，以彈跳訊息通知
- [ ] 管理員於後台登入，主頁內含所有使用者及推文資訊，前後台帳號不相容
> 推文操作
 - [ ] 新增個人貼文
 - [ ] 瀏覽全部推文，排序由新到舊
 - [ ] 點擊💬可以回覆推文
 - [ ] 點擊❤️可以喜歡貼文 (like or unlike)
 - [ ] 輸入有誤時，在彈跳視窗顯示錯誤訊息
> 使用者資訊
 - [ ] 個人資料頁面，可編輯公開資訊
 - [ ] 設定頁面內，可編輯帳號資訊
 - [ ] 可以追蹤或退追蹤其它使用者
 - [ ] 點擊頭貼照片，可進入使用者資料頁面瀏覽所有個人的追蹤資訊及貼文、回覆、喜歡的內容，排序由新到舊
 - [ ] 右側導覽版顯示追蹤數前10名的用戶

## Install 安裝指引
1. 於終端機(terminal)輸入指令，將專案複製至本地端
```shell
// HTTPS
git clone https://github.com/AlvinLee66/twitter-fullstack-2020.git
```
2. 移動到資料夾內 
`cd twitter-fullstack-2020`
3. 安裝所需之套件 
`npm install` 
4. 依.env.example檔案新增 .env及環境變數
`IMGUR_CLIENT_ID =`
5. 於MySQL新增資料庫
`CREATE DATABASE ac_twitter_workspace;`
6. 至config.json填寫資料庫密碼
7. 載入資料表設定及種子資料
 ``npx sequelize db:migrate`` 
 ``npx sequelize db:seed:all``
8. 使用`npm run dev` 啟動伺服器 (需安裝nodemon)
9. 終端機將顯示 `server is running on port 3000`, 可進入 http://localhost:3000 瀏覽網站
10. 測試帳號：

|  role |  account |  password |  note |
| ---- |---|---------|-----|
| User |user1|12345678 |user1~10 |
| Admin |root |12345678 |後台使用|
 mocha功能測試 `npm run test`
 測試網站: <heroku連結>

**Built with 開發環境**

- Node.js v14.16.0vv
- express v4.16.4
- MySQL
--
- express-handlebars v3.0.0
- express-session v1.15.6
- bcryptjs v2.4.3
- bcrypt-nodejs v0.0.3
- connect-flash v0.1.1
- method-override v3.0.0
- dotenv v10.0.0
- passport v0.4.0
- passport-local: v1.0.0
- dayjs v1.10.6

- faker v4.1.0
- imgur v1.0.2
- multer v1.4.3
- sequelize v6.18.0
- sequelize -cli v5.5.0
--
chai v4.2.0
mocha v6.0.2
sinon v10.0.0
sinon-chai v3.3.0
- 

**Contributor**
[Alvin](https://github.com/AlvinLee66) / [Kenny](https://github.com/chh817) / [Yaya](https://github.com/yaahsin)
