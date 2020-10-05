
const tweetService = require('../services/tweetService')
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const helpers = require('../_helpers');

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Reply,
        Like
      ],
      order: [['createdAt', 'DESC']]
    })
      .then((tweets) => {
        const data = tweets.map((t) => ({
          ...t.dataValues
        }))
        const likes = helpers.getUser(req).Likes
        const isLiked = likes.map((i) => i.id).includes(data.id)
        return res.render('tweets', {
          isLiked: isLiked,
          tweets: data,
          userSelf: helpers.getUser(req)
        })
      })
  },

  postTweets: (req, res) => {
    const tweetText = req.body.tweetText.trim()
    if (!tweetText || tweetText.length > 140) return res.redirect('back')
    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: tweetText,
    })
      .then(() => {
        req.flash('successFlashMessage', '成功新增推文!')
        return res.redirect('/tweets')
      })
      .catch(() => {
        req.flash('errorFlashMessage', '新增推文失敗!')
        return res.redirect('back')
      })
  },

  postLike: (req, res) => {
    console.log('req.params', req.params)
    Like.create({
      UserId: helpers.getUser(req).id,
      Position: tweet,
      PositionId: req.params.id,
      isLike: true,
    })

  
  },

  postUnlike: (req, res) => {

  },


}

module.exports = tweetController