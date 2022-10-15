# twitter-fullstack-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (全端開發組)


## Live Demo
[Heroku Link](https://alphitter-eak.herokuapp.com/)

<img width="1005" alt="Screen Shot 2022-10-15 at 13 45 21" src="https://user-images.githubusercontent.com/103249772/195980814-c6da7e7c-4021-46ba-86a1-463bdc30aa68.png">

## Feature

- signup / signin / signout
  - 除了註冊和登入頁，使用者一定要登入才能使用網站
  - 當使用者尚未註冊便試圖登入時，會有錯誤提示
  - 使用者能編輯自己的 account、name、email 和 password
  - 註冊時，account 和 email 不能與其他人重複，若有重複會跳出錯誤提示
  - 編輯時，account 和 email 不能與其他人重複，若有重複會跳出錯誤提示
  
- User
  - 使用者能瀏覽所有的推文
  - 使用者點擊貼文時，能查看該則貼文的詳情與貼文回覆
  - 點擊貼文中使用者頭像時，能瀏覽該使用者個人資料及推文
  - 使用者可以按讚/取消按讚推文
  - 使用者可以追蹤/取消追蹤其他使用者
  - 使用者能發佈推文
  - 使用者能回覆別人的推文
  - 使用者能編輯自己的名稱、介紹、大頭照和個人背景
  - 使用者能在首頁的側邊欄，看見跟隨者數量排列前 10 的使用者推薦名單
  
- Admin
  - 管理者可以瀏覽站內所有的使用者清單
  - 管理者可以瀏覽全站的推文清單或刪除推文


## Environment settings

1. Install Node.js [reference](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac)
```
  npm i node
  node -v
  nvm use 14.16.0
```

2. MySQL
```
  install MySQL
```

3. windows environment need install file
```shell
  npm install cross-env
```


## Getting Start

1. Clone the project

```shell
git clone https://github.com/elliotcs30/twitter-fullstack-2020.git
```

2. Install the required dependencies
```shell
  npm install
```

3. Check package version

```shell
  npm install nodemon@2.0.19
  npm install express@4.17.1
  npm install express-handlebars@4.0.2
  npm install body-parser@1.20.0
  npm install method-override@3.0.0
  npm install express-session@1.17.1
  npm install passport@0.4.1 passport-local@1.0.0
  npm install connect-flash@0.1.1
  npm install bcryptjs@2.4.3
  npm install dotenv@8.2.0
  npm init @eslint/config
  
  npm install cross-env // windows env install
```

4. windows environment need install

```shell
  npm install cross-env
```

5. Set environment variables in .env file according to .env.example

```
touch .env
```


6. Seed create your database 

```
npm run dbinit
npm run seedinit
```

7. Start the server

```
npm run start         // for mac
npm run start-windows // for windows
```

8. Execute successfully if seeing following message

```
Example app listening on port 3000!
```
