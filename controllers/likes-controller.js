const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const likesController = {
  getLikes: (req, res, next) => { // 取得喜歡的內容
    const isUser = helpers.getUser(req).id === Number(req.params.id)
    return User.findByPk((req.params.id), {
      where: { role: 'user' },
      include: [
        Tweet,
        { model: Tweet, as: 'LikedTweets', include: [Reply] },
        { model: Tweet, as: 'LikedTweets', include: [Like] },
        { model: Tweet, as: 'LikedTweets', include: [User] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [
        ['LikedTweets', 'Likes', 'id', 'DESC']
      ]
    })
      .then(user => {
        const isLiked = helpers.getUser(req)?.LikedTweets?.some(l => l.id === req.user.id)
        return res.render('like-content', {
          users: user.toJSON(), isLiked, isUser
        })
      })
      .catch(err => next(err))
  }
}

module.exports = likesController
