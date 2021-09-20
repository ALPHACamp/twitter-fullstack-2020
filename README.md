# Simple Twitter

Heroku: https://radiant-depths-21853.herokuapp.com/signin

# 網站畫面

登入入口

![image](https://user-images.githubusercontent.com/65526955/98960574-8f2a1800-253f-11eb-86e3-449edf337097.png)

twitter頁面

![image](https://user-images.githubusercontent.com/65526955/98960698-b385f480-253f-11eb-87e0-619ea913cb5c.png)

 公開聊天室
 
 ![image](https://user-images.githubusercontent.com/65526955/99030085-1c588580-25af-11eb-91a4-85310cf46e76.png)

# 網站功能


+ 註冊成為一般使用者即可使用該網站

+ 使用者可以發佈貼文

+ 使用者可以喜歡/取消喜歡貼文

+ 使用者可以追蹤/取消追蹤其他使用者

+ 使用者可以修改個人帳戶與編輯個人資料

+ 使用者可以追蹤,退追蹤其他使用者

+ 使用者可以到貼文底下留言按like

+ 使用者可以在公開聊天室與同時在線的朋友聊天


# How to run this project
1. To build this project locally:
```
git clone https://github.com/michaelnctu/twitter-fullstack-2020.git
```
2. After directing into the file
```
npm install
```
3. nodemon
```
npm install nodemon 
```
4. Workbench新增database
```
CREATE DATABASE forum;
```
5. Workbench使用database
```
use forum;
```
6.匯入遷徙檔案
```
npx sequelize db:migrate
```
8.匯入種子資料
```
npx sequelize db:seed:all
```
9.啟動程式
```
node app.js or nodemon app.js
```
10.成功執行
```
在 terminal 可以看到 Example app listening on port 3000!
```
11.開啟瀏覽器
```
網址列輸入localhost:3000
```

# 測試帳號
| 帳號 | 密碼 |
| :------------- | :------------- |
| @root | 12345678  |
| @user1 | 12345678  |
| @user2| 12345678  |


# Dependencies
+ Node.js: v12.15.0
+ Express: v4.17.1
+ Express-Handlebars: v5.1.0
+ mysql2: v2.1.0
+ sequelize: v6.3.5
+ sequelize-cli: v6.2.0
+ imgur-node-api": "^0.1.0"
+ dotenv": "^8.2.0"
+ express": "^4.16.4"
+ express-handlebars": "^5.1.0"
+ express-session": "^1.17.1"
+ faker": "^4.1.0"
+ imgur-node-api": "^0.1.0"
+ method-override": "^3.0.0"
+ socket.io": "^2.3.0" 

# 共同開發人員

ShengYao: https://github.com/ShengYaoHuang

Eric Hsu: https://github.com/hsiyu1121/

