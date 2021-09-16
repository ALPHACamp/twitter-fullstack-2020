const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {
    return res.render('tweets')
  }, 
  addTweet: async (req, res) => {
    try {
      const { description } = req.body
      const tweet = await Tweet.create({
        description,
        UserId: req.user.id
      })
      return res.redirect('/tweets')
    } catch(err) {
      console.warn(err)
    }   
  },
  getTweet: (req, res) => {

  }, 
  postReplies: (req, res) => {

  },
  addLike: (req, res) => {

  }, 
  removeLike: (req, res) =>{

  }
}

module.exports = tweetController