const imgur = require('imgur-node-api')
const db = require('./models')
const User = db.User
const sequelize = require('sequelize')
function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

const imgPromise = (file) => {
  return new Promise((resolve, reject) => {
    imgur.upload(file.path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img.data.link)
    })
  })
}

const getTopUser = async (req) => {
  let users = await User.findAll({
    limit: 10,
    attributes: {
      include: [
        [
          sequelize.literal(`(
              SELECT COUNT(*)
              FROM Followships AS Followship
              WHERE Followship.followingId = User.id
            )`),
          'FollowerCount'
        ]
      ]
    },
    order: [
      [sequelize.literal('FollowerCount'), 'DESC']
    ],
    where: {
      role: 'user'
    },
    include: [
      { model: User, as: 'Followers' } //找出每個User被追蹤的名單(user.Followers)
    ]
  })

  users = users.map(user => ({
    ...user.dataValues,
    isFollowed: getUser(req).Followings.some(d => d.id === user.id)
  }))
  return users
}

module.exports = {
  ensureAuthenticated,
  getUser,
  imgPromise,
  getTopUser
};