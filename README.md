# twitter-fullstack-2020

# 測試帳號
## 前台
帳號:user1
密碼:12345678

## 後台
帳號:root123
密碼:12345678

# README

## 安裝步驟
1. 使用終端機，clone此專案到local位置


        git clone https://github.com/kyle5408/twitter-fullstack-2020.git
2. 使用終端機，進入此專案所在的資料夾


        cd 資料夾路徑

3. 安裝套件


        npm install
4. 安裝MySQL並按照config.json新增development用DB


        ac_twitter_workspace
5. 透過Sequelize cli建立table


        npx sequelize db:migrate

6. 透過Sequelize migration指令建立種子資料


        npx sequelize db:seed:all

7. 參照.env.example檔案建立.env檔案並設定環境參數

8. 建立遠端分支

        git checkout -b master
9. 啟動伺服器



        npm run dev
10. 看到以下字樣代表成功啟動並監聽server


        Example app listening on http://localhost:3000
        
## 執行測試
1. 輸入


        export NODE_ENV=test
2. 參照config.json在MySQL建立ac_twitter_workspace_test
3. 重複5、6步驟
4. 輸入
   
   
        npm test
