# twitter-fullstack-2020
The simple twitter project built with NODE.js, Express framework and MySQL.

## 環境
NODE.js v14.15.0

## 測試帳號
| 帳號     | 信箱           | 密碼  |
| ------------- |:-------------:| -----:|
| root     | root@example.com   | 12345678 |
| user1    | user1@example.com  | 12345678 |
| user2    | user2@example.com  | 12345678 |
| user3    | user3@example.com  | 12345678 |
| user4    | user4@example.com  | 12345678 |
| user5    | user5@example.com  | 12345678 |

## 安裝
開啟終端機(Terminal)到欲存放的資料夾(本機)位置，輸入以下指令
```
$ git clone Ace1862020/twitter-fullstack-2020.git
```
安裝套件
```
npm install
```
在Imgur上創建專案
並在專案的根目錄新增.env檔，建立你的 IMGUR_ID
```
IMGUR_CLIENT_ID="YOUR IMGUR CLIENT ID"
```
新增migrate
```
npx sequelize db:migrate
```
新增種子資料
```
npx sequelize db:seed:all
```
執行專案
```
npm run dev
```
在本機端 ![http://localhost:3000](http://localhost:3000) 開啟網址
