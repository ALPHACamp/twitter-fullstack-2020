# Simple Twitter
For ALPHACamp Simple Twitter full-stack project.

## How to start
* Clone the project
```bash
git clone https://github.com/tree12132002/twitter-fullstack-2020
```
* Move current directory to the project
```bash
cd *path to the file*/twitter-fullstack-2020
```
* Install NPM packages
```bash
npm install
```
* Duplicate ``.env.example`` file, changing name to `.env`
* Database migration(be sure that you've already installed a MySQL database)
```bash
npx sequelize db:migrate
```
* Generate seed data
```bash
npx sequelize db:seed:all
```
* Start the app server
```bash
npm run start
```
for development
```bash
npm run dev
```

## Seed User
* **Account(for front-side)**: user1  
  **Email**: user1@example.com  
  **Password**: 12345678

* **Account(for back-side)**: root  
  **Email**: root@example.com  
  **Password**: 12345678