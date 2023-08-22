const { User } = require('../models')

const likeController = {
  getLikes: (req, res, next) => {
    return User.findByPk(req.params.id)
    .then(user => {
      return res.render('user/user-likes', {
        users: user.toJSON()
      })
    })
  }
}

module.exports = likeController