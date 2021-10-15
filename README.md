# Simple Twitter API    
### 以全端模式開發的 Simple Twitter 論壇網頁   

Live Demo： https://alphitter-turagon.herokuapp.com       

Github repo: https://github.com/Turagon/twitter-fullstack-2020       

### Getting Started       
### Function List   
使用者可以註冊、登入、登出
使用者註冊時 會即時顯示帳號是否可用           
使用者可以編輯個人資料 (account, name, email, password)     
使用者能編輯自己的暱稱、自我介紹、個人頭像與封面
使用者編輯帳號或是自我介紹時，即時顯示輸入字數         
使用者可以發表推文，回覆/按讚他人的推文     
使用者可以追蹤/取消追蹤他人     
登入的使用者可以看到以下頁籤：     
推文   
推文與回覆    
跟隨中的對象    
跟隨者   
喜歡的內容    
側邊欄可以看到追隨人數Top 10的使用者    
管理者(admin)可從後台登入頁面進入後台    
可以瀏覽全站的推文清單    
可以刪除任何一則推文    
可以瀏覽使用者數據summary，包括推文數、按讚數、追隨人數、追隨者人數     
管理者不能登入前台，使用者不能登入後台    

### Environment setup    
請預先安裝 NPM, MySQL, MySQL Workbench     

### Install    
在終端機輸入指令 clone 此專案至本機電腦，並安裝相關套件    
$ git clone https://github.com/Turagon/twitter-fullstack-2020    
$ cd twitter-fullstack-2020        
$ npm install     
設定環境變數檔案，將檔案 .env.example 檔名改為 .env。等號後面的字串可以自行修改。需要註冊並取得IMGUR_CLIENT_ID。 Imgur官網：https://imgur.com/       

MySQL Workbench 新增資料庫     

開發環境的資料庫名稱：twitter_workspace 測試環境的資料庫名稱：twitter_workspace_test 可參考config.json     

執行 migration     
$ npx sequelize db:migrate    
新增種子資料     
$ npx sequelize db:seed:all      
啟動 web server，看到 server on 表示啟動成功     
$ export NODE_ENV=development     
$ npm run dev     
server on    
測試帳號、密碼       
Admin 帳號：     
root@example.com     

一般使用者 帳號：     
user1@example.com     
user2@example.com    
user3@example.com     
user4@example.com    
user5@example.com    
user6@example.com      

密碼皆為：     
12345678      
Contributors     
Rex: https://github.com/Turagon  