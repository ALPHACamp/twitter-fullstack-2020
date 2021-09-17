'use strict';

const randomArray = [];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Likes',
        [1, 14, 24, 34, 44, 48].map((item, i) => ({
          id: i + 1,
          UserId: 2,
          TweetId: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })), {}),
      queryInterface.bulkInsert('Likes',
        [2, 3, 4, 5, 6, 7].map((item, i) => ({
          id: i + 7,
          UserId: 3,
          TweetId: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })), {}),
      queryInterface.bulkInsert('Likes',
        [3, 22, 23, 24, 25, 26].map((item, i) => ({
          id: i + 13,
          UserId: 4,
          TweetId: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })), {}),
      queryInterface.bulkInsert('Likes',
        [38, 42, 41, 49, 27, 28].map((item, i) => ({
          id: i + 19,
          UserId: 5,
          TweetId: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })), {}),
      queryInterface.bulkInsert('Likes',
        [39, 33, 34, 35, 36, 37].map((item, i) => ({
          id: i + 25,
          UserId: 6,
          TweetId: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })), {}),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
