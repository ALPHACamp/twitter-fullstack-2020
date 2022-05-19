# Sample twitter

## 環境建置與需求 

1. [Node.js](https://nodejs.org/en/) (LTS)

## 專案下載 

1. 終端機 下載專案

```
git clone https://github.com/aziz0916/twitter-fullstack-2020.git
```

## 初始化
### Initialize

```
npm install (package.json 已提供相對應需安裝的套件)
```

### 資料庫安裝

```
https://dev.mysql.com/downloads/workbench/
```

### 設定本地資料庫
需要與 config/config.json 一致

1. 本地資料庫

```
帳號：root
密碼：password
```

2. 建立資料庫

```
create database ac_twitter_workspace;
```

### 設定種子資料

```
npx sequelize db:seed:all
```

### 執行

```
npm run dev
```

### 開啟程式

即啟動完成，可至 http://localhost:3000 進入登入頁

## 共用帳號
為下面 6 組帳號：
* 第一組帳號有 admin 權限：
  * account: root
  * password: 12345678
* 第二～六組帳號沒有 admin 權限：
  * account: user1 ~ user5
  * password: 12345678

## 功能描述 

### 使用者

1. 前台註冊,登入,登出功能
2. 使用者推文功能
3. 使用者回覆他人推文
4. 使用者能追蹤/取消追蹤
5. 使用者能like/unlike 推文
6. 使用者能查看特定使用者的 推文,已回覆的推文,對推文的like

### 管理者

1. 後台登入,登出功能
2. 管理者能查看所有推文，並可刪除任一推文
3. 管理者能查看到所有使用者的 推文總數,推文的like總數,跟隨中總數,跟隨者總數
