// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
const { getUser } = require('../_helpers')
const { User, Tweet, Like, Reply } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const tweetcontroller = {
  getTweets: (req, res, next) => {
    console.log('here is tweets.')
    const currentUser = getUser(req)
    res.render('tweets') //, { currentUser }
    Promise.all([User.findByPk(currentUser.id, {
      include: [
        // tweets
        { model: Comment, include: Restaurant },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' }
      ],
      order: [
        [{ model: Comment }, 'createdAt', 'DESC']
      ]
    }),
    Comment.findAndCountAll({
      where: { userId: req.params.id }
    }),
    Comment.findAll({
      include: Restaurant,
      where: { userId: req.params.id },
      group: ['restaurant_id'],
      nest: true,
      raw: true
    })
    ])
      .then(([targetUser, totalComments, commentedRestaurants]) => {
        if (!targetUser) throw new Error("User doesn't exist!")
        const isFollowed = req.user.Followings.some(f => f.id === targetUser.id)
        res.render('tweets', {
          targetUser: targetUser.toJSON(), // 查看其他使用者
          user: currentUser, // 現在登入的使用者
          totalComments,
          commentedRestaurants,
          isFollowed
        })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetcontroller
