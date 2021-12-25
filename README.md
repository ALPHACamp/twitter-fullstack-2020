# Simple Twitter
使用Express及Mysql 打造出來的一個簡單的社群網站。

![image](/public/images/Simple-Twitter-1.PNG)
![image](/public/images/Simple-Twitter-2.PNG)
![image](/public/images/Simple-Twitter-3.PNG)

## 產品功能
* 有屬於管理者的登入平台。
* 管理者可以瀏覽網站上所有的推文。
* 管理者可以刪除推文。
* 管理者可以在清單上瀏覽所有的使用者。
* 使用者必須登入才可以使用。
* 使用者可以註冊帳號。
* 使用者可以在設定頁面重新設定帳戶資訊。
* 使用者可以瀏覽自己的個人資料也可以瀏覽其他使用者的個人資料。
* 使用者可以編輯自己的個人資料。
* 使用者可以在首頁瀏覽社群網站所有使用者發佈的推文、喜歡數量及推文時間。
* 使用者可以在首頁輸入文字直接推文或點擊推文扭推文。
* 使用者可以點擊首頁推文進入個別推文查看回覆串。
* 使用者可以在個別推文頁面點擊回覆框留言。
* 使用者可以在個人資料查看自己所有發佈的推文、回覆過的留言及喜歡的內容。
* 使用者可以在個人資料頁面點擊追隨中、追隨者時會進入追隨頁面。
* 使用者可以在追隨頁面查看追隨狀況。
* 使用者可以追隨其他使用者。
* 使用者可以喜愛推文。
* 使用者可以在頁面右邊看到熱門的使用者。

## 環境建置
* Express: ^4.16.4
* Express-handlebars: ^3.0.0
* Express-session: ^1.17.2
* mysql2: ^1.6.4
* passport: ^0.4.1
* passport-local: ^1.0.0
* sequelize: ^4.44.4
* sequelize-cli: ^5.5.0
* body-parser: ^1.19.0
* method-override: ^3.0.0
* connect-flash: ^0.1.1
* faker: ^4.1.0
* imgur-node-api: ^0.1.0
* bcryptjs: ^2.4.3
* multer: ^1.4.3
* moment: ^2.29.1

## 專案安裝
1. 下載專案
```
git clone https://github.com/ZinXianY/twitter-fullstack-2020.git
```

2. 切換存放此專案資料夾
```
cd twitter-fullstack-2020
```

3. 安裝npm套件
```
npm install
```

4. 創建資料庫
```
create database ac_twitter_workspace;
```

5. 建立 migration
```
npx sequelize db:migrate
```

6. 建立 seeder
```
npx sequelize db:seed:all
```

7. 啟動伺服器執行檔案
```
npm run dev
```

8. 出現以下字樣表示啟動成功!
```
Example app listening on port 3000!
```

## 測試帳號
* 管理員帳號: root, 密碼: 12345678
* 使用者帳號: user1, 密碼: 12345678

## 開發人員
* Penny Pan
* 信
* Zin
