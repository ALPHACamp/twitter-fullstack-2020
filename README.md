# # Simple Twitter

ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (全端開發組)

### Live Demo

[Heroku Link](https://cryptic-earth-77265.herokuapp.com/users/64/likes)

![首頁畫面](https://github.com/weitungstyle/twitter-fullstack-2020/blob/master/public/%E9%A6%96%E9%A0%81%E6%88%AA%E5%9C%96.jpg)

### 功能描述

- 註冊及登入功能

  - 註冊身分，以帳號、名稱、Email、密碼(密碼以 bcrypt 加密)
  - 註冊時，帳號 和 email 不能與其他人重複，否則會跳出錯誤提示
  - 使用者需登入才能進入網站主頁
  - 使用者未註冊試圖登入時，會有錯誤提示
  - 使用者能編輯自己的 帳號、名稱、Email、密碼
  - 編輯時，帳號 和 email 不能與其他人重複，否則會跳出錯誤提示

- 使用者 ( User )

  - 可以新增個人貼文
  - 可以瀏覽所有推文，排序 新 → 舊
  - 點擊貼文時，可以查看該則貼文與回覆
  - 在貼文頁，點擊 🗨 可以回覆別人的推文
  - 點擊 ❤ 可以 like 貼文/unlike 貼文
  - 可以追隨/取消追隨其他使用者
  - 可以編輯自己的名稱、自我介紹、大頭照及個人背景
  - 可以在首頁的右側欄，瀏覽 Top 10 的使用者推薦名單

- 管理者 ( Admin )
  - 可以瀏覽所有的使用者清單
  - 可以瀏覽所有推文清單或刪除推文

### 測試帳號

1. User (提供使用者: user1~user5 )

   > account : user1
   > Password: 12345678

2. Admin
   > Account : root
   > Password: 12345678

### Launch

1. Make shure that you have installed node.js and npm

2. Install "MySQL Workbench", build a local connection, then create a query tab entering following order and operate

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
```

3. Open terminal enter following order to copy the repository to local

```
git clone https://github.com/weitungstyle/twitter-fullstack-2020.git
```

4. Enter target folder

```
cd twitter-fullstack-2020
```

5. Create a ".env" file to use whole function, using your imgur client ID replace "SKIP". (We place a .env.example file for your reference.)

```
IMGUR_CLIENT_ID=SKIP
```

6. Make shure the config.json is suited to your local database's username and password

```
"development": {
    "username": "<your username>",
    "password": "<your password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
```

7. Install operating environment

```
npm install
```

8. Construct database

```
npx sequelize db:migrate
```

9. Create Seed data

```
npx sequelize db:seed:all
```

10. Run website

```
npm run start
```

11. if operating successfully, the terminal will display following sentence:

```
Example app listening on port 3000!
```

12. Stop running:

press 'ctrl' + 'c'

### Alpha Camp 學員 Simple Twitter 專案開發小組

**Contributor**
[Victor](https://github.com/weitungstyle) /[Joy](https://github.com/JoyWanddrr) /[樺](https://github.com/Hua0720)
