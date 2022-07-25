// getTweets (進到個人首頁渲染出所有資料)/ 
const tweetcontroller = {
  getTweets: (req, res) => {
    return res.render('tweets')
  },
  getUser: (req, res, next) => {
    const currentUser = getUser(req)
    Promise.all([User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
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
        res.render('users/profile', {
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
