# twitter-fullstack-2020

ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (全端開發組)

# Launch

1. Make shure that you have installed node.js and npm

2.Install "MySQL Workbench", build a local connection, then create a query tab entering follow order and operate

`drop database if exists ac_twitter_workspace;`
`create database ac_twitter_workspace;`
`drop database if exists ac_twitter_workspace_test;`
`create database ac_twitter_workspace_test;`

3. Open terminal enter following order to copy the repository to local

`git clone https://github.com/weitungstyle/twitter-fullstack-2020.git`

4. Enter target folder

`cd twitter-fullstack-2020`

5. Create a ".env" file to use whole function, using your imgur client ID replace "SKIP". (We place a .env.example file for your reference.)

`IMGUR_CLIENT_ID=SKIP`

6. Install operating environment

`npm install`

7. Construct database

`npx sequelize db:migrate`

8. Create Seed data

`npx sequelize db:seed:all`

9. Run website

`npm run dev`

10. if operating successfully, the terminal will display following sentence:

`Example app listening on port 3000!`

11. Stop running:

press 'ctrl' + 'c'
