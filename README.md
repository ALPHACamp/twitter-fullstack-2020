# Simple Twitter
This is a simple Twitter-like social networking service, developed full-stack using Node.js（Express framework） and MySQL database.

***
## Start to use Simple Twitter
*   Make sure that you have already installed [Node.js](https://nodejs.org/en/)

1.   Clone this project to your local place from github.

          git clone https://github.com/LouisChen-TW/twitter-fullstack-2020.git
    
2.   Move into the project directory on your local place.

          cd twitter-fullstack-2020
    
3.   Install NPM packages are nescessary for this service.

          npm install
    
4.   Create .env and add environment variables. (* Notice: The environment variables that need to be used are listed in .env.example !)

          touch .env
          
5.   Create MySQL database on [MySQL Workbench](https://dev.mysql.com/downloads/workbench/). (* Notice: Don't forget to install [MySQL](https://dev.mysql.com/downloads/mysql/) on your device !)
* MySQL database related settings can be found in [config.json](https://github.com/LouisChen-TW/twitter-fullstack-2020/blob/main/config/config.json).

         create database ac_twitter_workspace
         
![image](https://user-images.githubusercontent.com/87403901/169786509-88234796-1078-4523-855b-c2b14bf27a7e.png)

    
6.   MySQL database migration.

          npx sequelize db:migrate
    
7.   Add Seed data for test (* Notice: Seed data include 6 users(root, user1, user2, user3, user4, and user5) for testing.).

          npx sequelize db:seed:all
    
8.   Now you can start the service on your local device.

          node app.js
          
9.   Start exploring >>> [Simple Twitter](http://localhost:3000/) <<< on your browser.
          
    
## Continue to develop Simple Twitter
*   Make sure that you have already installed [Node.js](https://nodejs.org/en/)
1.   Don't forget to install [nodemon](https://www.npmjs.com/package/nodemon) to make your development process smoother.
        
          npm install -g nodemon
    
2.   Now you can start the service on your local device.

          nodemon app.js
          
3.   Start exploring >>> [Simple Twitter](http://localhost:3000/) <<< on your browser.


***
## Seed user accounts for testing service
1.   This normal account can only login from front-side of service.
> Account(for normal users): user1  
> Email: user1@example.com  
> Password: 12345678  

2.   This administrator account can only login from back-side of service.
> Account(for administrator): root  
> Email: root@example.com  
> Password: 12345678  

***
## Normal account
### Login page
![image](https://user-images.githubusercontent.com/87403901/169774645-f748e6b7-e18f-4ff0-a4eb-6936a42a393f.png)

### Normal user's home page
![image](https://user-images.githubusercontent.com/87403901/169490737-9d5c756d-685a-44f7-a422-e2b996cbe88d.png)

### Normal user's personal page
![image](https://user-images.githubusercontent.com/87403901/169490894-a6b58ce9-f8ee-486a-9ce9-2fbb7c4ee8c7.png)

### Normal user's setting page
![image](https://user-images.githubusercontent.com/87403901/169490958-e3a33f69-de9b-4864-a5af-efaf2caf4fc7.png)

***
## Administrator account
### Login page
![image](https://user-images.githubusercontent.com/87403901/169491333-748328de-06e9-4c79-892c-57d34d3eafa3.png)

### Administrator's tweet list page (* Notice: Administrator can delete tweets directly on the page.)
![image](https://user-images.githubusercontent.com/87403901/169491494-b3220b69-ed6b-448a-b11a-cfab8c5f6b59.png)

### Administrator's user list page
![image](https://user-images.githubusercontent.com/87403901/169491899-176cbccf-4a44-48ae-975a-c80bf793751e.png)

***
## Registration function
* The registration function can only register normal user accounts.
* If you want to create an administrator account, you can only create it directly on the MySQL database, and the "role" of the account is equal to "admin".
### Register page
![image](https://user-images.githubusercontent.com/87403901/169777879-07ddbf3c-66de-4e31-b9d8-6616da0554bb.png)


