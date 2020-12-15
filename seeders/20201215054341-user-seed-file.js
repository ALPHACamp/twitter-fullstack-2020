const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Users',
//       Array.from({ length: 5 }).map((d, i) => ({
//         id: `${i + 1}`,
//         email: `user${i + 1}@example.com`,
//         password: bcrypt.hashSync(`${Math.random() * 8}`, bcrypt.genSaltSync(10), null),
//         account: `user${i + 1}`,
//         name: `user${i + 1}`,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }))
//       , {}).then((users) => users.map((user) => ({
//         queryInterface.bulkInsert('Tweets',
//           Array.from({ length: 10 }).map((index, i) => ({
//             id: `${index * 10 + i}`,
//             UserId: user.id,
//             description: faker.lorem.text(),
//             createdAt: new Date(),
//             updatedAt: new Date()
//           })), {})
//       })))
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Users', null, {})
//       .then(() => queryInterface.bulkDelete('Tweets', null, {}))

//   }
// };

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Users',
//       Array.from({ length: 5 }).map((d, i) => ({
//         id: `${i + 1}`,
//         email: `user${i + 1}@example.com`,
//         password: bcrypt.hashSync(`${Math.random() * 8}`, bcrypt.genSaltSync(10), null),
//         account: `user${i + 1}`,
//         name: `user${i + 1}`,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }))
//       , {})
//       .then(userId => queryInterface.bulkInsert('Tweets',
//         Array.from({ length: 10 }).map((_, i) =>
//         ({
//           UserId: userId,
//           description: faker.lorem.text(),
//           createdAt: new Date(),
//           updatedAt: new Date()
//         })
//         ), {}))
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Users', null, {})
//       .then(() => queryInterface.bulkDelete('Tweets', null, {}))
//   }
// }


// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Users',
//       Array.from({ length: 5 }).map((d, i) => ({
//         // id: `${i + 1}`,
//         email: `user${i + 1}@example.com`,
//         password: bcrypt.hashSync(`${Math.random() * 8}`, bcrypt.genSaltSync(10), null),
//         account: `user${i + 1}`,
//         name: `user${i + 1}`,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }))
//       , {})
//       .then(userId =>
//       (queryInterface.bulkInsert('Tweets',

//         Array.from({ length: 10 }).map((_, i) =>
//         ({
//           UserId: userId,
//           description: faker.lorem.text(),
//           createdAt: new Date(),
//           updatedAt: new Date()
//         })
//         )
//         , {})))


//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Users', null, {})
//       .then(() => queryInterface.bulkDelete('Tweets', null, {}))
//   }
// }


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 5 }).map((d, i) => ({
        id: `${i + 2}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync(`${Math.random() * 8}`, bcrypt.genSaltSync(10), null),
        account: `user${i + 1}`,
        name: `user${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })
        , {})
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}