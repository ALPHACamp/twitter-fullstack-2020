# Simple Twitter
This is a simple Twitter-like social networking service, developed full-stack using Node.js（Express framework） and MySQL database.

***
## Start to use Simple Twitter
*   Make sure that you have already installed [Node.js](https://nodejs.org/en/)

1.   Clone this project to your local place from github

          git clone https://github.com/LouisChen-TW/twitter-fullstack-2020.git
    
2.   Move into the project directory on your local place.

          cd twitter-fullstack-2020
    
3.   Install NPM packages are nescessary for this service.

          npm install
    
4.   Create .env and add environment variables. (* Notice: The environment variables that need to be used are listed in .env.example !)

          touch .env
    
5.   MySQL database migration. (* Notice: Don't forget to install MySQL in your device before database migration !)

          npx sequelize db:migrate
    
6.   Add Seed data for test (* Notice: Seed data include 6 users(root, user1, user2, user3, user4, and user5) for testing.)

          npx sequelize db:seed:all
    
7.   Now you can start the service on your local device.

          node app.js
    
## Continue to develop Simple Twitter
*   Make sure that you have already installed [Node.js](https://nodejs.org/en/)
1.   Don't forget to install [nodemon](https://www.npmjs.com/package/nodemon) to make your development process smoother.
        
          npm install -g nodemon
    
2.   Now you can start the service on your local device.

          nodemon app.js

***
## Seed user accounts for testing service
1.   This normal account can only login from front-side of service.
> Account(for normal users): user1  
> Email: user1@example.com  
> Password: 12345678  

2.   This administrator account can only login from back-side of service.
> Account(for normal users): root  
> Email: root@example.com  
> Password: 12345678  

***
## Normal account
### Login page
![image](https://user-images.githubusercontent.com/87403901/169696744-95e79076-6411-4acf-9730-76bbc00ea70b.png)

### User home page
![image](https://user-images.githubusercontent.com/87403901/169490737-9d5c756d-685a-44f7-a422-e2b996cbe88d.png)

### User personal page
![image](https://user-images.githubusercontent.com/87403901/169490894-a6b58ce9-f8ee-486a-9ce9-2fbb7c4ee8c7.png)

### User setting page
![image](https://user-images.githubusercontent.com/87403901/169490958-e3a33f69-de9b-4864-a5af-efaf2caf4fc7.png)

***
## Administrator account
### Login page
![image](https://user-images.githubusercontent.com/87403901/169491333-748328de-06e9-4c79-892c-57d34d3eafa3.png)

### Page showing all tweets of users
![image](https://user-images.githubusercontent.com/87403901/169491494-b3220b69-ed6b-448a-b11a-cfab8c5f6b59.png)

### Page showing all users
![image](https://user-images.githubusercontent.com/87403901/169491899-176cbccf-4a44-48ae-975a-c80bf793751e.png)

