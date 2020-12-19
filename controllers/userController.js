const { sequelize } = require('../models')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {
  getUser: async (req, res) => {
    // const user = await User.findByPk(req.params.id, {
    //   raw: true,
    //   nest: true,
    //   include: [
    //     { model: User, as: 'Followers' },
    //     { model: User, as: 'Followings' },
    //     { model: Tweet, include: [Reply, Like] }
    //   ]
    // })

    // const users = await User.findAll({ raw: true, nest: true })

    // await console.log('hahahaha   ' + user)

    // await res.render('profile', { user: user.toJSON() })
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Tweet.findAll({
        // raw: true,
        // nest: true,
        where: { UserId: req.params.id },
        include: [User, Reply, { model: Like, include: [User] }],
        order: [['createdAt', 'DESC']],
      })
      ,
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
    ]).then(([user, tweets, users]) => {
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        countLikes: tweet.Likes.length,
        countReplies: tweet.Replies.length,
        User: tweet.User.dataValues,
        isLike: tweet.Likes.map(d => d.UserId).includes(Number(req.params.id)),
      }))
      console.log(tweets)

      users = users.map(user => ({
        ...user.dataValues,
        isFollowed: user.Followers.map(d => d.id).includes(Number(req.params.id))
      }))
      // console.log(users)

      return res.render('profile', {
        user: user.toJSON(),
        FollowersLength: user.dataValues.Followers.length,
        FollowingsLength: user.dataValues.Followings.length,
        tweetsLength: tweets.length,
        data: tweets,
        users: users
      })
    })
  }
}

module.exports = userController