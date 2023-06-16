# 測試相關資料

#### 切換環境方式
查看現在在哪個環境，第一次輸入指令會回傳空白，代表正在使用 development 環境
```
echo $NODE_ENV
```
切換環境
例如：切換到 test 環境
```
export NODE_ENV=test
export NODE_ENV=development
```

### 設定資料
記得兩個環境要執行
```
npx sequelize db:migrate
```

### 建立種子資料
```
npm run seed
npx sequelize db:seed:all
```

### 執行測試
```
npm run test
```

#### 個別測試檔
```
// models
npx mocha test/models/Followship.spec.js --exit
npx mocha test/models/Like.spec.js --exit
npx mocha test/models/Reply.spec.js --exit
npx mocha test/models/Tweet.spec.js --exit
npx mocha test/models/User.spec.js --exit

//admin
npx mocha test/requests/admin/login.spec.js --exit
npx mocha test/requests/admin/tweets.spec.js --exit
npx mocha test/requests/admin/user.spec.js --exit

// requests
npx mocha test/requests/followship.spec.js --exit
npx mocha test/requests/login.spec.js --exit
npx mocha test/requests/reply.spec.js --exit
npx mocha test/requests/tweet.spec.js --exit
npx mocha test/requests/user.spec.js --exit

```