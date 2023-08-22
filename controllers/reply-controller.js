const { User } = require('../models')


const replyController = {
  getReplies: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('user/user-replies', {
          users: user.toJSON()
        })
      })
  }
}

module.exports = replyController