const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: async (req, res) => {
    let tweets = await Tweet.findAll({
       include: [
        User,
        { model: User, as: 'TweetWhoLike' },
        { model: User, as: 'whoReply' },
      ]
    })
    
    
       data = tweets.map( r => ({
        ...r.dataValues,
        userId:r.User.id,
        userName: r.User.name,
        userAvatar: r.User.avatar,
        userAccount: r.User.account,
        description: r.description,
        createdA: r.createdAt,
        likeCount:r.TweetWhoLike.length,
        replayCount:r.whoReply.length,
      }))
      console.log(data[1])
      return res.render('tweetsHome', { tweets: data })
    
  },
    getTweet: async (req, res) => {
      const id = req.params.id
      const tweet = await Tweet.findOne({
        where: { id },
        include: [
          User, 
          { model: User, as: 'whoReply'}
        ]
      })
      const totalLike = await Like.count({
        where: { UserId: id }
      })
      
      const totalComment = tweet.toJSON().whoReply.length
      const totalCount = {
        totalLike, totalComment
      }
      res.render('tweet',{ tweet: tweet.toJSON(), totalCount })
    }   
}
module.exports = tweetController