#種子生產順序

users-seed-file -> tweets-seed-file -> replies-seed-file

##種子介紹

### users-seed
1.生產兩個指定帳號
- 前台 user  
name:user1  
email:user1@example.com  
password: 12345678 
- 後台 admin 
name: root 
email: root@example.com 
password: 12345678 

2.隨機生產四個帳號

### tweets-seed
- 每個使用者有 10 篇 tweet

### replies-seed
- 每篇 tweet 有隨機 3 個留言者，每個人有 1 則留言