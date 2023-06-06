# Simple Twitter

## 專案初始化

### 初始化：
``` bash 
git clone https://github.com/awei1127/twitter-fullstack-2020.git
npm install
```

### 設定資料庫
在 MySQL Workbench 輸入以下指令，
注意名稱需要與 config/config.json 一致

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
#### 切換環境方式
查看現在在哪個環境，第一次輸入指令會回傳空白，代表正在使用 development 環境
```
echo $NODE_ENV
```
切換環境
例如：切換到 test 環境
```
export NODE_ENV=test
```

### 設定資料
記得兩個環境要執行
```
npx sequelize db:migrate
```


### 建立種子資料
```
npm run seed
```

### 執行測試
```
npm run test
```

## 共用帳號
請一律設定下面 2 組帳號以利驗收：
* 第一組帳號有 admin 權限：
  * email: root@example.com
  * password: 12345678
* 第二組帳號沒有 admin 權限：
  * email: user1@example.com
  * password: 12345678