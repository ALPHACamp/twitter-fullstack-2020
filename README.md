# Simple Twitter
A simple social network platform, developed full-stack with Node.js, express framework and MySQL database.  

<br/>
<br/>

# Features（待更新）
- 
- 

<br/>
<br/>

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

1. Start the server
```
npm run star
```

If you see  `Example app listening on port 3000!`  on terminal, it means the server is running successfully and you can start exploring [Simple Twitter](http://localhost:3000/) on your browser.

<br>

2. Stop the server
```
control + c
```
<br/>
<br/>

# Seed User

## **Admin**
1 available account

* **account**: root  
  **password**: 12345678


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
- Bootstrap ^5.2.0
- Font Awesome ^6.2
- express-handlebars ^3.0.0
- express-session ^1.15.6
- method-override ^3.0.0
- bcryptjs ^2.4.3
- connect-flash ^0.1.1
- dotenv ^10.0.0
- passport ^0.4.0
- faker ^4.1.0
- dayjs ^1.10.6
- imgur ^1.0.2
- multer ^1.4.3
- mysql2 ^1.6.4
- sequelize ^6.18.0
- sequelize-cli ^5.5.0



<br/>
<br/>

#  Simple Tweet（待更新）
![Home Page]()
---
![Create Page]()
---
![Login Page]()
---