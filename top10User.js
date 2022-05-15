const { User, Followship } = require('./models')
const helpers = require('./_helpers')
const Sequelize = require('sequelize')

// async function getTop10User (req) {
//   const top10 = await Followship.findAll({
//     attributes: ['followingId', [Sequelize.fn('COUNT', Sequelize.col('followerId')), 'count']],
//     group: ['followingId'],
//     order: [[Sequelize.col('count'), 'DESC']],
//     limit: 10,
//     raw: true,
//     nest: true
//   })
//   const top10userId = top10.map(user => user.followingId)
//   const top10User = await User.findAll({
//     where: { id: top10userId },
//     attributes: ['id', 'name', 'account', 'avatar'],
//     raw: true,
//     nest: true
//   })
//   return top10User.map(cf => ({
//     ...cf,
//     isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === cf.id)
//   }))
// }

function getTop10User (req) {
  Followship.findAll({
    attributes: ['followingId', [Sequelize.fn('COUNT', Sequelize.col('followerId')), 'count']],
    group: ['followingId'],
    order: [[Sequelize.col('count'), 'DESC']],
    limit: 10,
    raw: true,
    nest: true
  })
    .then(top10 => top10.map(user => user.followingId))
    .then(top10userId => {
      return User.findAll({
        where: { id: top10userId },
        attributes: ['id', 'name', 'account', 'avatar'],
        raw: true,
        nest: true
      })
    })
    .then(top10User => {
      return top10User.map(cf => ({
        ...cf,
        isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === cf.id)
      }))
    })
}

module.exports = getTop10User
