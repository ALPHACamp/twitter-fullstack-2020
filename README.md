<h1 align='center'><b>Simple Twitter</b></h1>
A simple social network platform, developed full-stack with Node.js, express framework and MySQL database.  

<br>
<br>
<br>

# Table of Contetns
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Run Server](#run-server)
- [Seed Users](#seed-users)
- [Tech Stack](#tech-stack)
- [Demo](#demo)

<br>
<br>

# Features
A few things you can do on Simple Tweet:
- Browse tweets from everyone
- Post a tweet anytime to show your idea 
- Reply on other's tweet :speech_balloon:
- Like other's tweet :heart:
- Review users' profile


<br>
<br>

# Getting Started
## **Prerequisites**
Make sure you already have `Node.js` and `npm` installed, and have `MySQL` account.

<br>

## **Installing**
1. Clone the project and go to the project directory
```
 git clone https://github.com/Yunya-Hsu/twitter-fullstack-2020

 cd twitter-fullstack-2020
```

<br/>

2. Install dependencies
```
npm install
```

<br/>

3. Prepare your `.env` file. Please refer to `.env.example` for more details. 

<br/>

4. Create database at your `MySQL Workbench`
```
create database ac_twitter_workspace
```

<br/>

5. Apply migration and seed data  
**(Important: must apply migration FIRST)**
```
npx sequelize db:migrate
npx sequelize db:seed:all
```

<br/>

## **Run Server**

1. Start server
```
npm run start
```

If you see  `Example app listening on port 3000!`  on terminal, it means the server is running successfully and you can start exploring [Simple Twitter](http://localhost:3000/) on your browser.

<br>

2. Stop server
```
control + c
```
<br/>
<br/>

# Seed Users

## **Admin**
1 available account

* **account**: root  
  **password**: 12345678

<br/>

## **User**
15 available account

* **account**: user1  
  **password**: 12345678

* **account**: user2  
  **password**: 12345678


* **account**: user3, user4, user5,......user14, user15  
  **passwords**: always *12345678*  

<br/>
<br/>

# Tech Stack
- Node.js ^16.14.2
- express ^4.16.4
- mysql2 ^1.6.4
- sequelize ^6.18.0
- sequelize-cli ^5.5.0
- Bootstrap ^5.2.0
- Font Awesome ^6.2
- express-handlebars ^3.0.0
- express-session ^1.15.6
- passport ^0.4.0
- bcryptjs ^2.4.3
- connect-flash ^0.1.1
- body-parser ^1.18.3
- method-override ^3.0.0
- dayjs ^1.10.6
- dotenv ^10.0.0
- faker ^4.1.0
- imgur ^1.0.2
- multer ^1.4.3

<br>
<br>

#  Demo
![Home Page & Tweet Page](https://github.com/Yunya-Hsu/twitter-fullstack-2020/blob/master/public/images/README-01.jpeg)
---
![Profile Page](https://github.com/Yunya-Hsu/twitter-fullstack-2020/blob/master/public/images/README-02.jpeg)
---
![Post tweet, reply, modify personal information](https://github.com/Yunya-Hsu/twitter-fullstack-2020/blob/master/public/images/README-03.jpeg)
---
![Modify account, password, email](https://github.com/Yunya-Hsu/twitter-fullstack-2020/blob/master/public/images/README-04.jpeg)
---
![Admin Page](https://github.com/Yunya-Hsu/twitter-fullstack-2020/blob/master/public/images/README-05.jpeg)
---
