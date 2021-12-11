# Simple-Twitter

簡易版本的 Twitter App<br>
[DEMO](https://simple-twitter-totomomo.herokuapp.com/signin)

## 功能列表

- 帳號密碼登入
- 使用者能夠建立推文
- 使用者能夠回覆推文
- 使用者能夠喜歡推文
- 使用者能夠追蹤其它帳號
- 使用者能夠修改帳號資料、自介資料
- Admin 有額外的登入頁面
- Admin 能夠瀏覽所有貼文並刪除
- Admin 能夠瀏覽所有使用都並查看社群活躍數值

### 需求

- Node.js & npm
- port 3000
- MySQL ( 建議使用 MySQL Workbench )

### 安裝

1.在本地目錄 clone repo 或 [download](https://github.com/tsaohs/twitter-fullstack-2020/archive/refs/heads/master.zip)

```
git clone https://github.com/tsaohs/twitter-fullstack-2020.git
```

2.安裝相依套件

```
cd twitter-fullstack-2020
```

```
npm install
```

3.確認 MySQL 連線帳密

```
- MySQL 連線帳密需要 root/password
- 或至 config/config.js 修改
```

4.建立資料庫 ( 從 MySQL Workbench 執行 )

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

5.匯入種子資料

```
npm run seed
```

6.開啟程式

```
npm run start
```

- 終端顯示 `Simple-Twitter app listening on port 3000` 即啟動完成，
- 用瀏覽器開啟 [http://localhost:3000](http://localhost:3000) 使用程式

## 運行截圖

![首頁](/public/img/index.jpg)

## 其它說明

- 使用 BootStrap 4.6
- 可重置種子資料

```
npm run seed
```

- 跑本地自動測試

```
npm run test
```
