const { User } = require('../models')
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const userService = {
  getTopUsers: (req, res, callback) => {
    return User.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM followships AS followship
              WHERE
                followship.followingId = User.id
                )`),
            'followerCount',
          ],
        ]
      },
      include: { model: User, as: 'Followers' },
      order: [
        [sequelize.literal('followerCount'), 'DESC'],
        ['updatedAt', 'DESC']
      ],
      limit: 10,
    })
      .then(users => {
        users = users.map(u => ({
          ...u.dataValues,
          isFollowed: u.Followers.map(u => u.id).includes(helpers.getUser(req).id)
        }))
        return callback({
          topUsers: users,
          loginUserId: helpers.getUser(req).id
        })
      })
      .catch(err => res.send(err))
  }
}

module.exports = userService