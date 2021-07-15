'use strict';

const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({
      where: { is_admin: false },
      attributes: ['id']
    })
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 5 }).map((d, i) => ({
        followerId: users[i % 5].id,
        followingId: users[(i + 2) % 5].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      , {})
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Followships', null, { truncate: true, restartIdentity: true })
  }
};


