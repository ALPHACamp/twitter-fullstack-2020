const { User, Tweet, reply, Followship, Like } = require('../models')
const helpers = require('../_helpers')

const userServices = {
  getLikeCount: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followers'
        }
      })
      const FollowerCount = user.Followers.length
      return cb(null, FollowerCount)
    } catch (error) {
      cb(error)
    }
  }
}


module.exports = userServices