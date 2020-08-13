## Simple Twitter

![index](/public/images/index.png)
![index](/public/images/tweet.png)


## Prerequisites

[MySQL workbranch](https://dev.mysql.com/downloads/workbench/)


## Browse on Heroku

### [Simple Twitter](https://radiant-headland-29348.herokuapp.com/signin)

You can use below account sign in or register now
```
(admin)
root@example.com
12345678

(user)
user1@example.com
12345678
```


## or install to Local computer

[Download](https://github.com/wanglala5131/twitter-fullstack-2020/archive/master.zip) or clone repository to your local computer.
```
$ git clone https://github.com/wanglala5131/twitter-fullstack-2020.git
```
Install
```
$ npm install
```

Setting database
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

`Alphitter listening on port 3000!`

will show on terminal when server connect success.

#### Browse [http://localhost:3000](http://localhost:3000) 


## Contributors
[Carey](https://github.com/schiafang/) /
[拉拉](https://github.com/wanglala5131) / 
[Denny](https://github.com/denny1011133)


