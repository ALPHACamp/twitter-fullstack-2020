const { User, Tweet } = require('../models')

async function getUser(req, res, next) {
  const user = await User.findByPk(1,
    {
      include: [
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
      nest: true
    }
  )
  req.user = user.toJSON()
  next();
}


module.exports = getUser;