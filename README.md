# Simple Twitter

使用 Node.js & Express 打造類似Twitter的網站。

### Live Demo

[Heroku Link](https://desolate-springs-18796-e305e3af2d92.herokuapp.com/signi)

### 產品功能

1. 使用者提供指定資訊即可註冊帳號並使用後續功能。註冊所需資料包括：帳號、名稱、Email、密碼、確認密碼。
2. 當使用者進行註冊時，提示使用者輸入是否合乎所需資料格式。
3. 使用者進行註冊的帳戶和email不會與他人重複。
4. 使用者必須登入才能開始使用，並在未註冊時登入會有錯誤提示阻擋。
5. 使用者成功登入後，首頁為所有使用者的推文，順序由最新排至最舊
6. 使用者可以回覆每篇貼文、觀看所有推文的所有回覆
7. 使用者可以對貼文按下喜歡做喜歡紀錄或取消喜歡推文的紀錄。
8. 使用者可以到設定頁做個人帳戶編輯設定，並且無法修改他人帳戶。
9. 使用者可以透過個人檔案編輯個人大頭照、頁面背景照、自我介紹，及暱稱。
10. 貼文、回覆、編輯檔案抖有相對應限制，當使用者使用相關功能時會做提示。
11. 使用者可以根據自己喜好任意追蹤或取消追蹤其他使用者。
12. 管理者可以查看所有的推文、及刪除推文。
13. 管理者可以查看所有的使用者資訊，包括推文數、喜歡數量、被追蹤、追蹤數量。

### 測試帳號

1. User (提供使用者: user1~user10 )

   > account : user1
   > Password: 12345678
2. Admin
   > Account : root
   > Password: 12345678

### 安裝流程

1.開啟終端機將專案存至本機，在終端機輸入 :
```
git clone https://github.com/eunicebibi/twitter-fullstack-2020.git
```

2. 使用終端機指令，進入存放此專案的資料夾。

```
cd twitter-fullstack-2020
```


3. 安裝`npm`套件，在終端機輸入：
```
npm install
```

4.環境變數設定 請參考.env.example檔案設定環境變數，並將檔名改為.env
```
IMGUR_CLIENT_ID= 
```

5. 開啟MySQLWorkbench ，使用SQL指令，在本地建立資料庫。

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
use ac_twitter_workspace;
```

6. 回到專案資料夾下使用終端機，建立mySQL Table。

```
npx sequelize db:migrate
```

7. 匯入種子檔案， 產生測試用的初始資料。

```
npx sequelize db:seed:all
```

8. 執行npm腳本指令，啟動伺服器

```
npm run dev
```

9. 使用

當終端機出現下列訊息，可開啟瀏覽器輸入 http://localhost:3000 使用

```
Example app listening on port 3000!
```


### 共同開發人員
[Eunice](https://github.com/eunicebibi)
[HuangYiLun](https://github.com/HuangYiLun)
[LongXiangL](https://github.com/LongXiangL)