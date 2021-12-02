const helpers = require('../_helpers')

const db = require('../models')
const Like = db.Like 

const likeController = {
  postLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then((like) => {
        return res.redirect('back')
      })
  },

  deleteLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then((like) => {
        return res.redirect('back')
      })
  }
}

module.exports = likeController