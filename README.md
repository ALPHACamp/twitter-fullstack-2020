## Simple Twitter

![](https://i.imgur.com/4YnRjTE.jpg)

## Database

[MySQL](https://www.mysql.com)

## Prerequisites

- "bcrypt-nodejs": "0.0.3",
- "bcryptjs": "^2.4.3",
- "body-parser": "^1.18.3",
- "chai": "^4.2.0",
- "connect-flash": "^0.1.1",
- "dotenv": "^8.2.0",
- "express": "^4.16.4",
- "express-handlebars": "^3.0.0",
- "express-session": "^1.15.6",
- "faker": "^4.1.0",
- "imgur-node-api": "^0.1.0",
- "method-override": "^3.0.0",
- "mocha": "^6.0.2",
- "moment": "^2.29.1",
- "multer": "^1.4.2",
- "mysql2": "^1.6.4",
- "passport": "^0.4.0",
- "passport-local": "^1.0.0",
- "pg": "^8.5.1",
- "sequelize": "^4.42.0",
- "sequelize-cli": "^5.5.0",
- "sinon": "^7.2.3",
- "sinon-chai": "^3.3.0"

## View on Heroku

### [Simple Twitter](https://twitter-by-ajas.herokuapp.com/)

Use account below to sign in or register.

```
(admin)
root
12345678

---

(user)
user1
12345678
```

## or install to Local

[Download](https://github.com/jefflin-git/twitter-fullstack-2020.git) or clone this repository to your folder.

```
$ git clone https://github.com/jefflin-git/twitter-fullstack-2020.git
```

Install

```
$ npm install
```

Set database

```
username: root
password: password
database: ac_twitter_workspace
```

Migrate

```
$ npx sequelize db:migrate
```

Get imgur client id
[imgur API](https://api.imgur.com/oauth2/addclient)

```
1. add .env              <add file name .env>
2. IMGUR_CLIENT_ID=XXX   <your imgur client id>
3. SECRET=XXX            <set your secret string>
```

Execute

```
$ node app.js
```

`Example app listening on port 3000!`

will show on the terminal when server connect successfully.

#### Browse http://localhost:3000

## Contributors

- [Jeff](https://github.com/jefflin-git)
- [Shun](https://github.com/chuni-lin)
- [Alan](https://github.com/alanchang920)
