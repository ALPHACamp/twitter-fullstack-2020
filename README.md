<div id="top"></div>

# Aphitter

![image](https://github.com/yulaie1012/twitter-fullstack-2020/blob/master/public/images/overview.png)

本專案為 Alpha Camp 全端開發結業作品

使用 Node.js、express framework、MySQL 等展示簡易的 Twitter 功能

* MySQL 資料庫規劃建立
* 資料庫 CRUD 操作及進階關聯 
* RESTful 路由及 API 設計
* MVC 架構

[Live Demo](https://frozen-dusk-97283.herokuapp.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Table of Contents

  - [Showcase](#showcase)
  - [Features](#features)
  - [Environment Setup](#environment-setup)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
  - [Acknowledgments](#acknowledgments)

## Showcase

![image](https://github.com/yulaie1012/twitter-fullstack-2020/blob/master/public/images/sample.gif)

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

1. **註冊／登入／登出**
   * 除了註冊和登入頁，使用者一定要登入才能使用網站
     * 後端驗證錯誤，頁面重新整理後顯示錯誤提示
   * 註冊時，使用者可以設定 account、name、email 和 password
   * 使用者能編輯自己的 account、name、email 和 password
   * 註冊／編輯時，account 和 email 不能與其他人重覆，若有重覆會跳出錯誤提示
     * 錯誤提示「account 已重覆註冊！」或「email 已重覆註冊！」，頁面重新整理後顯示錯誤提示
   * 使用者能編輯自己的暱稱、自我介紹、個人頭像與封面

2. **推文留言**
   * 使用者能在首頁瀏覽所有的推文，所有推文依建立的時間排序，最新的在前
   * 點擊推文方塊時，能查看推文與回覆串
   * 使用者能回覆別人的推文
     * 回覆文字不能為空白
     * 若不符合規定，會跳回同一頁並顯示錯誤訊息
   * 點擊推文中使用者頭像時，能瀏覽該使用者的個人資料及推文
   * 使用者能新增推文
     * 推文字數限制在 140 以內
     * 推文不能為空白

3. **使用者互動**
   * 使用者可以追蹤／取消追蹤其他使用者（不能追蹤自己）
   * 使用者能對別人的推文按 Like/Unlike
   * 使用者能編輯自己的名稱、介紹、大頭照和個人頁橫幅背景

4. **數據摘要**
   * 任何登入使用者都可以瀏覽特定使用者的以下資料：
     * 推文（Tweet）：排序依日期，最新的在前
     * 推文與回覆（Reply）：使用者回覆過的內容，排序依日期，最新的在前
     * 跟隨中（Following）：該使用者的關注清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
     * 跟隨者（Follower）：該使用者的跟隨者清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
     * 喜歡的內容（Like）：該使用者 like 過的推文清單，排序依 like 紀錄成立的時間，愈新的在愈前面
   * 使用者能在首頁的側邊欄，看見跟隨者數量排列前 10 的使用者推薦名單

5. **後台**
   * 管理者可從專門的後台登入頁面進入網站後台
     * 管理者帳號不可登入前台
     * 若使用管理帳號登入前台，或使用一般使用者帳號登入後台，等同於「帳號不存在」
   * 管理者可以瀏覽全站的推文清單
     * 可以直接在清單上快覽推文的前 50 個字
     * 可以在清單上直接刪除任何人的推文
   * 管理者可以瀏覽站內所有的使用者清單，清單的資訊包括
     * 使用者社群活躍數據，包括推文數量、關注人數、跟隨者人數、推文被 like 的數量 （Sprint #2 討論註記：「推文數量」指使用者的推文累積總量；「推文被 like 的數量」指使用者的推文獲得 like 的累積總量）
     * 清單預設按推文數排序

<p align="right">(<a href="#top">back to top</a>)</p>

## Environment Setup

* 使用 Node.js v10.15.0 或以上版本
* 其他套件請參閱 package.json

<p align="right">(<a href="#top">back to top</a>)</p>

## Installation

1. 下載本專案到本地端
   ```bash
   git clone https://github.com/yulaie1012/twitter-fullstack-2020.git
   ```

2. 移動當前路徑至專案
   ```bash
   cd twitter-fullstack-2020
   ```

3. 快速設置（包含：安裝 NPM 套件、建立資料庫、建立資料表、建立種子資料）
   ```bash
   npm run setup
   ```

4. 在根目錄新增 .env 以設置環境變數（執行下列或參照 .env.example 進行修改）
   ```bash
   echo PORT=3000 > .env &
   echo SESSION_SECRET=ENTER_YOUR_SESSION_SECRET >> .env &
   echo IMGUR_CLIENT_ID=ENTER_YOUR_IMGUR_CLIENT_ID >> .env
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage

* 啟動（於本地端運行 http://localhost:3000）
  ```bash
  npm run start
  ```

* 開發模式（需安裝[nodemon](https://www.npmjs.com/package/nodemon)）（於本地端運行 http://localhost:3000）
  ```bash
  npm run dev
  ```

* 種子資料重置
  ```bash
  npm run seed
  ```

* 資料庫重置（正式和測試的資料庫）
  ```bash
  npm run reset
  ```

* mocha 自動化測試
  ```bash
  npm run test
  ```

* 種子資料
    * 管理者（後台）
      * account: root
      * email: root@example.com
      * password: 12345678
    * 使用者（前台）
      * account: user1 ~ user5
      * email: user1@example.com ~ user5@example.com
      * password: 12345678

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

歡迎 pull request，如有重大改變，請先開啟 issue 討論您將執行的更新／升級。

請確保根據需要更新測試。

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Andrew Wu - [GitHub](https://github.com/andy2148deathedge)

CY Liao - [GitHub](https://github.com/liaochungyid)

Jason Luo - [GitHub](https://github.com/yulaie1012)

<p align="right">(<a href="#top">back to top</a>)</p>

## Acknowledgments

* [Alpha Camp](https://tw.alphacamp.co/)

<p align="right">(<a href="#top">back to top</a>)</p>

## License

[MIT](https://github.com/yulaie1012/twitter-fullstack-2020/blob/master/LICENSE.text)

<p align="right">(<a href="#top">back to top</a>)</p>