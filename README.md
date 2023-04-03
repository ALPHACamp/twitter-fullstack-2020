# twitter-fullstack-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (全端開發組)
## 安裝所需環境

可執行git指令之終端機

## 安裝方法

1. 於終端機輸入下列指令，或直接將程式碼打包下載
```
git clone https://github.com/zell0323/twitter-fullstack-2020/
```
2. 進入專案資料夾
```
cd twitter-fullstack-2020
```
3. 下載所需套件 
```
npm install 
```
4. 依照config/config.json的development設定，建立MySQL資料庫
```js
  "development": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }

```
5. 執行migration，建立table和種子檔案
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
6. 執行專案，開啟虛擬伺服器
```
npm run dev
```
7. 於瀏覽器輸入網址 http://localhost:3000/ 

## 測試帳號

### 一般使用者
帳號：user1  
密碼：12345678
### 管理者（僅能進入後台）
帳號：root  
密碼：12345678


## 專案功能
一般使用者可推文、回覆推文、追蹤其他使用者、加入喜愛推文
管理者可刪除推文、看到使用者一覽

