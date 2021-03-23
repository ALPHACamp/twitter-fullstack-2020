# Simple Twitter

簡易版的Twitter，可以發表tweet以及看到用戶分析。

## Features - 功能

1. COMING SOON.

## Prerequisites - 系統需求

1. [Node.js] v14.15.1 (https://nodejs.org/en/)
2. [MySQL] v8.0.23 (https://dev.mysql.com/downloads/mysql/)

## Installation - 安裝流程

1. Install [nvm](https://github.com/nvm-sh/nvm) - 安裝nvm，nodejs的管理系統

2. Use [nvm] to install [nodejs] v14.15.1 - 利用nvm去安裝及使用nodejs ver.14.15.1
```
nvm install 14.15.1
nvm use 14.15.1
```

3. Run command to install dependencies. - 安裝需要的套件
```
npm install
```

4. Download [MySQL](https://dev.mysql.com/downloads/mysql/) v8.0.23 - 下載 MySQL Community Server version 8.0.23

5. Install the [MySQL] installation - 運行及安裝 MySQL 的安裝檔
  5-1.  During the installation, please select MySQL server config option to 'Use Legacy Password Encryption'
        安裝過程中，MySQL Server config 請選擇使用 ‘Use LEgacy PAssword Encryption'
  5-2.  Remember the password set for root user, you will need to update the credentials in /config/config.json, under 'development' curly bracket
        將設定好的root帳密更改到/config/config.json這個檔案裏development下的user/password

6. Open your preferred [MySQL] database GUI, personally I recommend the following
  - [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
  - OSX users, I recommend [SequelPro](https://www.sequelpro.com/)

7. Use the GUI tool to connect to your localhost MySQL database, then execute all three lines of SQL.
```
DROP DATABASE IF EXISTS ac_twitter_workspace;
DROP DATABASE IF EXISTS ac_twitter_workspace_test;
CREATE DATABASE ac_twitter_workspace;
CREATE DATABASE ac_twitter_workspace_test;
USE ac_twitter_workspace;
```

8. Initialise and prepare [MySQL] database with sample data. Run the command below in terminal - 初始化並預先加入Sample data，請在終端機執行以下指令
```
npx sequelize db:migrate
npx sequelize db:seed:all
```

9. Start the web application, run the command below in terminal - 啟動專案，請在終端機執行以下指令
```
npm run start
```

## Contributor

> [Thumper](https://github.com/thumperL)

> [Newush](https://github.com/newush)

> [YounChu](https://github.com/linchuaccount)