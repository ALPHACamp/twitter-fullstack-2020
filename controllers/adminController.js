const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Followships = db.Followships
const Reply = db.Reply
const Like = db.Like

let adminController = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login');
  },

  getTweets: (req, res) => {
    Tweet.findAll({ raw: true, nest: true, include: User, }).then(tweets => {
      const data = tweets.map(r => ({
        ...r,
        userName: r.User.name,
        userAvatar: r.User.avatar,
        description: r.description.substring(0, 50),
        createdA: r.createdAt
      }))
      console.log(data)
      return res.render('admin/tweetsHome', { tweets: data })
    })
  },

  getUsers: (req, res) => {
    User.findAll({
      include: [
        Tweet,
        { model: Tweet, as: 'whoLikeTweet' },
        { model: Tweet, as: 'UserReply' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    })
      .then( async users => {
        /* let UsersId = users.map(u => ({ ...u.dataValues }).id)    */
        users = users.map(async r => ({          
          ...r.dataValues,
          LikeCount: r.whoLikeTweet.length,
          ReplyCount: r.UserReply.length,
          FollowerCount: r.Followers.length,
          FollowingCount: r.Followings.length,
          TweetCount: await Tweet.count({ where: { UserId: r.id } }).then(tweetsNumber => { return tweetsNumber }),
        }))
        console.log(users)
        users = users.sort((a, b) => (b.TweetCount - a.TweetCount))
        res.render('admin/tweetsUser', { users: users })
      })
  },

  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id)
      .then((Tweet) => {
        Tweet.destroy()
          .then((Tweet) => {
            req.flash('success_messages', '刪除成功！')
            return res.redirect('/admin/tweets')
          })
      })
  },
}


module.exports = adminController;
