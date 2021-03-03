const helpers = require('../_helpers')
const db = require('../models')
const Like = db.Like

const tweetController = {
  like: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  unLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        like.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  }
}

module.exports = tweetController
