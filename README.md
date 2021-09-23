# Twitter fullstack
一個使用 Node.js + Express 打造的社群網站，並透過 MySQL 資料庫取得資料。 可以註冊帳號，並使用帳號登入。 可以在首頁瀏覽所有最新的貼文，並自己新增推文。

## 專案畫面
首頁
![image](https://github.com/0Trevor-Lin0/twitter-fullstack-2020/blob/master/picture/Twitter%E9%A6%96%E9%A0%81.png)


個人資料詳細頁面
![image](https://github.com/0Trevor-Lin0/twitter-fullstack-2020/blob/master/picture/Twitter%E5%80%8B%E4%BA%BA%E8%A9%B3%E7%B4%B0%E9%A0%81.png)

## Features - 產品功能

1. 使用者可以註冊帳號，並透過註冊的帳號密碼登入或登出。
2. 使用者可以新增貼文，並在首頁看見所有使用者的貼文、推文時間。
3. 使用者可以點擊任意貼文，查看詳細內容、新增回覆留言、按下或取消喜歡。
4. 使用者可以只瀏覽自己按下喜歡的內容、自己貼文以及回覆。
5. 使用者可以追蹤或取消追蹤其他使用者。
6. 使用者可以修改自己的帳號密碼等個人資料。
7. 使用者可以點擊任一頭貼，查看該使用者的詳細資訊。


## Environment SetUp - 環境建置
1. MySQL 8.0 以上
2. Node.js

## Installing - 專案安裝流程
1. 打開 terminal，Clone 此專案至本機電腦
```
git clone 網址：
```
2. 開啟終端機(Terminal)，進入存放此專案的資料夾
```
cd twitter-fullstack-2020
```
3. 安裝 npm 套件
```
在 Terminal 輸入 npm install 指令
```
4. 安裝 nodemon 套件
```
在 Terminal 輸入 nodemon app.js 指令
```
5. 匯入種子檔案與初始設定
```
在 Terminal 輸入 
npx sequelize db:migrate 
npx sequelize db:seed:all 
```
6. 啟動伺服器，執行 app.js 檔案
```
nodemon app.js
```
7. 當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結
```
Example app listening on http://localhost:${PORT}!
```
8. 可使用種子資料的帳號密碼登入
一般使用者
```
帳號：user1
密碼：12345678
```
後台管理員
```
信箱：root@example.com
密碼：12345678
```
## Contributor - 專案開發人員

[0Trevor-Lin0](https://github.com/0Trevor-Lin0)  
[Demilululu](https://github.com/Demilululu)  
[Wei](https://github.com/a1234567045)  












