'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678',bcrypt.genSaltSync(10), null),
      name: 'Admin',
      introduction:faker.lorem.sentences(5),
      avatar: faker.image.people(),
      role:'Admin',
      backgroundImg: faker.image.nightlife(),
      account: faker.name.firstName(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: faker.name.lastName(),
      introduction: faker.lorem.sentences(5),
      avatar: faker.image.people(),
      role: 'user',
      backgroundImg: faker.image.nightlife(),
      account: faker.name.firstName(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      id: 3,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: faker.name.lastName(),
      introduction: faker.lorem.sentences(5),
      avatar: faker.image.people(),
      role: 'user',
      backgroundImg: faker.image.nightlife(),
      account: faker.name.firstName(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: faker.name.lastName(),
      introduction: faker.lorem.sentences(5),
      avatar: faker.image.people(),
      role: 'user',
      backgroundImg: faker.image.nightlife(),
      account: faker.name.firstName(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: faker.name.lastName(),
      introduction: faker.lorem.sentences(5),
      avatar: faker.image.people(),
      role: 'user',
      backgroundImg: faker.image.nightlife(),
      account: faker.name.firstName(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      email: 'user5@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: faker.name.lastName(),
      introduction: faker.lorem.sentences(5),
      avatar: faker.image.people(),
      role: 'user',
      backgroundImg: faker.image.nightlife(),
      account: faker.name.firstName(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    // 每個使用者有10個tweets
    // 傳入array
    //{id, userid ,text}
    let user = 1
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((item, index) =>{
      if(index % 10 === 0) user++
      return {
        id: index + 1,
        UserId: user,
        description: faker.lorem.sentences(5),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }), {})

    //每篇post 有3個留言 留言的人不重複
    // id, userid, twweetid
    const replies = []
    const getRandom = (arr) => {
      while(arr.length < 3){
        let random = Math.floor(Math.random() * 5) + 2
        if(arr.includes(random)){
          random = Math.floor(Math.random() * 5) + 2
        } else {
          arr.push(random)
        }
      }
    }
    Array.from({ length: 50 }).forEach((item, index )=> {
      const user = []
      getRandom(user)
      replies.push({
        UserId: user[0],
        TweetId: index + 1,
        comment: faker.lorem.sentence(Math.floor(Math.random() * 10)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: user[1],
        TweetId: index + 1,
        comment: faker.lorem.sentence(Math.floor(Math.random() * 10)),
        createdAt: new Date(),
         updatedAt: new Date()
      },
      {
        UserId: user[2],
        TweetId: index + 1,
        comment: faker.lorem.sentence(Math.floor(Math.random() * 10)),
        createdAt: new Date(),
        updatedAt: new Date()
        })
      
    })
    await queryInterface.bulkInsert('Replies', replies, {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Users',null, {})
      await queryInterface.bulkDelete('Tweets', null, {})
      await queryInterface.bulkDelete('Replies', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
