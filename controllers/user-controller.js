const { User, Tweet, Like, Reply } = require('../models')

const userController = {
  //  add controller action here
  getUser: (req, res, next) => {
    const id = req.params.userId
    return User.findByPk(id, {
      include: [
        { model: Tweet, include: Like },
        { model: Tweet, include: Reply }
      ]
      // where: { userId: id }
    })
      .then(user => res.render('users/tweets', { user: user.toJSON() })
      )
  },
  getUserReplies: (req, res, next) => {
    const id = req.params.userId
    return User.findByPk(id, {
      include: [
        { model: Tweet, include: Like },
        { model: Tweet, include: Reply },
        { model: Reply, include: { model: Tweet, include: User } },
        {
          model: Like,
          include: [
            { model: Tweet, include: User },
            { model: Tweet, include: Reply },
            { model: Tweet, include: Like }
          ]
        }
      ]
      // where: { userId: id }
    })
      .then(user => res.render('users/replies', { user: user.toJSON() })
      )
  },
  getUserLikes: (req, res, next) => {
    const id = req.params.userId
    return User.findByPk(id, {
      include: [
        { model: Tweet, include: Like },
        { model: Tweet, include: Reply }
      ]
      // where: { userId: id }
    })
      .then(user => res.render('users/likes', { user: user.toJSON() })
      )
  }
}

module.exports = userController
