const tweetService = require('../services/tweetService')
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const helpers = require('../_helpers');


const tweetController = {

  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.render('tweets', data)
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
      req.flash('successFlashMessage','成功新增推文!')
      return res.redirect('back')
    })
    .catch(() => {
      req.flash('errorFlashMessage', '新增推文失敗!')
      return res.redirect('back')
    })
  },
}

module.exports = tweetController