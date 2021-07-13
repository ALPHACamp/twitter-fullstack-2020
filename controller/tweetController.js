const { sequelize } = require('../models')
const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const user = {
        id: helpers.getUser(req).id,
        avatar: helpers.getUser(req).avatar
      }

      const tweets = await Tweet.findAndCountAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'updatedAt'],
        include: [
          { model: User, attributes: ['id', 'avatar', 'name', 'account'] }
        ],
        order: [['updatedAt', 'DESC']]
      })

      let Data = []
      Data = tweets.rows.map(async (tweet, index) => {
        const [replyCount, likeCount] = await Promise.all([
          Reply.findAndCountAll({
            raw: true,
            nest: true,
            where: { TweetId: tweet.id },
          }),
          Like.findAndCountAll({
            raw: true,
            nest: true,
            where: { TweetId: tweet.id },
          }),
        ])
        return {
          ...tweet,
          replyCount: replyCount.count,
          likeCount: likeCount.count
        }
      })

      Promise.all(Data).then(data => {
        return res.render('index', {
          data,
          user,
          topFollowing
        })
      })
    } catch (err) {
      console.warn(err)
      // return res.redirect('/') // 假定回到首頁
    }
  },

  getTweet: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const { tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId, {
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ]
      })
      const replies = await Reply.findAndCountAll({
        raw: true,
        nest: true,
        where: { TweetId: tweetId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ]
      })
      const likes = await Like.findAll({
        raw: true,
        nest: true,
        where: { TweetId: tweet.id },
        attributes: [
          [sequelize.fn('count', sequelize.col('id')), 'likeCounts']
        ]
      })

      return res.render('singleTweet', {
        tweet,
        replyCount: replies.count,
        reply: replies.rows,
        likeCount: likes[0].likeCounts,
        topFollowing
      })

    } catch (err) {
      console.warn(err)
    }
  },

  postTweet: async (req, res) => {
    try {
      const { description } = req.body
      if (description === '') {
        return res.redirect('/')
      }

      await Tweet.create({
        description: description,
        UserId: helpers.getUser(req).id
      })
      return res.redirect('/')
    } catch (err) {
      console.warn(err)
    }
  }
}

module.exports = tweetController