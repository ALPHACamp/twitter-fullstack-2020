# twitter-fullstack-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (全端開發組)

## Dev Getting Start

1. Clone the project

```
git clone https://github.com/elliotcs30/twitter-fullstack-2020.git
```

2. create upstream connection 

```
git remote add upstream https://github.com/ALPHACamp/twitter-fullstack-2020.git
```

3. Install node 

```
npm i node
node -v
nvm use 14.16.0
```

4. Install the required dependencies

```
npm install
```

5. Check package version

```shell
  npm install nodemon@2.0.19
  npm install express@4.17.1
  npm install express-handlebars@4.0.2
  npm install body-parser@1.20.0
  npm install method-override@3.0.0
  npm install express-session@1.17.1
  npm install passport@0.4.1 passport-local@1.0.0
  npm install connect-flash@0.1.1
  npm install bcryptjs@2.4.3
  npm install dotenv@8.2.0
  npm init @eslint/config
  
  npm install cross-env // windows env install
```

5. Set environment variables in .env file according to .env.example

```
touch .env
```

windows environment need modify package.json file:

```json
  "scripts": {
    "start": "cross-env NODE_ENV=development node app.js",
    "dev": "cross-env NODE_ENV=development nodemon app.js",
    "lint": "eslint \"**/*.js\" --fi",
    "test": "cross-env \"NODE_ENV=test\" && mocha test --exit --recursive --timeout 5000"
  },
```


5. Seed your database 

```
npm run seed
```

6. Start the server

```
npm run dev
```

7. Execute successfully if seeing following message

```
App is running on http://localhost:3000
DB connected!
```